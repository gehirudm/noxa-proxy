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
      price: 2750, // $2.75/GB * 10GB = $27.50
      bandwidth: "10GB",
      priceId: process.env.STRIPE_RESIDENTIAL_BASIC!,
      isRecurring: true,
    },
    pro: {
      name: "Residential Pro",
      price: 6875, // $2.75/GB * 25GB = $68.75
      bandwidth: "25GB",
      priceId: process.env.STRIPE_RESIDENTIAL_PRO!,
      isRecurring: true,
    },
    enterprise: {
      name: "Residential Enterprise",
      price: 27500, // $2.75/GB * 100GB = $275
      bandwidth: "100GB",
      priceId: process.env.STRIPE_RESIDENTIAL_ENTERPRISE!,
      isRecurring: true,
    },
  },
  mobile: {
    basic: {
      name: "Mobile Basic",
      price: 2500, // $5/GB * 5GB = $25
      bandwidth: "5GB",
      priceId: process.env.STRIPE_MOBILE_BASIC!,
      isRecurring: true,
    },
    pro: {
      name: "Mobile Pro",
      price: 10000, // $5/GB * 20GB = $100
      bandwidth: "20GB",
      priceId: process.env.STRIPE_MOBILE_PRO!,
      isRecurring: true,
    },
    enterprise: {
      name: "Mobile Enterprise",
      price: 30000, // $5/GB * 60GB = $300
      bandwidth: "60GB",
      priceId: process.env.STRIPE_MOBILE_ENTERPRISE!,
      isRecurring: true,
    },
  },
  datacenter: {
    basic: {
      name: "Datacenter One-Time 10GB",
      price: 2000, // $2/GB * 10GB = $20
      bandwidth: "10GB",
      priceId: process.env.STRIPE_DATACENTER_BASIC!,
      isRecurring: false,
    },
    pro: {
      name: "Datacenter One-Time 25GB",
      price: 5000, // $2/GB * 25GB = $50
      bandwidth: "25GB",
      priceId: process.env.STRIPE_DATACENTER_PRO!,
      isRecurring: false,
    },
    enterprise: {
      name: "Datacenter One-Time 100GB",
      price: 20000, // $2/GB * 100GB = $200
      bandwidth: "100GB",
      priceId: process.env.STRIPE_DATACENTER_ENTERPRISE!,
      isRecurring: false,
    },
  },
  static_residential: {
    basic: {
      name: "Static Residential - 1 Day",
      price: 390, // $3.90
      bandwidth: "1 Day",
      priceId: process.env.STRIPE_STATIC_RESIDENTIAL_1DAY!,
      isRecurring: false,
    },
    pro: {
      name: "Static Residential - 30 Days",
      price: 790, // $7.90
      bandwidth: "30 Days",
      priceId: process.env.STRIPE_STATIC_RESIDENTIAL_30DAYS!,
      isRecurring: false,
    },
    enterprise: {
      name: "Static Residential - 90 Days",
      price: 2100, // $21
      bandwidth: "90 Days",
      priceId: process.env.STRIPE_STATIC_RESIDENTIAL_90DAYS!,
      isRecurring: false,
    },
  },
}

// Additional plan for 60 days static residential
export const ADDITIONAL_PLANS = {
  static_residential_60days: {
    name: "Static Residential - 60 Days",
    price: 1500, // $15
    bandwidth: "60 Days",
    priceId: process.env.STRIPE_STATIC_RESIDENTIAL_60DAYS!,
    isRecurring: false,
  }
}