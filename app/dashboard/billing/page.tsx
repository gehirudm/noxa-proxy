"use client"

import { useState } from "react"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, ChevronRight, Filter, RotateCcw } from "lucide-react"
import { WalletBalanceCard } from "./components/deposit"

export default function BillingPage() {
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const timeRanges = ["1D", "7D", "1M"]

  // Sample transaction data
  const transactions = []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
              <p className="text-muted-foreground">Manage your payments and view transaction history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Left Column - Wallet & Quick Actions */}
              <div className="lg:col-span-1 space-y-4">
                <WalletBalanceCard/>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Referral Earned</div>
                        <div className="text-lg font-semibold text-foreground">$0</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Auto renewal</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Total Spent Chart */}
              <div className="lg:col-span-3">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground text-sm font-medium">Total Spent</CardTitle>
                      <div className="text-2xl font-bold text-foreground mt-2">$0.00</div>
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
                      <div className="text-muted-foreground text-sm">No spending data available</div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>12/08</span>
                      <span>16/08</span>
                      <span>20/08</span>
                      <span>24/08</span>
                      <span>28/08</span>
                      <span>01/09</span>
                      <span>05/09</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Transaction History */}
              <div className="lg:col-span-3">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Transaction history</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                              Proxy Type
                            </th>
                            <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                              Transaction Type
                            </th>
                            <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Date</th>
                            <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                            <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center space-y-2">
                                <CreditCard className="w-8 h-8 text-muted-foreground" />
                                <div className="text-foreground font-medium">No transactions yet</div>
                                <div className="text-muted-foreground text-sm">
                                  Your transaction history will appear here once you make your first purchase
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
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Transaction Type</label>
                      <Select>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="spending">Spending</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Proxy Type</label>
                      <Select>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select proxy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="static">Static Residential</SelectItem>
                          <SelectItem value="rotating">Rotating Residential</SelectItem>
                          <SelectItem value="datacenter">Datacenter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button className="w-full bg-muted hover:bg-muted/80 text-foreground" variant="secondary">
                        Apply filters
                      </Button>
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" size="sm">
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Clear all
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
