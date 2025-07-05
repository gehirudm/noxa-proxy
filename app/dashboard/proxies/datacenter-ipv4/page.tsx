"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, FileText } from "lucide-react"

export default function DatacenterIPv4Page() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const timeRanges = ["1D", "7D", "1M"]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "plans", label: "Plans" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Datacenter IPv4 Proxies</h1>
              <p className="text-muted-foreground">High-speed datacenter proxies with IPv4 addresses</p>
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
                {/* Left Column - Stats */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-sm font-medium">Active IPS</CardTitle>
                      <div className="text-3xl font-bold text-foreground">0</div>
                    </CardHeader>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-sm font-medium">Orders Count</CardTitle>
                      <div className="text-3xl font-bold text-foreground">0</div>
                    </CardHeader>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80">
                        <span className="text-foreground">Auto renewal</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Button className="w-full bg-muted hover:bg-muted/80 text-foreground" variant="secondary">
                    Buy more
                  </Button>
                </div>

                {/* Right Column - Total Purchases */}
                <div className="lg:col-span-3">
                  <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground text-sm font-medium">Total Purchases</CardTitle>
                        <div className="text-3xl font-bold text-foreground mt-2">0 orders</div>
                      </div>
                      <div className="flex space-x-1">
                        {timeRanges.map((range) => (
                          <Button
                            key={range}
                            variant={activeTimeRange === range ? "secondary" : "ghost"}
                            size="sm"
                            className={
                              activeTimeRange === range
                                ? "bg-background text-foreground border border-border"
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
                        <div className="text-muted-foreground text-sm">Purchase data visualization</div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>12:30</span>
                        <span>16:30</span>
                        <span>20:30</span>
                        <span>00:30</span>
                        <span>04:30</span>
                        <span>08:30</span>
                        <span>12:30</span>
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
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Create</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Expire</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">IPS</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Price</th>
                              <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center space-y-2">
                                  <FileText className="w-8 h-8 text-muted-foreground" />
                                  <div className="text-foreground font-medium">No data to display</div>
                                  <div className="text-muted-foreground text-sm">
                                    Looks like you dont have any orders yet!
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
                      <CardTitle className="text-foreground">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select date" />
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
                        <label className="text-sm font-medium text-foreground mb-2 block">Active</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select active" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Auto renewal</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select renewal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
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
                          Clear all
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "plans" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">Datacenter IPv4 Plans</h3>
                <p className="text-muted-foreground">Choose from our datacenter IPv4 proxy plans</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
