"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletBalanceCard } from "./components/deposit"
import { TransactionHistory } from "./components/transaction-history"
import { SpendingChart } from "./components/spending-chart"

export default function BillingPage() {
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const timeRanges = ["1D", "7D", "1M"]

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
        <p className="text-muted-foreground">Manage your payments and view transaction history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Left Column - Wallet & Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <WalletBalanceCard />

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
          <SpendingChart />
        </div>
      </div>

      {/* Transaction History Component */}
      <TransactionHistory />
    </main>
  )
}