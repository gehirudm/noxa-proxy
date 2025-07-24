import { AuthUser } from "@/lib/auth-utils";
import { 
  createPayment, 
  generateOrderId, 
  getPaymentByOrderId, 
  markPaymentCompleted, 
  markPaymentFailed, 
  updatePayment, 
  updatePaymentWithCheckoutUrl, 
  createTransactionRecord,
  updateUserWalletBalance
} from "@/lib/db/payments";
import { 
  IPaymentService, 
  PaymentResponse, 
  PaymentVerificationResponse, 
  PaymentProcessingResponse, 
  SubscriptionResponse, 
  ProxyPlanPurchaseParams, 
  WalletDepositParams, 
  PaymentProcessingParams, 
  PaymentCancellationParams, 
  SubscriptionManagementParams,
  PaymentProvider,
  PaymentType
} from "@/lib/payment/services/PaymentService";
import { PROXY_PLANS } from "@/lib/payment/providers/StripePaymentProvider";
import { stripeProvider } from "@/lib/payment/providers/StripePaymentProvider";
import { PaymentStatus, PaymentType as ProviderPaymentType } from "@/lib/payment/providers/PaymentProvider";
import { db } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export class StripePaymentService implements IPaymentService {
  /**
   * Handles proxy plan purchase using Stripe
   */
  async handleProxyPlanPurchase(
    authUser: AuthUser,
    params: ProxyPlanPurchaseParams
  ): Promise<PaymentResponse> {
    if (!authUser.email || !authUser.uid) {
      return {
        success: false,
        error: "Failed to retrieve user information"
      };
    }

    const { proxyType, tier, isRecurring = false, billingCycle = "monthly", trialPeriodDays } = params;

    // Get plan details
    const plan = PROXY_PLANS[proxyType][tier];
    if (!plan) {
      return {
        success: false,
        error: "Invalid plan selection"
      };
    }

    // Generate order ID for tracking
    const orderId = generateOrderId();

    // Base URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/billing/success?orderId=${orderId}&provider=stripe&planType=${String(proxyType)}&planTier=${tier}`;
    const cancelUrl = `${baseUrl}/dashboard/billing/cancel?orderId=${orderId}&provider=stripe&planType=${String(proxyType)}&planTier=${tier}`;

    try {
      // Create payment document in Firestore
      await createPayment({
        orderId,
        userId: authUser.uid,
        provider: "stripe",
        amount: plan.price / 100, // Convert cents to dollars
        type: "proxy_purchase",
        metadata: {
          proxyType,
          tier,
          planName: plan.name,
          bandwidth: plan.bandwidth,
          isRecurring: isRecurring || plan.isRecurring,
          billingCycle: isRecurring ? billingCycle : undefined
        }
      });

      // Process payment based on whether it's recurring or one-time
      if (isRecurring || plan.isRecurring) {
        // Handle recurring payment (subscription)
        const interval = billingCycle === "yearly" ? "year" : "month";
        
        // Create metadata for the recurring payment
        const metadata = {
          type: ProviderPaymentType.RECURRING,
          orderId,
          userId: authUser.uid,
          amount: plan.price / 100,
          currency: "USD",
          description: `${plan.name} - ${billingCycle} subscription`,
          customerEmail: authUser.email,
          interval,
          intervalCount: 1,
          trialPeriodDays
        };

        // Create the recurring payment
        const paymentResponse = await stripeProvider.createRecurringPayment(
          authUser,
          metadata as any, // Type assertion needed due to interface differences
          successUrl,
          cancelUrl
        );

        if (!paymentResponse.success || !paymentResponse.redirectUrl) {
          await markPaymentFailed(
            authUser.uid,
            orderId,
            paymentResponse.error || "Failed to create Stripe subscription"
          );

          return {
            success: false,
            error: paymentResponse.error || "Failed to create Stripe subscription"
          };
        }

        // Update payment with checkout URL and provider reference
        await updatePayment(authUser.uid, orderId, {
          checkoutUrl: paymentResponse.redirectUrl,
          metadata: {
            ...plan,
            stripeSessionId: paymentResponse.paymentId,
            stripeReference: paymentResponse.providerReference
          }
        });

        return {
          success: true,
          redirectUrl: paymentResponse.redirectUrl,
          orderId
        };
      } else {
        // Handle one-time payment
        const metadata = {
          type: ProviderPaymentType.ONE_TIME,
          orderId,
          userId: authUser.uid,
          amount: plan.price / 100,
          currency: "USD",
          description: plan.name,
          customerEmail: authUser.email
        };

        // Create the one-time payment
        const paymentResponse = await stripeProvider.createOneTimePayment(
          authUser,
          metadata as any, // Type assertion needed due to interface differences
          successUrl,
          cancelUrl
        );

        if (!paymentResponse.success || !paymentResponse.redirectUrl) {
          await markPaymentFailed(
            authUser.uid,
            orderId,
            paymentResponse.error || "Failed to create Stripe checkout session"
          );

          return {
            success: false,
            error: paymentResponse.error || "Failed to create Stripe checkout session"
          };
        }

        // Update payment with checkout URL and provider reference
        await updatePayment(authUser.uid, orderId, {
          checkoutUrl: paymentResponse.redirectUrl,
          metadata: {
            ...plan,
            stripeSessionId: paymentResponse.paymentId,
            stripeReference: paymentResponse.providerReference
          }
        });

        return {
          success: true,
          redirectUrl: paymentResponse.redirectUrl,
          orderId
        };
      }
    } catch (error) {
      console.error("Payment processing error:", error);

      // Try to update the payment document with error information
      try {
        await markPaymentFailed(
          authUser.uid,
          orderId,
          error instanceof Error ? error.message : "Unknown payment processing error"
        );
      } catch (dbError) {
        console.error("Failed to update payment document with error:", dbError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown payment processing error"
      };
    }
  }

  /**
   * Handles wallet deposit using Stripe
   */
  async handleWalletDeposit(authUser: AuthUser, params: WalletDepositParams): Promise<PaymentResponse> {
    const { amount } = params;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Invalid deposit amount"
      };
    }

    // Generate order ID for tracking
    const orderId = generateOrderId();

    // Base URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/billing/success?orderId=${orderId}&provider=stripe&amount=${amount}&type=wallet_deposit`;
    const cancelUrl = `${baseUrl}/dashboard/billing/cancel?orderId=${orderId}&provider=stripe&amount=${amount}&type=wallet_deposit`;

    try {
      // Create payment document in Firestore
      await createPayment({
        orderId,
        userId: authUser.uid,
        provider: "stripe",
        amount,
        type: "wallet_deposit",
        metadata: {
          description: `Wallet Deposit - $${amount}`
        }
      });

      // Create a one-time payment for wallet deposit
      const metadata = {
        type: ProviderPaymentType.ONE_TIME,
        orderId,
        userId: authUser.uid,
        amount,
        currency: "USD",
        description: `Wallet Deposit - $${amount}`,
        customerEmail: authUser.email || "user@example.com"
      };

      // Create the one-time payment
      const paymentResponse = await stripeProvider.createOneTimePayment(
        authUser,
        metadata as any, // Type assertion needed due to interface differences
        successUrl,
        cancelUrl
      );

      if (!paymentResponse.success || !paymentResponse.redirectUrl) {
        await markPaymentFailed(
          authUser.uid,
          orderId,
          paymentResponse.error || "Failed to create Stripe checkout session"
        );

        return {
          success: false,
          error: paymentResponse.error || "Failed to create Stripe checkout session"
        };
      }

      // Update payment with checkout URL and provider reference
      await updatePaymentWithCheckoutUrl(
        authUser.uid,
        orderId,
        paymentResponse.redirectUrl
      );

      await updatePayment(authUser.uid, orderId, {
        metadata: {
          stripeSessionId: paymentResponse.paymentId,
          stripeReference: paymentResponse.providerReference
        }
      });

      return {
        success: true,
        redirectUrl: paymentResponse.redirectUrl,
        orderId
      };
    } catch (error) {
      console.error("Wallet deposit error:", error);

      // Try to update the payment document with error information
      try {
        await markPaymentFailed(
          authUser.uid,
          orderId,
          error instanceof Error ? error.message : "Unknown wallet deposit error"
        );
      } catch (dbError) {
        console.error("Failed to update payment document with error:", dbError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown wallet deposit error"
      };
    }
  }

  /**
   * Verifies a payment status
   */
  async verifyPaymentStatus(
    orderId: string
  ): Promise<PaymentVerificationResponse> {
    try {
      // Get the payment document to find the Stripe session ID
      const payment = await getPaymentByOrderId("current-user-id", orderId); // This should be replaced with actual user ID
      
      if (!payment) {
        return {
          success: false,
          status: "not_found",
          error: "Payment not found"
        };
      }

      const stripeSessionId = payment.metadata?.stripeSessionId;
      
      if (!stripeSessionId) {
        return {
          success: false,
          status: "invalid_payment",
          error: "No Stripe session ID found for this payment"
        };
      }

      // Verify the payment with Stripe
      const verificationResult = await stripeProvider.verifyPayment(stripeSessionId);
      
      if (!verificationResult.success) {
        return {
          success: false,
          status: "verification_failed",
          error: verificationResult.error || "Payment verification failed"
        };
      }

      // Map Stripe payment status to our status format
      let status: string;
      switch (verificationResult.status) {
        case PaymentStatus.COMPLETED:
          status = "completed";
          break;
        case PaymentStatus.CANCELED:
          status = "cancelled";
          break;
        case PaymentStatus.FAILED:
          status = "failed";
          break;
        case PaymentStatus.REFUNDED:
          status = "refunded";
          break;
        default:
          status = "pending";
      }

      return {
        success: true,
        status
      };
    } catch (error) {
      console.error("Error verifying payment status:", error);
      return {
        success: false,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error verifying payment"
      };
    }
  }

  /**
   * Processes a successful payment
   */
  async processSuccessfulPayment(
    params: PaymentProcessingParams
  ): Promise<PaymentProcessingResponse> {
    const { orderId, provider, planType, planTier, amount, type } = params;
    
    if (provider !== "stripe") {
      return {
        success: false,
        error: "This service only handles Stripe payments"
      };
    }

    // Get user ID from the payment document
    const payment = await getPaymentByOrderId("current-user-id", orderId); // Replace with actual user ID retrieval
    
    if (!payment) {
      return {
        success: false,
        error: "Payment not found"
      };
    }

    const userId = payment.userId;

    try {
      // Verify the payment status first
      const paymentVerification = await this.verifyPaymentStatus(orderId);

      if (!paymentVerification.success || paymentVerification.status !== "completed") {
        return {
          success: false,
          error: `Payment verification failed: ${paymentVerification.error || paymentVerification.status}`
        };
      }

      // Mark the payment as completed in our database
      await markPaymentCompleted(userId, orderId);

      // Process based on payment type
      if (payment.type === "wallet_deposit") {
        // Add funds to user's wallet
        const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
        await updateUserWalletBalance(userId, payment.amount, paymentRef);

        // Create a transaction record
        await createTransactionRecord({
          userId,
          type: "deposit",
          amount: payment.amount,
          currency: payment.currency,
          paymentId: orderId,
          paymentProvider: provider,
          description: `Wallet deposit of ${payment.currency} ${payment.amount}`,
          metadata: {
            paymentType: payment.type,
            provider
          }
        });
      } else if (payment.type === "proxy_purchase") {
        // Handle proxy purchase
        if (!planType || !planTier) {
          return {
            success: false,
            error: "Missing plan information for proxy purchase"
          };
        }

        const plan = PROXY_PLANS[planType][planTier];
        if (!plan) {
          return {
            success: false,
            error: "Invalid plan selection"
          };
        }

        // Create a transaction record
        await createTransactionRecord({
          userId,
          type: "purchase",
          amount: payment.amount,
          currency: payment.currency,
          paymentId: orderId,
          paymentProvider: provider,
          description: `Purchase of ${plan.name}`,
          metadata: {
            paymentType: payment.type,
            provider,
            planType,
            planTier,
            planDetails: plan
          }
        });

        // Add the purchased plan to the user's account
        // This would involve updating the user's proxy allocation, which would be specific to your application
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
          [`proxyPlans.${planType}`]: {
            tier: planTier,
            purchasedAt: FieldValue.serverTimestamp(),
            expiresAt: payment.metadata.isRecurring 
              ? null // For subscriptions, we don't set an expiration
              : new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days for one-time purchases
            isActive: true,
            bandwidth: plan.bandwidth,
            planName: plan.name
          },
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      return {
        success: true
      };
    } catch (error) {
      console.error("Error processing successful payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error processing payment"
      };
    }
  }

  /**
   * Handles payment cancellation
   */
  async handlePaymentCancellation(
    params: PaymentCancellationParams
  ): Promise<PaymentProcessingResponse> {
    const { orderId } = params;

    // Get user ID from the payment document
    const payment = await getPaymentByOrderId("current-user-id", orderId); // Replace with actual user ID retrieval
    
    if (!payment) {
      return {
        success: false,
        error: "Payment not found"
      };
    }

    const userId = payment.userId;
    const stripeSessionId = payment.metadata?.stripeSessionId;

    if (!stripeSessionId) {
      return {
        success: false,
        error: "No Stripe session ID found for this payment"
      };
    }

    try {
      // Cancel the payment with Stripe
      const cancelResult = await stripeProvider.cancelPayment(stripeSessionId);
      
      if (!cancelResult.success) {
        return {
          success: false,
          error: cancelResult.error || "Failed to cancel payment with Stripe"
        };
      }

      // Update the payment status in our database
      await updatePayment(userId, orderId, {
        status: "canceled",
        error: "Payment cancelled by user"
      });

      return {
        success: true
      };
    } catch (error) {
      console.error("Error cancelling payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error cancelling payment"
      };
    }
  }

  /**
   * Processes a subscription renewal webhook event
   */
  async processSubscriptionRenewal(
    subscriptionId: string,
    provider: PaymentProvider,
    eventData: any
  ): Promise<PaymentProcessingResponse> {
    if (provider !== "stripe") {
      return {
        success: false,
        error: "This service only handles Stripe subscriptions"
      };
    }

    try {
      // Extract necessary information from the event data
      const subscription = eventData.object;
      const userId = subscription.metadata?.userId;
      
      if (!userId) {
        return {
          success: false,
          error: "User ID not found in subscription metadata"
        };
      }

      // Generate a new order ID for this renewal
      const orderId = generateOrderId();

      // Create a new payment record for this renewal
      await createPayment({
        orderId,
        userId,
        provider: "stripe",
        amount: subscription.plan.amount / 100, // Convert cents to dollars
        type: "proxy_purchase",
        metadata: {
          subscriptionId,
          planType: subscription.metadata?.planType,
          tier: subscription.metadata?.tier,
          isRenewal: true,
          invoiceId: eventData.data?.invoice
        }
      });

      // Mark the payment as completed immediately since it's a subscription renewal
      await markPaymentCompleted(userId, orderId);

      // Create a transaction record
      await createTransactionRecord({
        userId,
        type: "purchase",
        amount: subscription.plan.amount / 100,
        currency: subscription.plan.currency.toUpperCase(),
        paymentId: orderId,
        paymentProvider: provider,
        description: `Subscription renewal for ${subscription.metadata?.planType} ${subscription.metadata?.tier} plan`,
        metadata: {
          subscriptionId,
          planType: subscription.metadata?.planType,
          tier: subscription.metadata?.tier
        }
      });

      // Update the user's subscription information
      // This would involve updating the expiration date or other subscription details
      if (subscription.metadata?.planType) {
        const planType = subscription.metadata.planType as keyof typeof PROXY_PLANS;
        const tier = subscription.metadata.tier || "basic";
        
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
          [`proxyPlans.${planType}.lastRenewalAt`]: FieldValue.serverTimestamp(),
          [`proxyPlans.${planType}.nextRenewalAt`]: new Date(subscription.current_period_end * 1000),
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      return {
        success: true
      };
    } catch (error) {
      console.error("Error processing subscription renewal:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error processing subscription renewal"
      };
    }
  }

  /**
   * Processes a subscription cancellation webhook event
   */
  async processSubscriptionCancellation(
    subscriptionId: string,
    provider: PaymentProvider,
    eventData: any
  ): Promise<PaymentProcessingResponse> {
    if (provider !== "stripe") {
      return {
        success: false,
        error: "This service only handles Stripe subscriptions"
      };
    }

    try {
      // Extract necessary information from the event data
      const subscription = eventData.object;
      const userId = subscription.metadata?.userId;
      
      if (!userId) {
        return {
          success: false,
          error: "User ID not found in subscription metadata"
        };
      }

      // Update the user's subscription information
      if (subscription.metadata?.planType) {
        const planType = subscription.metadata.planType as keyof typeof PROXY_PLANS;
        
        const userRef = db.collection('users').doc(userId);
        
        // If the subscription is canceled immediately, mark it as inactive
        // If it's set to cancel at period end, we'll leave it active until then
        if (subscription.status === "canceled") {
          await userRef.update({
            [`proxyPlans.${planType}.isActive`]: false,
            [`proxyPlans.${planType}.canceledAt`]: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });
        } else if (subscription.cancel_at_period_end) {
          await userRef.update({
            [`proxyPlans.${planType}.cancelAtPeriodEnd`]: true,
            [`proxyPlans.${planType}.scheduledCancellationDate`]: new Date(subscription.current_period_end * 1000),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }

      return {
        success: true
      };
    } catch (error) {
      console.error("Error processing subscription cancellation:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error processing subscription cancellation"
      };
    }
  }
}

// Export a singleton instance of the service
export const stripePaymentService = new StripePaymentService();