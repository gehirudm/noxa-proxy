import Stripe from "stripe";
import { PROXY_PLANS, type ProxyPlan } from "../../proxy-plans";
import { AuthUser } from "@/lib/auth-utils";
import {
  PaymentProvider,
  PaymentProviderConfig,
  OneTimePaymentMetadata,
  RecurringPaymentMetadata,
  CreatePaymentResponse,
  VerifyPaymentResponse,
  CancelPaymentResponse,
  RefundPaymentResponse,
  WebhookEvent,
  PaymentStatus,
  PaymentType
} from "./PaymentProvider";

export { PROXY_PLANS, type ProxyPlan };

// Create a singleton instance of the Stripe provider
class StripePaymentProvider implements PaymentProvider {
  readonly providerId = "stripe";
  readonly displayName = "Stripe";
  
  private stripeClient: Stripe | null = null;
  private webhookSecret: string | undefined;
  private testMode: boolean = false;
  
  async initialize(config: PaymentProviderConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error("Stripe API key is required");
    }
    
    this.stripeClient = new Stripe(config.apiKey, {
      apiVersion: "2025-06-30.basil",
    });
    
    this.webhookSecret = config.webhookSecret;
    this.testMode = config.testMode || false;
  }
  
  /**
   * Get the initialized Stripe client
   */
  get stripe(): Stripe {
    if (!this.stripeClient) {
      throw new Error("Stripe client is not initialized. Call initialize() first.");
    }
    return this.stripeClient;
  }
  
  async createOneTimePayment(
    authUser: AuthUser,
    metadata: OneTimePaymentMetadata,
    successUrl: string,
    cancelUrl: string
  ): Promise<CreatePaymentResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: metadata.customerEmail,
        line_items: [
          {
            price_data: {
              currency: metadata.currency.toLowerCase(),
              product_data: {
                name: metadata.description || `Order ${metadata.orderId}`,
              },
              unit_amount: Math.round(metadata.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: metadata.userId,
          orderId: metadata.orderId,
          provider: this.providerId,
        },
      });
      
      return {
        success: true,
        redirectUrl: session.url || undefined,
        paymentId: session.id,
        providerReference: session.id,
      };
    } catch (error) {
      console.error("Stripe payment creation error:", error);
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
    cancelUrl: string
  ): Promise<CreatePaymentResponse> {
    try {
      // Create a price for the subscription
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(metadata.amount * 100), // Convert to cents
        currency: metadata.currency.toLowerCase(),
        recurring: {
          interval: metadata.interval,
          interval_count: metadata.intervalCount,
        },
        product_data: {
          name: metadata.description || `Subscription ${metadata.orderId}`,
        },
      });
      
      // Create a checkout session with the price
      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: metadata.customerEmail,
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: metadata.userId,
          orderId: metadata.orderId,
          provider: this.providerId,
        },
        subscription_data: {
          trial_period_days: metadata.trialPeriodDays,
        },
      });
      
      return {
        success: true,
        redirectUrl: session.url || undefined,
        paymentId: session.id,
        providerReference: session.id,
      };
    } catch (error) {
      console.error("Stripe subscription creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error creating subscription",
      };
    }
  }
  
  async verifyPayment(paymentId: string): Promise<VerifyPaymentResponse> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(paymentId);
      
      let status: PaymentStatus;
      switch (session.status) {
        case "complete":
          status = PaymentStatus.COMPLETED;
          break;
        case "expired":
          status = PaymentStatus.CANCELED;
          break;
        default:
          status = PaymentStatus.PENDING;
      }
      
      return {
        success: true,
        status,
        amount: session.amount_total ? session.amount_total / 100 : undefined,
        currency: session.currency?.toUpperCase(),
        metadata: session.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error("Stripe payment verification error:", error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error instanceof Error ? error.message : "Unknown error verifying payment",
      };
    }
  }
  
  async cancelPayment(paymentId: string): Promise<CancelPaymentResponse> {
    try {
      // First check if this is a subscription
      const session = await this.stripe.checkout.sessions.retrieve(paymentId);
      
      if (session.subscription) {
        // Cancel the subscription
        await this.stripe.subscriptions.cancel(session.subscription as string);
      } else if (session.payment_intent) {
        // Cancel the payment intent
        await this.stripe.paymentIntents.cancel(session.payment_intent as string);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Stripe payment cancellation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error canceling payment",
      };
    }
  }
  
  async refundPayment(paymentId: string, amount?: number): Promise<RefundPaymentResponse> {
    try {
      // First get the payment intent from the session
      const session = await this.stripe.checkout.sessions.retrieve(paymentId);
      
      if (!session.payment_intent) {
        return { success: false, error: "No payment intent found for this session" };
      }
      
      // Create the refund
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: session.payment_intent as string,
      };
      
      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert to cents
      }
      
      const refund = await this.stripe.refunds.create(refundParams);
      
      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error) {
      console.error("Stripe refund error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error processing refund",
      };
    }
  }
  
  async handleWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
    if (!this.webhookSecret || !signature) {
      throw new Error("Webhook secret and signature are required");
    }
    
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
      
      let status: PaymentStatus;
      let paymentId = '';
      
      switch (event.type) {
        case 'checkout.session.completed':
          status = PaymentStatus.COMPLETED;
          paymentId = (event.data.object as Stripe.Checkout.Session).id;
          break;
        case 'payment_intent.succeeded':
          status = PaymentStatus.COMPLETED;
          paymentId = (event.data.object as Stripe.PaymentIntent).id;
          break;
        case 'payment_intent.payment_failed':
          status = PaymentStatus.FAILED;
          paymentId = (event.data.object as Stripe.PaymentIntent).id;
          break;
        case 'charge.refunded':
          status = PaymentStatus.REFUNDED;
          paymentId = (event.data.object as Stripe.Charge).payment_intent as string;
          break;
        default:
          status = PaymentStatus.PENDING;
          paymentId = '';
      }
      
      return {
        type: event.type,
        paymentId,
        status,
        metadata: (event.data.object as any).metadata || {},
        rawData: event.data.object,
      };
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      throw new Error("Invalid signature");
    }
  }
  
  async getCustomerInfo(customerId: string): Promise<Record<string, any>> {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer as Record<string, any>;
  }
  
  async getPaymentMethods(customerId: string): Promise<Array<Record<string, any>>> {
    const methods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    return methods.data as Array<Record<string, any>>;
  }
}

// Initialize the Stripe provider with the API key
export const stripeProvider = new StripePaymentProvider();
stripeProvider.initialize({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  testMode: process.env.NODE_ENV !== 'production'
}).catch(error => {
  console.error("Failed to initialize Stripe provider:", error);
});