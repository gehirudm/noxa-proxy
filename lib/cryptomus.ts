import crypto from "crypto";

const API_BASE = "https://api.cryptomus.com";
const MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID!;
const PAYMENT_KEY = process.env.CRYPTOMUS_PAYMENT_KEY!;

function hashHmacSHA256(body: object, key: string): string {
  return crypto
    .createHmac("sha256", key)
    .update(JSON.stringify(body))
    .digest("hex");
}

export class Cryptomus {
  private async request<T = any>(
    path: string,
    method: "GET" | "POST",
    body?: object,
  ): Promise<T> {
    const headers: HeadersInit = {
      merchant: MERCHANT_ID,
      "Content-Type": "application/json",
    };

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
      throw new Error(`Cryptomus API error: ${res.status} ${error.message || res.statusText}`);
    }

    const data = await res.json();
    return data.result || data;
  }

  async createInvoice({
    orderId,
    amount,
    currency = "USD",
    network,
    callbackUrl,
    returnUrl,
  }: {
    orderId: string;
    amount: string;
    currency?: string;
    network: string;
    callbackUrl: string;
    returnUrl: string;
  }) {
    return this.request("/v1/payments", "POST", {
      order_id: orderId,
      amount,
      currency,
      network,
      url_callback: callbackUrl,
      return_url: returnUrl,
    });
  }

  async getPaymentStatus(uuidOrOrderId: string) {
    return this.request(`/v1/payments/${uuidOrOrderId}`, "GET");
  }

  async testWebhook({
    url_callback,
    currency,
    network,
    order_id,
    uuid,
    status,
  }: {
    url_callback: string;
    currency: string;
    network: string;
    uuid?: string;
    order_id?: string;
    status: string;
  }) {
    return this.request("/v1/test-webhook/payment", "POST", {
      url_callback,
      currency,
      network,
      order_id,
      uuid,
      status,
    });
  }

  async verifyWebhook(body: object, receivedSignature: string) {
    const crypto = await import("crypto");
    const signature = crypto
      .createHmac("sha256", PAYMENT_KEY)
      .update(JSON.stringify(body))
      .digest("hex");

    return signature === receivedSignature;
  }
}

export const cryptomus = new Cryptomus();
