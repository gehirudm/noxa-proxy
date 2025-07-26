"use client"

import { useSearchParams } from "next/navigation"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Header } from "../../components/header"
import { Sidebar } from "../../components/sidebar"
import { ProxyOrders } from "../components/proxy-orders"
import { ProxyPlans } from "../components/proxy-plans"
import { ProxyUrlGenerator } from "../components/proxy-url-generator"
import { ProxyUsage } from "../components/proxy-usage"

export default function StaticResidentialPage() {
  // Use nuqs for tab state management
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "overview",
    parse: (value) => {
      // Validate that the value is one of our allowed tabs
      const validTabs = ["overview", "generator", "plans"];
      return validTabs.includes(value) ? value : "overview";
    },
    serialize: (value) => value,
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "generator", label: "Generator" },
    { id: "plans", label: "Plans" },
  ]

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Static Residential Proxies</h1>
        <p className="text-muted-foreground">Dedicated static residential IPs with consistent performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={`${activeTab === tab.id
                ? "bg-background text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Traffic Info */}
          <div className="lg:col-span-1">
            <ProxyUsage proxyType="static_residential" />
          </div>

          {/* Right Column - Traffic Usage */}
          <div className="lg:col-span-3">
            <ProxyOrders proxyType="static_residential" />
          </div>
        </div>
      )}

      {activeTab === "generator" && (
        <div>
          <ProxyUrlGenerator
            title="Static Residential Proxy Generator"
            defaultProxyType="residential"
          />
        </div>
      )}

      {activeTab === "plans" && (
        <div>
          <ProxyPlans proxyType="residential" />
        </div>
      )}
    </main>
  )
}