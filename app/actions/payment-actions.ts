"use server"

import { cryptomusProvider } from "@/lib/payment/providers/CryptomusPaymentProvider"
import { PROXY_PLANS } from "@/lib/payment/providers/StripePaymentProvider"
import { AuthUser } from "@/lib/auth-utils"
import { withAuthGuard } from "@/lib/guards/auth-guard"
import {
    createPayment,
    generateOrderId,
    updatePaymentWithCryptoDetails} from "@/lib/db/payments"
import { PaymentType as ProviderPaymentType } from "@/lib/payment/providers/PaymentProvider"

// Payment provider options
type PaymentProvider = "stripe" | "cryptomus"

// Common interface for payment responses
export interface PaymentResponse {
    success: boolean
    redirectUrl?: string
    error?: string
    orderId?: string
}

/**
 * Handles proxy plan purchase using the specified payment provider
 */
export const handleProxyPlanPurchase = withAuthGuard(async (authUser: AuthUser, {
    proxyType,
    tier,
    paymentProvider = "stripe",
    cryptoNetwork,
    isRecurring = false,
    billingCycle = "monthly",
    trialPeriodDays
}: {
    proxyType: keyof typeof PROXY_PLANS
    tier: "basic" | "pro" | "enterprise"
    paymentProvider: PaymentProvider
    cryptoNetwork?: string // Only required for Cryptomus
    isRecurring?: boolean
    billingCycle?: "monthly" | "yearly"
    trialPeriodDays?: number
}): Promise<PaymentResponse> => {
    if (!authUser.email) {
        return {
            success: false,
            error: "Failed to retrieve user information"
        }
    }

    let userEmail = authUser.email;
    let userId = authUser.uid;

    // Get plan details
    const plan = PROXY_PLANS[proxyType][tier]
    if (!plan) {
        return {
            success: false,
            error: "Invalid plan selection"
        }
    }

    // Generate order ID for tracking
    const orderId = generateOrderId()

    // Base URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/payments/callback`
    const successUrl = `${baseUrl}/dashboard/billing`
    const returnUrl = `${baseUrl}/api/payments/cancel?orderId=${orderId}`

    try {
        // Process payment based on provider and whether it's recurring or one-time
        if (paymentProvider === "stripe") {
            return {
                success: false,
                error: "Stripe integration not yet implemented"
            }
        } else if (paymentProvider === "cryptomus") {
            // Handle one-time payment with Cryptomus
            const metadata = {
                type: ProviderPaymentType.ONE_TIME,
                orderId,
                userId: authUser.uid,
                amount: plan.price / 100,
                currency: "USD",
                description: plan.name,
                customerEmail: authUser.email,
                network: cryptoNetwork
            };

            // Create the one-time payment
            const paymentResponse = await cryptomusProvider.createOneTimePayment(
                authUser,
                metadata as any, // Type assertion needed due to interface differences
                successUrl,
                returnUrl,
                callbackUrl
            );

            if (!paymentResponse.success || !paymentResponse.redirectUrl) {
                return {
                    success: false,
                    error: paymentResponse.error || "Failed to create Cryptomus payment"
                };
            }

            // Only create the payment document after successful API response
            await createPayment({
                orderId,
                userId: authUser.uid,
                provider: paymentProvider,
                amount: plan.price / 100, // Convert cents to dollars
                type: "proxy_purchase",
                metadata: {
                    proxyType,
                    tier,
                    planName: plan.name,
                    bandwidth: plan.bandwidth,
                    isRecurring: isRecurring || plan.isRecurring,
                    billingCycle: isRecurring ? billingCycle : undefined,
                    cryptomusPaymentId: paymentResponse.paymentId,
                    cryptomusReference: paymentResponse.providerReference,
                    cryptoNetwork
                }
            });

            // Update payment with Cryptomus specific details
            await updatePaymentWithCryptoDetails(
                authUser.uid,
                orderId,
                paymentResponse.paymentId || "",
                paymentResponse.redirectUrl
            );

            return {
                success: true,
                redirectUrl: paymentResponse.redirectUrl,
                orderId
            };
        } else {
            return {
                success: false,
                error: "Unsupported payment provider"
            };
        }
    } catch (error) {
        console.error("Payment processing error:", error);

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown payment processing error"
        };
    }
});

/**
 * Handles wallet deposit using the specified payment provider
 */
export const handleWalletDeposit = withAuthGuard(async (authUser: AuthUser, {
    amount,
    paymentProvider = "stripe",
    cryptoNetwork,
}: {
    amount: number // Amount in dollars
    paymentProvider: PaymentProvider
    cryptoNetwork?: string // Only required for Cryptomus
}): Promise<PaymentResponse> => {
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/payments/callback`
    const successUrl = `${baseUrl}/dashboard/billing/success`
    const returnUrl = `${baseUrl}/dashboard/billing/cancel?orderId=${orderId}`

    try {
        // Process payment based on selected provider
        if (paymentProvider === "stripe") {
            return {
                success: false,
                error: "Stripe integration not yet implemented"
            };
        } else if (paymentProvider === "cryptomus") {
            // Handle Cryptomus payment
            if (!cryptoNetwork) {
                return {
                    success: false,
                    error: "Crypto network must be specified for Cryptomus payments"
                };
            }

            // Create metadata for the one-time payment
            const metadata = {
                type: ProviderPaymentType.ONE_TIME,
                orderId,
                userId: authUser.uid,
                amount,
                currency: "USD",
                description: `Wallet Deposit - $${amount}`,
                customerEmail: authUser.email || "user@example.com",
                network: cryptoNetwork
            };

            // Create the one-time payment
            const paymentResponse = await cryptomusProvider.createOneTimePayment(
                authUser,
                metadata as any, // Type assertion needed due to interface differences
                successUrl,
                returnUrl,
                callbackUrl
            );

            if (!paymentResponse.success || !paymentResponse.redirectUrl) {
                return {
                    success: false,
                    error: paymentResponse.error || "Failed to create Cryptomus payment"
                };
            }

            // Only create the payment document after successful API response
            await createPayment({
                orderId,
                userId: authUser.uid,
                provider: paymentProvider,
                amount,
                type: "wallet_deposit",
                metadata: {
                    description: `Wallet Deposit - $${amount}`,
                    cryptomusPaymentId: paymentResponse.paymentId,
                    cryptomusReference: paymentResponse.providerReference,
                    cryptoNetwork
                }
            });

            // Update payment with Cryptomus specific details
            await updatePaymentWithCryptoDetails(
                authUser.uid,
                orderId,
                paymentResponse.paymentId || "",
                paymentResponse.redirectUrl
            );

            return {
                success: true,
                redirectUrl: paymentResponse.redirectUrl,
                orderId
            };
        } else {
            return {
                success: false,
                error: "Unsupported payment provider"
            };
        }
    } catch (error) {
        console.error("Wallet deposit error:", error);

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown wallet deposit error"
        };
    }
});