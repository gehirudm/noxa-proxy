"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Smartphone, Globe, Target, MessageCircle } from "lucide-react"

export default function MobileProxyPage() {
  const [activeTab, setActiveTab] = useState("pricing")
  const [planTier, setPlanTier] = useState("regular")
  const [infoTab, setInfoTab] = useState("proxies")

  const mainTabs = [
    { id: "pricing", label: "Pricing" },
    { id: "information", label: "Information" },
  ]

  const planTiers = [
    { id: "regular", label: "Regular" },
    { id: "professional", label: "Professional" },
    { id: "enterprise", label: "Enterprise" },
  ]

  const infoTabs = [
    { id: "proxies", label: "Proxies" },
    { id: "mobile-proxies", label: "Mobile Proxies" },
  ]

  const pricingPlans = [
    {
      name: "Pay-as-you-go",
      price: "$3.98",
      unit: "/GB",
      buttonText: "Purchase",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      subtitle: "No Commitment",
      traffic: "1 GB",
    },
    {
      name: "Flex Plan",
      price: "$3.75",
      unit: "/GB",
      buttonText: "Free Trial",
      buttonStyle: "bg-gray-700 hover:bg-gray-800 text-white",
      subtitle: "$30 billed monthly",
      traffic: "8 GB",
    },
    {
      name: "Pro Plan",
      price: "$3.6",
      unit: "/GB",
      buttonText: "Subscribe",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      subtitle: "$90 billed monthly",
      traffic: "25 GB",
    },
    {
      name: "Advanced Plan",
      price: "$3.4",
      unit: "/GB",
      buttonText: "Subscribe",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      subtitle: "$170 billed monthly",
      traffic: "50 GB",
    },
  ]

  const benefits = [
    {
      name: "Traffic",
      values: ["1 GB", "8 GB", "25 GB", "50 GB"],
    },
    {
      name: "Concurrent Sessions",
      values: [true, true, true, true],
    },
    {
      name: "City-level targeting",
      values: [true, true, true, true],
    },
    {
      name: "24/7 Support",
      values: [true, true, true, true],
    },
    {
      name: "Dedicated Account Manager",
      values: [false, false, true, true],
    },
  ]

  const features = [
    "HTTPS & SOCKS5 Support",
    "Free Geo Targeting",
    "99.9% Uptime",
    "Unlimited Threads",
    "<0.5s Response Time",
    "24/7 Dedicated Support",
  ]

  const featureCards = [
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access proxies from multiple countries worldwide",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Multiple Protocols",
      description: "Support for HTTP, HTTPS, and SOCKS5 protocols",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Smartphone,
      title: "City/State/Country Targeting",
      description: "Precise geographical targeting capabilities",
      color: "from-green-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Mobile Proxies</h1>
              <p className="text-muted-foreground">High-speed mobile network proxies for advanced use cases</p>
            </div>

            {/* Main Tab Navigation */}
            <div className="flex space-x-1 mb-6">
              {mainTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {activeTab === "pricing" && (
              <div>
                {/* Plan Tier Navigation */}
                <div className="flex space-x-1 mb-8">
                  {planTiers.map((tier) => (
                    <Button
                      key={tier.id}
                      variant={planTier === tier.id ? "secondary" : "ghost"}
                      className={`${
                        planTier === tier.id
                          ? "bg-background text-foreground border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setPlanTier(tier.id)}
                    >
                      {tier.label}
                    </Button>
                  ))}
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {pricingPlans.map((plan, index) => (
                    <Card key={index} className="bg-card border-border">
                      <CardHeader className="text-center">
                        <CardTitle className="text-foreground text-lg">{plan.name}</CardTitle>
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.unit}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className={`w-full ${plan.buttonStyle}`}>{plan.buttonText}</Button>
                        <p className="text-center text-muted-foreground text-sm">{plan.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Benefits Table */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium"></th>
                            {pricingPlans.map((plan, index) => (
                              <th key={index} className="text-center py-3 px-4 text-muted-foreground font-medium">
                                {plan.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {benefits.map((benefit, benefitIndex) => (
                            <tr key={benefitIndex} className="border-b border-border/50">
                              <td className="py-3 px-4 text-foreground font-medium">{benefit.name}</td>
                              {benefit.values.map((value, valueIndex) => (
                                <td key={valueIndex} className="py-3 px-4 text-center">
                                  {typeof value === "boolean" ? (
                                    value ? (
                                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                      <X className="w-5 h-5 text-red-500 mx-auto" />
                                    )
                                  ) : (
                                    <span className="text-foreground font-medium">{value}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "information" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Mobile Proxies Info */}
                <Card className="bg-card border-border">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-foreground text-2xl">Mobile Proxies</CardTitle>
                    <p className="text-muted-foreground">
                      NoxaProxy is committed to the highest integrity in curating its MOBILE proxy pool, ensuring no
                      shortcuts in ethical compliance.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">View Pricing</Button>

                    <div>
                      <h4 className="text-foreground font-semibold mb-4">Includes:</h4>
                      <div className="space-y-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column - Usage Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex space-x-1 mb-4">
                      {infoTabs.map((tab) => (
                        <Button
                          key={tab.id}
                          variant={infoTab === tab.id ? "secondary" : "ghost"}
                          size="sm"
                          className={`${
                            infoTab === tab.id
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                          onClick={() => setInfoTab(tab.id)}
                        >
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Use our proxies in your own software with ease.
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {featureCards.map((card, index) => (
                      <Card key={index} className="bg-card border-border overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}
                            >
                              <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-foreground font-semibold">{card.title}</h4>
                              <p className="text-muted-foreground text-sm">{card.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-foreground font-semibold">Support</h4>
                            <p className="text-muted-foreground text-sm">
                              Can't find what you're looking for? Reach out to us.
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                          Contact Us
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
