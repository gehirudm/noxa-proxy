import Stripe from "stripe"

export interface ProxyPlan {
  name: string
  price: number // in cents
  bandwidth: string
  priceId: string
  isRecurring: boolean
}

export const PROXY_PLANS: Record<
  string,
  Record<"basic" | "pro" | "enterprise", ProxyPlan>
> = {
  residential: {
    basic: {
      name: "Residential Basic",
      price: 2999,
      bandwidth: "10GB",
      priceId: process.env.STRIPE_RESIDENTIAL_BASIC!,
      isRecurring: true,
    },
    pro: {
      name: "Residential Pro",
      price: 4999,
      bandwidth: "25GB",
      priceId: process.env.STRIPE_RESIDENTIAL_PRO!,
      isRecurring: true,
    },
    enterprise: {
      name: "Residential Enterprise",
      price: 9999,
      bandwidth: "100GB",
      priceId: process.env.STRIPE_RESIDENTIAL_ENTERPRISE!,
      isRecurring: true,
    },
  },
  mobile: {
    basic: {
      name: "Mobile Basic",
      price: 3999,
      bandwidth: "5GB",
      priceId: process.env.STRIPE_MOBILE_BASIC!,
      isRecurring: true,
    },
    pro: {
      name: "Mobile Pro",
      price: 7999,
      bandwidth: "20GB",
      priceId: process.env.STRIPE_MOBILE_PRO!,
      isRecurring: true,
    },
    enterprise: {
      name: "Mobile Enterprise",
      price: 14999,
      bandwidth: "60GB",
      priceId: process.env.STRIPE_MOBILE_ENTERPRISE!,
      isRecurring: true,
    },
  },
  datacenter: {
    basic: {
      name: "Datacenter One-Time 10GB",
      price: 1999,
      bandwidth: "10GB",
      priceId: process.env.STRIPE_DATACENTER_BASIC!,
      isRecurring: false,
    },
    pro: {
      name: "Datacenter One-Time 25GB",
      price: 3999,
      bandwidth: "25GB",
      priceId: process.env.STRIPE_DATACENTER_PRO!,
      isRecurring: false,
    },
    enterprise: {
      name: "Datacenter One-Time 100GB",
      price: 7999,
      bandwidth: "100GB",
      priceId: process.env.STRIPE_DATACENTER_ENTERPRISE!,
      isRecurring: false,
    },
  },
}

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
  proxyType: keyof typeof PROXY_PLANS // 'residential' | 'mobile' | 'datacenter'
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

