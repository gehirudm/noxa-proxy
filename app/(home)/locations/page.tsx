"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Zap, ArrowLeft, Globe, MapPin, Search, Wifi, Gauge, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const locations = [
    {
      country: "United States",
      city: "New York",
      flag: "🇺🇸",
      region: "North America",
      ips: "50,000+",
      latency: "5ms",
      uptime: "99.9%",
      type: "Residential",
      popular: true,
    },
    {
      country: "United States",
      city: "Los Angeles",
      flag: "🇺🇸",
      region: "North America",
      ips: "45,000+",
      latency: "8ms",
      uptime: "99.9%",
      type: "Datacenter",
      popular: true,
    },
    {
      country: "United Kingdom",
      city: "London",
      flag: "🇬🇧",
      region: "Europe",
      ips: "35,000+",
      latency: "12ms",
      uptime: "99.8%",
      type: "Residential",
      popular: true,
    },
    {
      country: "Germany",
      city: "Frankfurt",
      flag: "🇩🇪",
      region: "Europe",
      ips: "30,000+",
      latency: "10ms",
      uptime: "99.9%",
      type: "Datacenter",
      popular: false,
    },
    {
      country: "France",
      city: "Paris",
      flag: "🇫🇷",
      region: "Europe",
      ips: "25,000+",
      latency: "15ms",
      uptime: "99.7%",
      type: "Residential",
      popular: false,
    },
    {
      country: "Japan",
      city: "Tokyo",
      flag: "🇯🇵",
      region: "Asia",
      ips: "40,000+",
      latency: "18ms",
      uptime: "99.8%",
      type: "Residential",
      popular: true,
    },
    {
      country: "Singapore",
      city: "Singapore",
      flag: "🇸🇬",
      region: "Asia",
      ips: "20,000+",
      latency: "20ms",
      uptime: "99.9%",
      type: "Datacenter",
      popular: false,
    },
    {
      country: "Australia",
      city: "Sydney",
      flag: "🇦🇺",
      region: "Oceania",
      ips: "15,000+",
      latency: "25ms",
      uptime: "99.6%",
      type: "Residential",
      popular: false,
    },
    {
      country: "Canada",
      city: "Toronto",
      flag: "🇨🇦",
      region: "North America",
      ips: "18,000+",
      latency: "12ms",
      uptime: "99.8%",
      type: "Datacenter",
      popular: false,
    },
    {
      country: "Brazil",
      city: "São Paulo",
      flag: "🇧🇷",
      region: "South America",
      ips: "22,000+",
      latency: "30ms",
      uptime: "99.5%",
      type: "Residential",
      popular: false,
    },
    {
      country: "India",
      city: "Mumbai",
      flag: "🇮🇳",
      region: "Asia",
      ips: "28,000+",
      latency: "22ms",
      uptime: "99.7%",
      type: "Residential",
      popular: false,
    },
    {
      country: "Netherlands",
      city: "Amsterdam",
      flag: "🇳🇱",
      region: "Europe",
      ips: "32,000+",
      latency: "8ms",
      uptime: "99.9%",
      type: "Datacenter",
      popular: false,
    },
  ]

  const regions = [
    { value: "all", label: "All Regions", count: locations.length },
    {
      value: "North America",
      label: "North America",
      count: locations.filter((l) => l.region === "North America").length,
    },
    { value: "Europe", label: "Europe", count: locations.filter((l) => l.region === "Europe").length },
    { value: "Asia", label: "Asia", count: locations.filter((l) => l.region === "Asia").length },
    {
      value: "South America",
      label: "South America",
      count: locations.filter((l) => l.region === "South America").length,
    },
    { value: "Oceania", label: "Oceania", count: locations.filter((l) => l.region === "Oceania").length },
  ]

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || location.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const stats = [
    {
      icon: Globe,
      label: "Countries",
      value: "50+",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: MapPin,
      label: "Cities",
      value: "100+",
      color: "from-green-400 to-green-500",
    },
    {
      icon: Wifi,
      label: "IP Addresses",
      value: "10M+",
      color: "from-purple-400 to-purple-500",
    },
    {
      icon: Gauge,
      label: "Avg Latency",
      value: "<50ms",
      color: "from-orange-400 to-orange-500",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 w-full flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
              GLOBAL NETWORK
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              <span className="flame-text">Worldwide</span> Proxy Locations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Access our premium proxy network spanning across 50+ countries and 100+ cities. Get the best performance
              with our strategically located servers worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="glass-effect border-orange-200/30 dark:border-orange-500/30 text-center">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/30 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search countries or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-effect border-orange-200/30 dark:border-orange-500/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <Button
                  key={region.value}
                  variant={selectedRegion === region.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRegion(region.value)}
                  className={
                    selectedRegion === region.value
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "border-orange-200 dark:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                  }
                >
                  {region.label} ({region.count})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location, index) => (
              <Card
                key={index}
                className="glass-effect border-orange-200/30 dark:border-orange-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
              >
                {location.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{location.flag}</span>
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">{location.city}</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">{location.country}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs w-fit ${location.type === "Residential"
                      ? "border-green-200 text-green-600 dark:border-green-500/30 dark:text-green-400"
                      : "border-blue-200 text-blue-600 dark:border-blue-500/30 dark:text-blue-400"
                      }`}
                  >
                    {location.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IP Addresses</span>
                      <span className="font-semibold text-foreground">{location.ips}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-semibold text-green-600">{location.latency}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-semibold text-blue-600">{location.uptime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No locations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30 flex justify-center">
        <div className="container px-4 md:px-6">
          <Card className="glass-effect border-orange-200/30 dark:border-orange-500/30 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Need a <span className="flame-text">Custom Location</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Don't see the location you need? Contact our team to discuss custom proxy solutions tailored to your
                specific geographic requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8"
                >
                  Contact Sales
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Link href={"/#products"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-orange-200 dark:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
