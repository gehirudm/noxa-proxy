"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Wifi, Smartphone, Calendar, Activity, TrendingUp, Settings, RefreshCw, Zap } from "lucide-react"

export function ActiveSubscriptions() {
  const subscriptions = [
    {
      id: "sub_001",
      type: "Premium Residential",
      icon: Shield,
      status: "Active",
      statusColor: "bg-emerald-500",
      traffic: {
        used: "0 GB",
        total: "10 GB",
        percentage: 0,
      },
      expiresIn: "23 days",
      price: "$29.99/month",
      autoRenewal: true,
      lastUsed: "Never",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "sub_002",
      type: "Static Residential",
      icon: Wifi,
      status: "Active",
      statusColor: "bg-emerald-500",
      traffic: {
        used: "0 IPs",
        total: "5 IPs",
        percentage: 0,
      },
      expiresIn: "15 days",
      price: "$49.99/month",
      autoRenewal: false,
      lastUsed: "Never",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "sub_003",
      type: "Mobile Proxy",
      icon: Smartphone,
      status: "Active",
      statusColor: "bg-emerald-500",
      traffic: {
        used: "0 GB",
        total: "5 GB",
        percentage: 0,
      },
      expiresIn: "30 days",
      price: "$39.99/month",
      autoRenewal: true,
      lastUsed: "Never",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  const getStatusBadge = (status: string, color: string) => {
    return (
      <Badge className={`${color} text-white hover:${color}/80 shadow-sm`}>
        <div className="w-2 h-2 bg-white rounded-full mr-1.5"></div>
        {status}
      </Badge>
    )
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-gradient-to-r from-red-500 to-red-600"
    if (percentage >= 60) return "bg-gradient-to-r from-amber-500 to-orange-500"
    return "bg-gradient-to-r from-emerald-500 to-green-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Active Subscriptions</h2>
          <p className="text-muted-foreground mt-1">Manage your proxy services and monitor usage</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted/50 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage All
        </Button>
      </div>

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <Card
              key={sub.id}
              className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${sub.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <sub.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-lg font-semibold">{sub.type}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">{sub.price}</p>
                    </div>
                  </div>
                  {getStatusBadge(sub.status, sub.statusColor)}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Traffic/Usage Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Usage</span>
                    <span className="text-foreground font-semibold">
                      {sub.traffic.used} / {sub.traffic.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${getProgressColor(sub.traffic.percentage)} transition-all duration-500 ease-out`}
                      style={{ width: `${sub.traffic.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">{sub.traffic.percentage}% used</div>
                </div>

                {/* Subscription Details */}
                <div className="space-y-3 bg-muted/20 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Expires in</span>
                    </div>
                    <span className="text-foreground font-semibold">{sub.expiresIn}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Last used</span>
                    </div>
                    <span className="text-foreground font-semibold">{sub.lastUsed}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-purple-500" />
                      <span className="text-muted-foreground">Auto renewal</span>
                    </div>
                    <Badge
                      variant={sub.autoRenewal ? "secondary" : "outline"}
                      className={`text-xs ${sub.autoRenewal ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "border-muted-foreground/30"}`}
                    >
                      {sub.autoRenewal ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-16">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Active Subscriptions</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  You don't have any active proxy subscriptions yet. Get started with our premium services and unlock
                  powerful proxy capabilities.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md">
                  <Zap className="w-4 h-4 mr-2" />
                  Browse Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
