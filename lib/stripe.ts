import Stripe from "stripe"
import { PROXY_PLANS, type ProxyPlan } from "./proxy-plans"

export { PROXY_PLANS, type ProxyPlan }

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function createSubscriptionCheckoutSession({
  customerEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerEmail: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session.url
}

export async function createOneTimeCheckoutSession({
  customerEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerEmail: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session.url
}


export async function handleProxyPlanPurchase({
  email,
  proxyType,
  tier,
  successUrl,
  cancelUrl,
}: {
  email: string
  proxyType: keyof typeof PROXY_PLANS // 'residential' | 'mobile' | 'datacenter' | 'static_residential'
  tier: "basic" | "pro" | "enterprise"
  successUrl: string
  cancelUrl: string
}) {
  const plan = PROXY_PLANS[proxyType][tier]

  if (!plan) {
    throw new Error("Invalid plan selection.")
  }

  return plan.isRecurring
    ? await createSubscriptionCheckoutSession({
        customerEmail: email,
        priceId: plan.priceId,
        successUrl,
        cancelUrl,
      })
    : await createOneTimeCheckoutSession({
        customerEmail: email,
        priceId: plan.priceId,
        successUrl,
        cancelUrl,
      })
}