"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  ArrowLeft,
  Search,
  ShoppingCart,
  TrendingUp,
  Shield,
  Users,
  Code,
  Database,
  Eye,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UseCases() {
  const useCases = [
    {
      icon: Search,
      title: "Web Scraping",
      description: "Extract data from websites at scale without getting blocked",
      features: ["Bypass anti-bot systems", "Rotate IPs automatically", "High success rates", "Fast data collection"],
      color: "from-blue-400 to-blue-500",
      borderColor: "border-blue-200/30 dark:border-blue-500/30",
      popular: true,
    },
    {
      icon: TrendingUp,
      title: "Market Research",
      description: "Gather competitive intelligence and market data",
      features: ["Price monitoring", "Competitor analysis", "Product research", "Market trends"],
      color: "from-green-400 to-green-500",
      borderColor: "border-green-200/30 dark:border-green-500/30",
      popular: false,
    },
    {
      icon: Users,
      title: "Social Media Management",
      description: "Manage multiple accounts safely and efficiently",
      features: ["Account management", "Content scheduling", "Engagement tracking", "Brand monitoring"],
      color: "from-purple-400 to-purple-500",
      borderColor: "border-purple-200/30 dark:border-purple-500/30",
      popular: true,
    },
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Monitor prices, inventory, and competitor strategies",
      features: ["Price comparison", "Inventory tracking", "Product monitoring", "Review analysis"],
      color: "from-orange-400 to-orange-500",
      borderColor: "border-orange-200/30 dark:border-orange-500/30",
      popular: false,
    },
    {
      icon: Shield,
      title: "Ad Verification",
      description: "Verify ad placements and prevent fraud",
      features: ["Ad fraud detection", "Campaign verification", "Brand safety", "Compliance monitoring"],
      color: "from-red-400 to-red-500",
      borderColor: "border-red-200/30 dark:border-red-500/30",
      popular: false,
    },
    {
      icon: Eye,
      title: "SEO Monitoring",
      description: "Track search rankings and SEO performance",
      features: ["SERP tracking", "Keyword monitoring", "Competitor analysis", "Local SEO"],
      color: "from-cyan-400 to-cyan-500",
      borderColor: "border-cyan-200/30 dark:border-cyan-500/30",
      popular: false,
    },
    {
      icon: Database,
      title: "Data Collection",
      description: "Collect large datasets for analysis and research",
      features: ["Academic research", "Business intelligence", "Lead generation", "Content aggregation"],
      color: "from-indigo-400 to-indigo-500",
      borderColor: "border-indigo-200/30 dark:border-indigo-500/30",
      popular: false,
    },
    {
      icon: Target,
      title: "Brand Protection",
      description: "Monitor and protect your brand online",
      features: ["Trademark monitoring", "Counterfeit detection", "Brand mention tracking", "Reputation management"],
      color: "from-pink-400 to-pink-500",
      borderColor: "border-pink-200/30 dark:border-pink-500/30",
      popular: false,
    },
  ]

  const industries = [
    {
      name: "E-commerce",
      description: "Online retailers and marketplaces",
      icon: ShoppingCart,
      stats: "40% of customers",
    },
    {
      name: "Marketing Agencies",
      description: "Digital marketing and advertising",
      icon: TrendingUp,
      stats: "25% of customers",
    },
    {
      name: "Research Companies",
      description: "Market research and data analysis",
      icon: Database,
      stats: "20% of customers",
    },
    {
      name: "Tech Companies",
      description: "Software and technology firms",
      icon: Code,
      stats: "15% of customers",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
              USE CASES
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Proxy Solutions for <span className="flame-text">Every Need</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover how businesses across industries use NoxaProxy to overcome challenges, gather data, and scale
              their operations with reliable proxy infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon
              return (
                <Card
                  key={index}
                  className={`glass-effect ${useCase.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative`}
                >
                  {useCase.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                      Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{useCase.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-muted/30 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Trusted by <span className="flame-text">Leading Industries</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From startups to Fortune 500 companies, businesses across industries rely on NoxaProxy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon
              return (
                <Card
                  key={index}
                  className="glass-effect border-orange-200/30 dark:border-orange-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{industry.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{industry.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {industry.stats}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <Card className="glass-effect border-orange-200/30 dark:border-orange-500/30 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Get <span className="flame-text">Started</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that trust NoxaProxy for their proxy needs. Start with our free trial and
                experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-200 dark:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                >
                  View Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
