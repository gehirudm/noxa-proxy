"use server"

import { cryptomusProvider } from "@/lib/payment/providers/CryptomusPaymentProvider"
import { PROXY_PLANS } from "@/lib/payment/providers/StripePaymentProvider"
import { AuthUser } from "@/lib/auth-utils"
import { withAuthGuard } from "@/lib/guards/auth-guard"
import {
    createPayment,
    createTransactionRecord,
    generateOrderId,
    markPaymentCompleted,
    updatePaymentWithCryptoDetails} from "@/lib/db/payments"
import { PaymentType as ProviderPaymentType } from "@/lib/payment/providers/PaymentProvider"
import crypto from 'crypto'
import { db } from "@/lib/firebase/firebase-admin"
import { evomiAPI } from "@/lib/evomi-api"

// Payment provider options
type PaymentProvider = "stripe" | "cryptomus"

// Common interface for payment responses
export interface PaymentResponse {
    success: boolean
    redirectUrl?: string
    error?: string
    orderId?: string
    message?: string
}

/**
 * Handles proxy plan purchase using the specified payment provider
 */
export const handleProxyPlanPurchase = withAuthGuard(async (authUser: AuthUser, {
    proxyType,
    tier,
    paymentProvider = "stripe",
    cryptoNetwork,
    cryptoCurrency,
    isRecurring = false,
    billingCycle = "monthly",
    trialPeriodDays,
    customQuantity
}: {
    proxyType: keyof typeof PROXY_PLANS
    tier: "basic" | "pro" | "enterprise" | "custom"
    paymentProvider: PaymentProvider
    cryptoNetwork?: string // Only required for Cryptomus
    cryptoCurrency?: string // Only required for Cryptomus
    isRecurring?: boolean
    billingCycle?: "monthly" | "yearly"
    trialPeriodDays?: number
    customQuantity?: number // GB of bandwidth for custom plans
}): Promise<PaymentResponse> => {
    if (!authUser.email) {
        return {
            success: false,
            error: "Failed to retrieve user information"
        }
    }

    let userEmail = authUser.email;
    let userId = authUser.uid;

    // Handle custom plan pricing
    let plan;
    let planPrice;
    let planName;
    let planBandwidth;
    
    if (tier === "custom") {
        // Validate custom quantity
        if (!customQuantity || customQuantity <= 0) {
            return {
                success: false,
                error: "Invalid bandwidth quantity"
            }
        }
        
        // Calculate price for custom bandwidth (example: $0.50 per GB)
        const pricePerGB = 2.75; // $0.50 per GB - adjust as needed
        planPrice = Math.round(customQuantity * pricePerGB * 100); // Convert to cents
        planName = `Custom ${proxyType.replace(/_/g, ' ')} Plan`;
        planBandwidth = `${customQuantity} GB`;
    } else {
        // Get predefined plan details
        plan = PROXY_PLANS[proxyType][tier];
        if (!plan) {
            return {
                success: false,
                error: "Invalid plan selection"
            }
        }
        planPrice = plan.price;
        planName = plan.name;
        planBandwidth = plan.bandwidth;
    }

    // Generate order ID for tracking
    const orderId = generateOrderId()

    // Base URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/payments/callback/proxy`
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
                amount: planPrice / 100, // Convert cents to dollars
                currency: "USD",
                description: planName,
                customerEmail: authUser.email,
                network: cryptoNetwork,
                currency_to: cryptoCurrency
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
                amount: planPrice / 100, // Convert cents to dollars
                type: "proxy_purchase",
                metadata: {
                    proxyType,
                    tier,
                    planName,
                    bandwidth: planBandwidth,
                    isRecurring: isRecurring || (plan?.isRecurring || false),
                    billingCycle: isRecurring ? billingCycle : undefined,
                    cryptomusPaymentId: paymentResponse.paymentId,
                    cryptomusReference: paymentResponse.providerReference,
                    cryptoNetwork,
                    cryptoCurrency,
                    customQuantity: tier === "custom" ? customQuantity : undefined
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
 * Handles proxy plan purchase using the user's wallet balance
 */
export const handleWalletProxyPurchase = withAuthGuard(async (authUser: AuthUser, {
    proxyType,
    tier,
    customQuantity
}: {
    proxyType: keyof typeof PROXY_PLANS
    tier: "basic" | "pro" | "enterprise" | "custom"
    customQuantity?: number // GB of bandwidth for custom plans
}): Promise<PaymentResponse> => {
    if (!authUser.email) {
        return {
            success: false,
            error: "Failed to retrieve user information"
        }
    }

    // Handle custom plan pricing
    let plan;
    let planPrice;
    let planName;
    let planBandwidth;
    
    if (tier === "custom") {
        // Validate custom quantity
        if (!customQuantity || customQuantity <= 0) {
            return {
                success: false,
                error: "Invalid bandwidth quantity"
            }
        }
        
        // Calculate price for custom bandwidth (example: $0.50 per GB)
        const pricePerGB = 2.75; // $0.50 per GB - adjust as needed
        planPrice = Math.round(customQuantity * pricePerGB * 100); // Convert to cents
        planName = `Custom ${proxyType.replace(/_/g, ' ')} Plan`;
        planBandwidth = `${customQuantity} GB`;
    } else {
        // Get predefined plan details
        plan = PROXY_PLANS[proxyType][tier];
        if (!plan) {
            return {
                success: false,
                error: "Invalid plan selection"
            }
        }
        planPrice = plan.price;
        planName = plan.name;
        planBandwidth = plan.bandwidth;
    }

    // Generate order ID for tracking
    const orderId = generateOrderId();

    try {
        // Get user's wallet balance
        const userDoc = await db.collection('users').doc(authUser.uid).get();
        const userData = userDoc.data();
        
        if (!userData) {
            return {
                success: false,
                error: "User data not found"
            };
        }
        
        const walletBalance = userData.wallet?.balance || 0;
        const amountInDollars = planPrice / 100; // Convert cents to dollars
        
        // Check if user has sufficient balance
        if (walletBalance < amountInDollars) {
            return {
                success: false,
                error: `Insufficient wallet balance. Required: $${amountInDollars.toFixed(2)}, Available: $${walletBalance.toFixed(2)}`
            };
        }
        
        // Create payment record
        await createPayment({
            orderId,
            userId: authUser.uid,
            provider: "wallet",
            amount: amountInDollars,
            type: "proxy_purchase",
            status: "pending", // Will be updated to completed after processing
            metadata: {
                proxyType,
                tier,
                planName,
                bandwidth: planBandwidth,
                isRecurring: false, // Wallet payments are always one-time
                customQuantity: tier === "custom" ? customQuantity : undefined
            }
        });
        
        // Deduct amount from wallet balance
        const newBalance = walletBalance - amountInDollars;
        await db.collection('users').doc(authUser.uid).update({
            'wallet.balance': newBalance,
            'wallet.updatedAt': new Date()
        });
        
        // Create transaction record
        await createTransactionRecord({
            userId: authUser.uid,
            type: 'purchase',
            amount: amountInDollars,
            currency: 'USD',
            paymentId: orderId,
            paymentProvider: 'wallet',
            description: `Wallet payment for ${planName}`
        });
        
        // Mark payment as completed
        await markPaymentCompleted(authUser.uid, orderId);
        
        // Provision the proxy
        // Get the user document to retrieve the Evomi username
        if (!userData.evomi?.username) {
            console.error(`No Evomi username found for user ${authUser.uid}`);
            throw new Error('User does not have an Evomi account configured');
        }
        
        const evomiUsername = userData.evomi.username;
        
        // Map our proxy types to Evomi product types
        const proxyTypeToEvomiProduct: Record<string, 'residential' | 'sharedDataCenter' | 'mobile'> = {
            'premium_residential': 'residential',
            'static_residential': 'residential',
            'datacenter_ipv4': 'sharedDataCenter',
            'datacenter_ipv6': 'sharedDataCenter',
            'mobile_proxy': 'mobile'
        };
        
        const evomiProduct = proxyTypeToEvomiProduct[proxyType];
        
        if (!evomiProduct) {
            console.error(`Invalid proxy type: ${proxyType}`);
            throw new Error(`Invalid proxy type: ${proxyType}`);
        }
        
        // Parse bandwidth from string (e.g., "5 GB") to MB amount
        let mbAmount = 0;
        const bandwidthMatch = planBandwidth.match(/(\d+)\s*GB/i);
        if (bandwidthMatch && bandwidthMatch[1]) {
            // Convert GB to MB (1 GB = 1024 MB)
            mbAmount = parseInt(bandwidthMatch[1], 10) * 1024;
        } else {
            console.error(`Invalid bandwidth format: ${planBandwidth}`);
            throw new Error(`Invalid bandwidth format: ${planBandwidth}`);
        }
        
        try {
            // Add the bandwidth to the user's Evomi account
            const updatedSubUser = await evomiAPI.giveBalance(
                evomiUsername,
                evomiProduct,
                mbAmount
            );
            
            console.log(`Successfully added ${mbAmount}MB to ${evomiUsername}'s ${evomiProduct} balance`);
            
            // Update the user's proxy plan information in Firestore
            await db.collection('users').doc(authUser.uid).update({
                [`proxyPlans.${proxyType}`]: {
                    tier,
                    purchasedAt: new Date(),
                    expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days for one-time purchases
                    isActive: true,
                    bandwidth: planBandwidth,
                    planName,
                    evomiBalance: updatedSubUser.products[evomiProduct]?.balance || mbAmount
                },
                updatedAt: new Date()
            });
            
            return {
                success: true,
                message: "Payment successful and proxy provisioned",
                orderId
            };
        } catch (error) {
            console.error(`Failed to add balance to Evomi account: ${error}`);
            
            // Still update the user's plan in Firestore, but mark that provisioning failed
            await db.collection('users').doc(authUser.uid).update({
                [`proxyPlans.${proxyType}`]: {
                    tier,
                    purchasedAt: new Date(),
                    expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                    isActive: true,
                    bandwidth: planBandwidth,
                    planName,
                    provisioningError: error instanceof Error ? error.message : 'Unknown error'
                },
                updatedAt: new Date()
            });
            
            return {
                success: false,
                error: `Payment successful but failed to provision proxy: ${error instanceof Error ? error.message : 'Unknown error'}`,
                orderId
            };
        }
    } catch (error) {
        console.error("Wallet payment processing error:", error);
        
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

    const callbackUrl = `${baseUrl}/api/payments/callback/wallet`
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

/**
 * Interface for test webhook response
 */
interface TestWebhookResponse {
  success: boolean
  message?: string
  error?: string
  orderId?: string
}

/**
 * Generate Cryptomus signature for API requests
 */
function generateCryptomusSignature(payload: any, apiKey: string): string {
  const sortedParams = JSON.stringify(payload);
  return crypto
    .createHash('md5')
    .update(Buffer.from(sortedParams).toString('base64') + apiKey)
    .digest('hex');
}

/**
 * Trigger a test webhook for an existing payment
 */
async function triggerCryptomusTestWebhook(
  orderId: string,
  status: 'paid' | 'fail' | 'cancel' = 'paid',
  currency = 'USDT',
  network = 'TRX',
  callbackUrl = "/api/payments/callback/proxy"
): Promise<boolean> {
  try {
    const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
    const apiKey = process.env.CRYPTOMUS_PAYMENT_KEY;
    
    if (!merchantId || !apiKey) {
      throw new Error('Cryptomus credentials not configured');
    }

    callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}${callbackUrl}`;
    // callbackUrl = `https://3f686b229f55.ngrok-free.app${callbackUrl}`;
    
    const payload = {
      order_id: orderId,
      currency,
      network,
      url_callback: callbackUrl,
      status
    };

    console.log(payload)

    const signature = generateCryptomusSignature(payload, apiKey);

    const response = await fetch('https://api.cryptomus.com/v1/test-webhook/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantId,
        'sign': signature
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.state !== 0) {
      console.error('Cryptomus test webhook failed:', data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error triggering Cryptomus test webhook:', error);
    return false;
  }
}

/**
 * Simulates a successful proxy plan purchase payment by triggering a test webhook
 */
export const testProxyPlanPurchase = withAuthGuard(async (authUser: AuthUser, {
  proxyType,
  tier,
  cryptoNetwork = "TRX",
  cryptoCurrency = "USDT"
}: {
  proxyType: keyof typeof PROXY_PLANS
  tier: "basic" | "pro" | "enterprise"
  cryptoNetwork?: string
  cryptoCurrency?: string
}): Promise<TestWebhookResponse> => {
  try {
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

    // Create a payment record first
    await createPayment({
      orderId,
      userId: authUser.uid,
      provider: "cryptomus",
      amount: plan.price / 100, // Convert cents to dollars
      currency: "USD",
      type: "proxy_purchase",
      metadata: {
        proxyType,
        tier,
        planName: plan.name,
        bandwidth: plan.bandwidth,
        isRecurring: false,
        cryptomusPaymentId: `test_${orderId}`,
        cryptomusReference: `test_ref_${orderId}`,
        cryptoNetwork,
        cryptoCurrency
      }
    })

    // Trigger the test webhook
    const webhookSuccess = await triggerCryptomusTestWebhook(
      orderId,
      'paid',
      cryptoCurrency,
      cryptoNetwork
    )

    if (!webhookSuccess) {
      return {
        success: false,
        error: "Failed to trigger Cryptomus test webhook"
      }
    }

    return {
      success: true,
      message: "Test proxy plan purchase webhook sent successfully",
      orderId
    }
  } catch (error) {
    console.error("Test proxy plan purchase error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown test webhook error"
    }
  }
})


/**
 * Simulates a successful wallet deposit payment by triggering a test webhook
 */
export const testWalletDeposit = withAuthGuard(async (authUser: AuthUser, {
  amount,
  cryptoNetwork = "TRX",
  cryptoCurrency = "USDT"
}: {
  amount: number // Amount in dollars
  cryptoNetwork?: string
  cryptoCurrency?: string
}): Promise<TestWebhookResponse> => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Invalid deposit amount"
      };
    }

    // Generate order ID for tracking
    const orderId = generateOrderId();

    // Create a payment record first
    await createPayment({
      orderId,
      userId: authUser.uid,
      provider: "cryptomus",
      amount,
      currency: "USD",
      type: "wallet_deposit",
      metadata: {
        description: `Wallet Deposit - $${amount}`,
        cryptomusPaymentId: `test_${orderId}`,
        cryptomusReference: `test_ref_${orderId}`,
        cryptoNetwork,
        cryptoCurrency
      }
    });

    // Trigger the test webhook
    const webhookSuccess = await triggerCryptomusTestWebhook(
      orderId,
      'paid',
      cryptoCurrency,
      cryptoNetwork,
      "/api/payments/callback/wallet"
    );

    if (!webhookSuccess) {
      return {
        success: false,
        error: "Failed to trigger Cryptomus test webhook"
      };
    }

    return {
      success: true,
      message: "Test wallet deposit webhook sent successfully",
      orderId
    };
  } catch (error) {
    console.error("Test wallet deposit error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown test webhook error"
    };
  }
});