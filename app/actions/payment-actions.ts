"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { stripe, PROXY_PLANS } from "@/lib/stripe"
import { cryptomus } from "@/lib/cryptomus"
import { revalidatePath } from "next/cache"
import { auth, db } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

// Payment provider options
export type PaymentProvider = "stripe" | "cryptomus"

// Common interface for payment responses
interface PaymentResponse {
    success: boolean
    redirectUrl?: string
    error?: string
    orderId?: string
}

/**
 * Creates a unique order ID for tracking payments
 */
function generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
}

/**
 * Validates the session and returns the user ID
 */
async function validateSession(): Promise<string | null> {
    const sessionCookie = (await cookies()).get("firebaseSessionCookie")?.value

    if (!sessionCookie) {
        return null
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie)
        return decodedClaims.uid
    } catch (error) {
        console.error("Invalid session:", error)
        return null
    }
}

/**
 * Handles proxy plan purchase using the specified payment provider
 */
export async function handleProxyPlanPurchase({
    proxyType,
    tier,
    paymentProvider = "stripe",
    cryptoNetwork,
}: {
    proxyType: keyof typeof PROXY_PLANS
    tier: "basic" | "pro" | "enterprise"
    paymentProvider: PaymentProvider
    cryptoNetwork?: string // Only required for Cryptomus
}): Promise<PaymentResponse> {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
        return {
            success: false,
            error: "Authentication required"
        }
    }

    // Get user email for payment
    let userEmail: string
    try {
        const userRecord = await auth.getUser(userId)
        userEmail = userRecord.email || "user@example.com"
    } catch (error) {
        console.error("Error fetching user:", error)
        return {
            success: false,
            error: "Failed to retrieve user information"
        }
    }

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
    const sessionParam = `sessionId=${encodeURIComponent((await cookies()).get("firebaseSessionCookie")?.value || "")}`
    const providerParam = `provider=${paymentProvider}`
    const orderIdParam = `orderId=${orderId}`
    const planTypeParam = `planType=${proxyType}`
    const planTierParam = `planTier=${tier}`

    const successUrl = `${baseUrl}/dashboard/billing/success?${sessionParam}&${providerParam}&${orderIdParam}&${planTypeParam}&${planTierParam}`
    const cancelUrl = `${baseUrl}/dashboard/billing/cancel?${sessionParam}&${providerParam}&${orderIdParam}&${planTypeParam}&${planTierParam}`

    try {
        // Create payment document in Firestore using Firebase Admin SDK
        const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId)

        // Common payment data
        const paymentData = {
            orderId,
            userId,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            status: 'pending',
            provider: paymentProvider,
            amount: plan.price / 100, // Convert cents to dollars
            currency: 'USD',
            type: 'proxy_purchase',
            metadata: {
                proxyType,
                tier,
                planName: plan.name,
                bandwidth: plan.bandwidth,
                isRecurring: plan.isRecurring
            }
        }

        // Save payment document
        await paymentRef.set(paymentData)

        // Process payment based on selected provider
        if (paymentProvider === "stripe") {
            // Handle Stripe payment
            const checkoutUrl = plan.isRecurring
                ? await stripe.checkout.sessions.create({
                    mode: "subscription",
                    payment_method_types: ["card"],
                    customer_email: userEmail,
                    line_items: [
                        {
                            price: plan.priceId,
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    metadata: {
                        userId,
                        orderId,
                        proxyType,
                        tier,
                        provider: "stripe"
                    },
                }).then(session => session.url)
                : await stripe.checkout.sessions.create({
                    mode: "payment",
                    payment_method_types: ["card"],
                    customer_email: userEmail,
                    line_items: [
                        {
                            price: plan.priceId,
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    metadata: {
                        userId,
                        orderId,
                        proxyType,
                        tier,
                        provider: "stripe"
                    },
                }).then(session => session.url)

            if (!checkoutUrl) {
                // Update payment status to failed
                await paymentRef.update({
                    status: 'failed',
                    updatedAt: FieldValue.serverTimestamp(),
                    error: 'Failed to create Stripe checkout session'
                })

                throw new Error("Failed to create Stripe checkout session")
            }

            // Update payment with checkout URL
            await paymentRef.update({
                checkoutUrl,
                updatedAt: FieldValue.serverTimestamp()
            })

            return {
                success: true,
                redirectUrl: checkoutUrl,
                orderId
            }
        } else if (paymentProvider === "cryptomus") {
            // Handle Cryptomus payment
            if (!cryptoNetwork) {
                // Update payment status to failed
                await paymentRef.update(paymentRef, {
                    status: 'failed',
                    updatedAt: FieldValue.serverTimestamp(),
                    error: 'Crypto network must be specified for Cryptomus payments'
                })

                return {
                    success: false,
                    error: "Crypto network must be specified for Cryptomus payments"
                }
            }

            const amount = (plan.price / 100).toFixed(2) // Convert cents to dollars

            // Update payment with crypto network
            await paymentRef.update(paymentRef, {
                'metadata.cryptoNetwork': cryptoNetwork,
                updatedAt: FieldValue.serverTimestamp()
            })

            const paymentResponse = await cryptomus.createInvoice({
                orderId,
                amount,
                currency: "USD",
                network: cryptoNetwork,
                callbackUrl: `${baseUrl}/api/webhooks/cryptomus`,
                returnUrl: successUrl,
            })

            if (!paymentResponse || !paymentResponse.url) {
                // Update payment status to failed
                await paymentRef.update(paymentRef, {
                    status: 'failed',
                    updatedAt: FieldValue.serverTimestamp(),
                    error: 'Failed to create Cryptomus payment'
                })

                throw new Error("Failed to create Cryptomus payment")
            }

            // Update payment with checkout URL and crypto details
            await paymentRef.update(paymentRef, {
                checkoutUrl: paymentResponse.url,
                cryptomusUuid: paymentResponse.uuid || null,
                updatedAt: FieldValue.serverTimestamp()
            })

            return {
                success: true,
                redirectUrl: paymentResponse.url,
                orderId
            }
        } else {
            // Update payment status to failed
            await paymentRef.update(paymentRef, {
                status: 'failed',
                updatedAt: FieldValue.serverTimestamp(),
                error: 'Invalid payment provider'
            })

            return {
                success: false,
                error: "Invalid payment provider"
            }
        }
    } catch (error) {
        console.error("Payment processing error:", error)

        // Try to update the payment document with error information
        try {
            const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId)
            await paymentRef.update({
                status: 'failed',
                updatedAt: FieldValue.serverTimestamp(),
                error: error instanceof Error ? error.message : "Unknown payment processing error"
            })
        } catch (dbError) {
            console.error("Failed to update payment document with error:", dbError)
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown payment processing error"
        }
    }
}

/**
 * Handles wallet deposit using the specified payment provider
 */
export async function handleWalletDeposit({
    amount,
    paymentProvider = "stripe",
    cryptoNetwork,
}: {
    amount: number // Amount in dollars
    paymentProvider: PaymentProvider
    cryptoNetwork?: string // Only required for Cryptomus
}): Promise<PaymentResponse> {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
        return {
            success: false,
            error: "Authentication required"
        }
    }

    // Get user email for payment
    let userEmail: string
    try {
        const userRecord = await auth.getUser(userId)
        userEmail = userRecord.email || "user@example.com"
    } catch (error) {
        console.error("Error fetching user:", error)
        return {
            success: false,
            error: "Failed to retrieve user information"
        }
    }

    // Generate order ID for tracking
    const orderId = generateOrderId()

    // Base URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const sessionParam = `sessionId=${encodeURIComponent((await cookies()).get("firebaseSessionCookie")?.value || "")}`
    const providerParam = `provider=${paymentProvider}`
    const orderIdParam = `orderId=${orderId}`
    const amountParam = `amount=${amount}`
    const typeParam = `type=wallet_deposit`

    const successUrl = `${baseUrl}/dashboard/billing/success?${sessionParam}&${providerParam}&${orderIdParam}&${amountParam}&${typeParam}`
    const cancelUrl = `${baseUrl}/dashboard/billing/cancel?${sessionParam}&${providerParam}&${orderIdParam}&${amountParam}&${typeParam}`

    try {
        // Process payment based on selected provider
        if (paymentProvider === "stripe") {
            // Handle Stripe payment
            const amountInCents = Math.round(amount * 100)

            const priceId = await stripe.prices.create({
                unit_amount: amountInCents,
                currency: 'usd',
                product_data: {
                    name: `Wallet Deposit - $${amount}`,
                },
            }).then(price => price.id)

            const checkoutUrl = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                customer_email: userEmail,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    userId,
                    orderId,
                    amount: amount.toString(),
                    type: "wallet_deposit",
                    provider: "stripe"
                },
            }).then(session => session.url)

            if (!checkoutUrl) {
                throw new Error("Failed to create Stripe checkout session")
            }

            return {
                success: true,
                redirectUrl: checkoutUrl,
                orderId
            }
        } else if (paymentProvider === "cryptomus") {
            // Handle Cryptomus payment
            if (!cryptoNetwork) {
                return {
                    success: false,
                    error: "Crypto network must be specified for Cryptomus payments"
                }
            }

            const paymentResponse = await cryptomus.createInvoice({
                orderId,
                amount: amount.toString(),
                currency: "USD",
                network: cryptoNetwork,
                callbackUrl: `${baseUrl}/api/webhooks/cryptomus`,
                returnUrl: successUrl,
            })

            if (!paymentResponse || !paymentResponse.url) {
                throw new Error("Failed to create Cryptomus payment")
            }

            return {
                success: true,
                redirectUrl: paymentResponse.url,
                orderId
            }
        } else {
            return {
                success: false,
                error: "Invalid payment provider"
            }
        }
    } catch (error) {
        console.error("Payment processing error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown payment processing error"
        }
    }
}

