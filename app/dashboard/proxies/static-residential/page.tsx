"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Filter, RotateCcw } from "lucide-react"

export default function StaticResidentialPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const timeRanges = ["1D", "7D", "1M"]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "generator", label: "Generator" },
    { id: "plans", label: "Plans" },
  ]

  const orders = []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Static Residential Proxies</h1>
              <p className="text-muted-foreground">Dedicated residential IPs for consistent connections</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`${
                    activeTab === tab.id
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
                {/* Left Column - IP Info */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-sm font-medium">Active IPs</CardTitle>
                      <div className="text-3xl font-bold text-foreground">0</div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80">
                        <span className="text-foreground">Auto Renewal</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Button className="w-full bg-muted hover:bg-muted/80 text-foreground" variant="secondary">
                        Purchase IPs
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Usage Stats */}
                <div className="lg:col-span-3">
                  <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground text-sm font-medium">IP Usage</CardTitle>
                        <div className="text-3xl font-bold text-foreground mt-2">0 / 0</div>
                      </div>
                      <div className="flex space-x-1">
                        {timeRanges.map((range) => (
                          <Button
                            key={range}
                            variant={activeTimeRange === range ? "secondary" : "ghost"}
                            size="sm"
                            className={
                              activeTimeRange === range
                                ? "bg-pink-600 text-white hover:bg-pink-700"
                                : "text-muted-foreground hover:text-foreground"
                            }
                            onClick={() => setActiveTimeRange(range)}
                          >
                            {range}
                          </Button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-muted rounded flex items-end justify-center">
                        <div className="text-muted-foreground text-sm">IP usage visualization</div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>11:00</span>
                        <span>15:00</span>
                        <span>19:00</span>
                        <span>23:00</span>
                        <span>03:00</span>
                        <span>07:00</span>
                        <span>11:00</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Orders Table */}
                <div className="lg:col-span-3">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">ID</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Name</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Date</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Amount</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Price</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="text-foreground font-medium">No orders yet</div>
                                  <div className="text-muted-foreground text-sm">
                                    Your order history will appear here once you make your first purchase
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <div className="lg:col-span-1">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Button className="w-full bg-muted hover:bg-muted/80 text-foreground" variant="secondary">
                          Apply filters
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-foreground"
                          size="sm"
                        >
                          <RotateCcw className="w-3 h-3 mr-2" />
                          Clear all
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "generator" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">IP Generator</h3>
                <p className="text-muted-foreground">Generate static residential IP endpoints</p>
              </div>
            )}

            {activeTab === "plans" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">Static IP Plans</h3>
                <p className="text-muted-foreground">Choose from our static residential IP plans</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
