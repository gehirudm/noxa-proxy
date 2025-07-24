import { AuthUser } from "@/lib/auth-utils";

/**
 * Represents the type of payment
 */
export enum PaymentType {
  ONE_TIME = "one_time",
  RECURRING = "recurring"
}

/**
 * Represents the status of a payment
 */
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELED = "canceled"
}

/**
 * Common metadata for all payment types
 */
export interface BasePaymentMetadata {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  customerEmail: string;
}

/**
 * Metadata specific to one-time payments
 */
export interface OneTimePaymentMetadata extends BasePaymentMetadata {
  type: PaymentType.ONE_TIME;
}

/**
 * Metadata specific to recurring payments
 */
export interface RecurringPaymentMetadata extends BasePaymentMetadata {
  type: PaymentType.RECURRING;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  trialPeriodDays?: number;
}

/**
 * Union type for all payment metadata
 */
export type PaymentMetadata = OneTimePaymentMetadata | RecurringPaymentMetadata;

/**
 * Response from creating a payment
 */
export interface CreatePaymentResponse {
  success: boolean;
  redirectUrl?: string;
  paymentId?: string;
  providerReference?: string;
  error?: string;
}

/**
 * Response from verifying a payment
 */
export interface VerifyPaymentResponse {
  success: boolean;
  status: PaymentStatus;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
  error?: string;
}

/**
 * Response from canceling a payment
 */
export interface CancelPaymentResponse {
  success: boolean;
  error?: string;
}

/**
 * Response from refunding a payment
 */
export interface RefundPaymentResponse {
  success: boolean;
  refundId?: string;
  error?: string;
}

/**
 * Webhook event data structure
 */
export interface WebhookEvent {
  type: string;
  paymentId: string;
  status: PaymentStatus;
  metadata: Record<string, any>;
  rawData: any;
}

/**
 * Configuration options for payment providers
 */
export interface PaymentProviderConfig {
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  testMode?: boolean;
  [key: string]: any;
}

/**
 * Interface that all payment providers must implement
 */
export interface PaymentProvider {
  /**
   * Unique identifier for the payment provider
   */
  readonly providerId: string;
  
  /**
   * Human-readable name of the payment provider
   */
  readonly displayName: string;
  
  /**
   * Initialize the payment provider with configuration
   */
  initialize(config: PaymentProviderConfig): Promise<void>;
  
  /**
   * Create a one-time payment
   */
  createOneTimePayment(
    authUser: AuthUser,
    metadata: OneTimePaymentMetadata,
    successUrl: string,
    cancelUrl: string
  ): Promise<CreatePaymentResponse>;
  
  /**
   * Create a recurring payment (subscription)
   */
  createRecurringPayment(
    authUser: AuthUser,
    metadata: RecurringPaymentMetadata,
    successUrl: string,
    cancelUrl: string
  ): Promise<CreatePaymentResponse>;
  
  /**
   * Verify the status of a payment
   */
  verifyPayment(paymentId: string): Promise<VerifyPaymentResponse>;
  
  /**
   * Cancel a payment or subscription
   */
  // cancelPayment(paymentId: string): Promise<CancelPaymentResponse>;
  
  /**
   * Refund a completed payment
   */
  // refundPayment(paymentId: string, amount?: number): Promise<RefundPaymentResponse>;
  
  /**
   * Process a webhook event from the payment provider
   */
  handleWebhook(payload: any, signature?: string): Promise<WebhookEvent>;
  
  /**
   * Get customer information from the payment provider
   */
  getCustomerInfo?(customerId: string): Promise<Record<string, any>>;
  
  /**
   * Get payment methods for a customer
   */
  getPaymentMethods?(customerId: string): Promise<Array<Record<string, any>>>;
}