import { AuthUser } from "@/lib/auth-utils";
import { PROXY_PLANS } from "@/lib/payment/providers/StripePaymentProvider";

/**
 * Payment provider options
 */
export type PaymentProvider = "stripe" | "cryptomus";

/**
 * Common interface for payment responses
 */
export interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
  orderId?: string;
  subscriptionId?: string;
}

/**
 * Payment status types
 */
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

/**
 * Subscription status types
 */
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "unpaid" | "trialing" | "incomplete" | "incomplete_expired";

/**
 * Payment type options
 */
export type PaymentType = "proxy_purchase" | "wallet_deposit" | "subscription_payment";

/**
 * Interface for payment verification response
 */
export interface PaymentVerificationResponse {
  success: boolean;
  status: string;
  error?: string;
}

/**
 * Interface for payment processing response
 */
export interface PaymentProcessingResponse {
  success: boolean;
  error?: string;
}

/**
 * Interface for subscription management response
 */
export interface SubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  status?: SubscriptionStatus;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  error?: string;
}

/**
 * Interface for proxy plan purchase parameters
 */
export interface ProxyPlanPurchaseParams {
  proxyType: keyof typeof PROXY_PLANS;
  tier: "basic" | "pro" | "enterprise";
  paymentProvider: PaymentProvider;
  cryptoNetwork?: string; // Only required for Cryptomus
  isRecurring?: boolean; // Whether this should be a recurring subscription
  billingCycle?: "monthly" | "yearly"; // Billing cycle for recurring subscriptions
  trialPeriodDays?: number; // Optional trial period in days
}

/**
 * Interface for wallet deposit parameters
 */
export interface WalletDepositParams {
  amount: number; // Amount in dollars
  paymentProvider: PaymentProvider;
  cryptoNetwork?: string; // Only required for Cryptomus
}

/**
 * Interface for payment processing parameters
 */
export interface PaymentProcessingParams {
  orderId: string;
  provider: PaymentProvider;
  planType?: keyof typeof PROXY_PLANS;
  planTier?: "basic" | "pro" | "enterprise";
  amount?: number;
  type?: PaymentType;
  subscriptionId?: string;
}

/**
 * Interface for payment cancellation parameters
 */
export interface PaymentCancellationParams {
  orderId: string;
  provider: PaymentProvider;
}

/**
 * Interface for subscription management parameters
 */
export interface SubscriptionManagementParams {
  subscriptionId: string;
  provider: PaymentProvider;
  action: "cancel" | "reactivate" | "update";
  updateData?: {
    planType?: keyof typeof PROXY_PLANS;
    tier?: "basic" | "pro" | "enterprise";
    billingCycle?: "monthly" | "yearly";
  };
  cancelAtPeriodEnd?: boolean; // Whether to cancel at the end of the current period
}

/**
 * Payment Service interface for handling payment operations
 */
export interface IPaymentService {
  /**
   * Handles proxy plan purchase using the specified payment provider
   */
  handleProxyPlanPurchase(
    authUser: AuthUser,
    params: ProxyPlanPurchaseParams
  ): Promise<PaymentResponse>;

  /**
   * Handles wallet deposit using the specified payment provider
   */
  handleWalletDeposit(
    authUser: AuthUser,
    params: WalletDepositParams
  ): Promise<PaymentResponse>;

  /**
   * Verifies a payment status (can be used to check if a payment was completed)
   */
  verifyPaymentStatus(
    orderId: string
  ): Promise<PaymentVerificationResponse>;

  /**
   * Processes a successful payment (to be called after payment confirmation)
   */
  processSuccessfulPayment(
    params: PaymentProcessingParams
  ): Promise<PaymentProcessingResponse>;

  /**
   * Handles payment cancellation
   */
  handlePaymentCancellation(
    params: PaymentCancellationParams
  ): Promise<PaymentProcessingResponse>;

  /**
   * Gets subscription details
   */
  // getSubscriptionDetails(
  //   subscriptionId: string,
  //   provider: PaymentProvider
  // ): Promise<SubscriptionResponse>;

  /**
   * Lists all active subscriptions for a user
   */
  // listUserSubscriptions(
  //   authUser: AuthUser
  // ): Promise<{
  //   success: boolean;
  //   subscriptions?: Array<{
  //     subscriptionId: string;
  //     provider: PaymentProvider;
  //     status: string;
  //     planType: keyof typeof PROXY_PLANS;
  //     tier: string;
  //     currentPeriodStart: Date;
  //     currentPeriodEnd: Date;
  //     cancelAtPeriodEnd: boolean;
  //   }>;
  //   error?: string;
  // }>;

  /**
   * Processes a subscription renewal webhook event
   */
  processSubscriptionRenewal(
    subscriptionId: string,
    provider: PaymentProvider,
    eventData: any
  ): Promise<PaymentProcessingResponse>;

  /**
   * Processes a subscription cancellation webhook event
   */
  processSubscriptionCancellation(
    subscriptionId: string,
    provider: PaymentProvider,
    eventData: any
  ): Promise<PaymentProcessingResponse>;
}