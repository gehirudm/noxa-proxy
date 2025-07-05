import { PromoBanner } from "./promo-banner"
import { ActiveSubscriptions } from "./active-subscriptions"
import { UsageCharts } from "./usage-charts"
import { ServiceCards } from "./service-cards"

export function MainContent() {
  return (
    <main className="p-6 space-y-6 bg-background">
      <PromoBanner />
      <ActiveSubscriptions />
      <UsageCharts />
      <ServiceCards />
    </main>
  )
}
