"use client"

import { PromoBanner } from "./components/promo-banner"
import { ActiveSubscriptions } from "./components/active-subscriptions"

export default function Dashboard() {
  return (
    <main className="p-6 space-y-6 bg-background">
      <PromoBanner />
      <ActiveSubscriptions />
      {/* <UsageCharts /> */}
      {/* <ServiceCards /> */}
    </main>
  )
}
