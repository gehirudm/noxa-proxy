"use client"

import { useState } from "react"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Copy, ExternalLink, Users, FileText } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://dashboard.noxaproxy.com/sign-up?ref_code=Y1AcU2NX8P"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
              <p className="text-muted-foreground">Earn money by referring new users to NoxaProxy</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Current Balance Section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Current balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-pink-500" />
                      <span className="text-3xl font-bold text-foreground">$0</span>
                    </div>
                    <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                      Withdraw
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">Available: $0</div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">Earn Percentage:</span>
                      <Badge variant="secondary" className="bg-pink-600 text-white">
                        15%
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Learn more
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">$0</div>
                      <div className="text-xs text-muted-foreground">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">$0</div>
                      <div className="text-xs text-muted-foreground">Earned last week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">0</div>
                      <div className="text-xs text-muted-foreground">Referred Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">0</div>
                      <div className="text-xs text-muted-foreground">Referral bills</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How it works Section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">How it works?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Share your link, and when any user who signed up using your link purchases a product, you will earn
                    a percentage of the price as bonus. You can withdraw this earned money to your balance, or as
                    crypto.
                  </p>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Referral link</label>
                    <div className="flex space-x-2">
                      <Input
                        value={referralLink}
                        readOnly
                        className="bg-background border-border text-foreground font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      className="w-full bg-muted hover:bg-muted/80 text-foreground"
                      variant="secondary"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy link"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Withdrawal History */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Withdrawal history</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-2">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <div className="text-foreground font-medium">No data to display</div>
                            <div className="text-muted-foreground text-sm">
                              Looks like you don't have any withdrawals yet
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Referral List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Referral list</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">User Id</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Transaction Type</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Deposit</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Percent</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-2">
                            <Users className="w-8 h-8 text-muted-foreground" />
                            <div className="text-foreground font-medium">No data to display</div>
                            <div className="text-muted-foreground text-sm">
                              Looks like you don't have any earnings yet!
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
