import crypto from "crypto";
import { AuthUser } from "@/lib/auth-utils";
import {
  PaymentProvider,
  PaymentProviderConfig,
  OneTimePaymentMetadata,
  RecurringPaymentMetadata,
  CreatePaymentResponse,
  VerifyPaymentResponse,
  WebhookEvent,
  PaymentStatus,
  PaymentType
} from "./PaymentProvider";

const API_BASE = "https://api.cryptomus.com";

function canonicalStringify(obj: object): string {
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = (obj as any)[key];
        return acc;
      }, {} as Record<string, any>)
  );
}

function hashHmacSHA256(body: object, key: string): string {
  return crypto
    .createHmac("sha256", key)
    .update(canonicalStringify(body))
    .digest("hex");
}

function generateCryptomusSignature(body: object | undefined, apiKey: string): string {
  const jsonBody = body ? JSON.stringify(body) : '';
  const base64Body = Buffer.from(jsonBody).toString('base64');
  return crypto.createHash('md5').update(base64Body + apiKey).digest('hex');
}

class CryptomusPaymentProvider {
  readonly providerId = "cryptomus";
  readonly displayName = "Cryptomus";

  private merchantId: string = "";
  private paymentKey: string = "";
  private webhookSecret: string | undefined;
  private testMode: boolean = false;

  async initialize(config: PaymentProviderConfig): Promise<void> {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error("Cryptomus requires both apiKey (merchant ID) and apiSecret (payment key)");
    }

    this.merchantId = config.apiKey;
    this.paymentKey = config.apiSecret;
    this.webhookSecret = config.webhookSecret;
    this.testMode = config.testMode || false;
  }

  private async request<T = any>(
    path: string,
    method: "GET" | "POST",
    body?: object,
  ): Promise<T> {
    if (!this.merchantId || !this.paymentKey) {
      throw new Error("Cryptomus is not initialized. Call initialize() first.");
    }

    const headers: HeadersInit = {
      merchant: this.merchantId,
      "Content-Type": "application/json",
    };

    if (body) {
      headers.sign = generateCryptomusSignature(body, this.paymentKey);
    } else {
      headers.sign = generateCryptomusSignature(undefined, this.paymentKey);
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error(error);
      throw new Error(`Cryptomus API error: ${res.status} ${error.message || res.statusText}`);
    }

    const data = await res.json();
    return data.result || data;
  }

  async createOneTimePayment(
    authUser: AuthUser,
    metadata: OneTimePaymentMetadata,
    successUrl: string,
    returnUrl: string,
    callbackUrl: string
  ): Promise<CreatePaymentResponse> {
    try {
      const response = await this.request("/v1/payment", "POST", {
        order_id: metadata.orderId,
        amount: metadata.amount.toString(),
        currency: metadata.currency,
        url_callback: callbackUrl, // This should be a webhook URL in production
        url_return: returnUrl,
        url_success: successUrl,
        is_payment_multiple: false,
        lifetime: 3600, // 1 hour payment window
        additional_data: JSON.stringify({
          userId: metadata.userId,
          description: metadata.description || `Payment ${metadata.orderId}`,
          email: metadata.customerEmail
        })
      });

      return {
        success: true,
        redirectUrl: response.url,
        paymentId: response.uuid,
        providerReference: response.order_id,
      };
    } catch (error) {
      console.error("Cryptomus payment creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error creating payment",
      };
    }
  }

  async createRecurringPayment(
    authUser: AuthUser,
    metadata: RecurringPaymentMetadata,
    successUrl: string,
    returnUrl: string,
    callbackUrl: string
  ): Promise<CreatePaymentResponse> {
    const oneTimeMetadata = {
      ...metadata,
      type: PaymentType.ONE_TIME as const
    }
    return this.createOneTimePayment(authUser, oneTimeMetadata, successUrl, returnUrl, callbackUrl);
  }

  async verifyPayment(paymentId: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await this.request(`/v1/payment/${paymentId}`, "GET");

      let status: PaymentStatus;
      switch (response.status) {
        case "paid":
          status = PaymentStatus.COMPLETED;
          break;
        case "failed":
          status = PaymentStatus.FAILED;
          break;
        case "canceled":
          status = PaymentStatus.CANCELED;
          break;
        case "refunded":
          status = PaymentStatus.REFUNDED;
          break;
        default:
          status = PaymentStatus.PENDING;
      }

      return {
        success: true,
        status,
        amount: parseFloat(response.amount),
        currency: response.currency,
        metadata: {
          orderId: response.order_id,
          network: response.network,
          paymentAmount: response.payment_amount,
          paymentCurrency: response.payment_currency,
          additionalData: response.additional_data
        },
      };
    } catch (error) {
      console.error("Cryptomus payment verification error:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error instanceof Error ? error.message : "Unknown error verifying payment",
      };
    }
  }

  async handleWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
    if (!signature) {
      throw new Error("Signature is required for Cryptomus webhooks");
    }

    // Verify the webhook signature
    const isValid = this.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    // Map Cryptomus status to our PaymentStatus
    let status: PaymentStatus;
    switch (payload.status) {
      case "paid":
        status = PaymentStatus.COMPLETED;
        break;
      case "failed":
        status = PaymentStatus.FAILED;
        break;
      case "canceled":
        status = PaymentStatus.CANCELED;
        break;
      case "refunded":
        status = PaymentStatus.REFUNDED;
        break;
      default:
        status = PaymentStatus.PENDING;
    }

    return {
      type: `payment_${payload.status}`,
      paymentId: payload.uuid,
      status,
      metadata: {
        orderId: payload.order_id,
        amount: payload.amount,
        currency: payload.currency,
        network: payload.network,
        additionalData: payload.additional_data
      },
      rawData: payload,
    };
  }

  private verifyWebhookSignature(payload: any, receivedSignature: string): boolean {
    if (!this.paymentKey) {
      throw new Error("Payment key is not set");
    }

    const signature = hashHmacSHA256(payload, this.paymentKey);
    return signature === receivedSignature;
  }
}

// Initialize the Cryptomus provider
export const cryptomusProvider = new CryptomusPaymentProvider();
cryptomusProvider.initialize({
  apiKey: process.env.CRYPTOMUS_MERCHANT_ID!,
  apiSecret: process.env.CRYPTOMUS_PAYMENT_KEY!,
  testMode: process.env.NODE_ENV !== 'production'
}).catch(error => {
  console.error("Failed to initialize Cryptomus provider:", error);
});