/**
 * Verifies a payment status (can be used to check if a payment was completed)
 */
export async function verifyPaymentStatus(
    orderId: string,
    provider: PaymentProvider
): Promise<{ success: boolean; status: string; error?: string }> {
    try {
        if (provider === "stripe") {
            // For Stripe, we need to find the session by metadata
            const sessions = await stripe.checkout.sessions.list({
                limit: 1,
                expand: ['data.payment_intent'],
            })

            const session = sessions.data.find(s => s.metadata?.orderId === orderId)

            if (!session) {
                return {
                    success: false,
                    status: "not_found",
                    error: "Payment session not found"
                }
            }

            return {
                success: true,
                status: session.status || "unknown"
            }
        } else if (provider === "cryptomus") {
            // For Cryptomus, we can check directly with the order ID
            const paymentStatus = await cryptomus.getPaymentStatus(orderId)

            return {
                success: true,
                status: paymentStatus.status || "unknown"
            }
        } else {
            return {
                success: false,
                status: "invalid_provider",
                error: "Invalid payment provider"
            }
        }
    } catch (error) {
        console.error("Error verifying payment status:", error)
        return {
            success: false,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error verifying payment"
        }
    }
}

/**
 * Processes a successful payment (to be called after payment confirmation)
 */
export async function processSuccessfulPayment({
    orderId,
    provider,
    planType,
    planTier,
    amount,
    type,
}: {
    orderId: string
    provider: PaymentProvider
    planType?: keyof typeof PROXY_PLANS
    planTier?: "basic" | "pro" | "enterprise"
    amount?: number
    type?: "proxy_purchase" | "wallet_deposit"
}): Promise<{ success: boolean; error?: string }> {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
        return {
            success: false,
            error: "Authentication required"
        }
    }

    try {
        // Verify the payment status first
        const paymentVerification = await verifyPaymentStatus(orderId, provider)

        if (!paymentVerification.success ||
            (provider === "stripe" && paymentVerification.status !== "complete") ||
            (provider === "cryptomus" && paymentVerification.status !== "paid")) {
            return {
                success: false,
                error: `Payment verification failed: ${paymentVerification.error || paymentVerification.status}`
            }
        }

        // Get the payment document reference
        const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId)
        const paymentDoc = await paymentRef.get()
        
        // Check if payment document exists
        if (!paymentDoc.exists) {
            return {
                success: false,
                error: "Payment record not found"
            }
        }
        
        // Update payment status to completed
        await paymentRef.update({
            status: 'completed',
            updatedAt: FieldValue.serverTimestamp(),
            completedAt: FieldValue.serverTimestamp()
        })

        // Process based on payment type
        if (type === "wallet_deposit" && amount) {
            // Update user's wallet balance in Firestore
            const userRef = db.collection('users').doc(userId)
            
            // Use a transaction to safely update the wallet balance
            await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef)
                
                if (!userDoc.exists) {
                    throw new Error("User document not found")
                }
                
                const userData = userDoc.data() || {}
                const currentBalance = userData.walletBalance || 0
                const newBalance = currentBalance + amount
                
                transaction.update(userRef, { 
                    walletBalance: newBalance,
                    updatedAt: FieldValue.serverTimestamp()
                })
                
                // Also update the payment document with final details
                transaction.update(paymentRef, {
                    'metadata.previousBalance': currentBalance,
                    'metadata.newBalance': newBalance
                })
            })
            
            // Create a transaction record
            await db.collection('users').doc(userId).collection('transactions').add({
                type: 'deposit',
                amount,
                currency: 'USD',
                paymentId: orderId,
                paymentProvider: provider,
                createdAt: FieldValue.serverTimestamp(),
                description: `Wallet deposit of $${amount}`
            })

            // Revalidate relevant paths to update UI
            revalidatePath("/dashboard/billing")
            revalidatePath("/dashboard/wallet")

            return {
                success: true
            }
        } else if (planType && planTier) {
            // Process proxy plan purchase
            const plan = PROXY_PLANS[planType][planTier]

            if (!plan) {
                return {
                    success: false,
                    error: "Invalid plan selection"
                }
            }

            // Calculate expiration date for non-recurring plans
            let expirationDate = null
            if (!plan.isRecurring) {
                const now = new Date()
                
                // Set expiration based on plan type
                if (planType === 'static_residential') {
                    // Parse the bandwidth string to get duration
                    const durationMatch = plan.bandwidth.match(/(\d+)\s+Day/)
                    if (durationMatch && durationMatch[1]) {
                        const days = parseInt(durationMatch[1], 10)
                        expirationDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
                    }
                } else {
                    // Default to 30 days for other non-recurring plans
                    expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                }
            }

            // Create or update user's subscription/purchase in Firestore
            const userProxiesRef = db.collection('users').doc(userId).collection('proxies')
            
            // Check if user already has this proxy type
            const existingProxyQuery = await userProxiesRef.where('type', '==', planType).limit(1).get()
            
            if (!existingProxyQuery.empty) {
                // Update existing proxy record
                const proxyDoc = existingProxyQuery.docs[0]
                await proxyDoc.ref.update({
                    tier: planTier,
                    planName: plan.name,
                    isRecurring: plan.isRecurring,
                    bandwidth: plan.bandwidth,
                    updatedAt: FieldValue.serverTimestamp(),
                    expiresAt: expirationDate ? FieldValue.serverTimestamp() : null,
                    status: 'active',
                    lastPaymentId: orderId,
                    lastPaymentDate: FieldValue.serverTimestamp()
                })
            } else {
                // Create new proxy record
                await userProxiesRef.add({
                    type: planType,
                    tier: planTier,
                    planName: plan.name,
                    isRecurring: plan.isRecurring,
                    bandwidth: plan.bandwidth,
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                    expiresAt: expirationDate,
                    status: 'active',
                    lastPaymentId: orderId,
                    lastPaymentDate: FieldValue.serverTimestamp(),
                    usageData: {
                        totalBandwidth: plan.isRecurring ? plan.bandwidth : '0 GB',
                        usedBandwidth: '0 GB',
                        remainingBandwidth: plan.bandwidth
                    }
                })
            }
            
            // Create a transaction record
            await db.collection('users').doc(userId).collection('transactions').add({
                type: 'purchase',
                amount: plan.price / 100, // Convert cents to dollars
                currency: 'USD',
                paymentId: orderId,
                paymentProvider: provider,
                createdAt: FieldValue.serverTimestamp(),
                description: `Purchase of ${plan.name} proxy plan`,
                metadata: {
                    proxyType: planType,
                    tier: planTier,
                    planName: plan.name,
                    bandwidth: plan.bandwidth,
                    isRecurring: plan.isRecurring
                }
            })

            // Revalidate relevant paths to update UI
            revalidatePath(`/dashboard/proxies/${planType}`)
            revalidatePath("/dashboard/billing")

            return {
                success: true
            }
        } else {
            return {
                success: false,
                error: "Invalid payment processing parameters"
            }
        }
    } catch (error) {
        console.error("Error processing successful payment:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error processing payment"
        }
    }
}

/**
 * Handles payment cancellation
 */
export async function handlePaymentCancellation({
    orderId,
    provider,
}: {
    orderId: string
    provider: PaymentProvider
}): Promise<{ success: boolean; error?: string }> {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
        return {
            success: false,
            error: "Authentication required"
        }
    }

    try {
        // Get the payment document reference
        const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId)
        const paymentDoc = await paymentRef.get()
        
        // Check if payment document exists
        if (paymentDoc.exists) {
            // Update payment status to cancelled
            await paymentRef.update({
                status: 'cancelled',
                updatedAt: FieldValue.serverTimestamp(),
                cancelledAt: FieldValue.serverTimestamp()
            })
        } else {
            // Create a record of the cancelled payment if it doesn't exist
            // This might happen if the user cancels at the payment provider before we create our record
            await paymentRef.set({
                orderId,
                userId,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                cancelledAt: FieldValue.serverTimestamp(),
                status: 'cancelled',
                provider: provider,
                metadata: {
                    cancelReason: 'User cancelled at payment provider'
                }
            })
        }
        
        // Log the cancellation
        console.log(`Payment cancelled: Order ${orderId} by user ${userId} using ${provider}`)

        return {
            success: true
        }
    } catch (error) {
        console.error("Error handling payment cancellation:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error handling cancellation"
        }
    }
}

/**
 * Redirects to payment page based on the response from handleProxyPlanPurchase or handleWalletDeposit
 */
export async function redirectToPayment(paymentResponse: PaymentResponse) {
    if (paymentResponse.success && paymentResponse.redirectUrl) {
        redirect(paymentResponse.redirectUrl)
    } else {
        // Redirect to error page with details
        const errorMessage = encodeURIComponent(paymentResponse.error || "Unknown payment error")
        redirect(`/dashboard/billing/error?message=${errorMessage}`)
    }
}