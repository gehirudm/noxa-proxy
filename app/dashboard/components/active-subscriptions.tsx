"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Wifi, Smartphone, Calendar, Activity, TrendingUp, Settings, RefreshCw, Zap, Server } from "lucide-react"
import { getUserSubscriptions } from "@/app/actions/user-actions"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Define the subscription data type based on the server action return type
type SubscriptionData = {
  type: string;
  displayName: string;
  planName: string;
  isRecurring: boolean;
  totalBandwidth: string;
  status: 'active' | 'expired' | 'expiring-soon' | 'suspended';
  expiresAt: Date | null;
  lastPaymentDate: Date | null;
  availableBalance: number;
  usedBandwidth: string;
  usagePercentage: number;
  daysRemaining?: number;
}

// Map proxy types to their icons and gradients
const proxyTypeConfig = {
  'residential': {
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500"
  },
  'datacenter': {
    icon: Server,
    gradient: "from-green-500 to-teal-500"
  },
  'mobile': {
    icon: Smartphone,
    gradient: "from-orange-500 to-red-500"
  },
  'static_residential': {
    icon: Wifi,
    gradient: "from-purple-500 to-indigo-500"
  }
}

export function ActiveSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true)
        const response = await getUserSubscriptions()
        
        if (response.success && response.data) {
          setSubscriptions(response.data)
        } else {
          toast({
            title: "Error fetching subscriptions",
            description: response.error || "Failed to load your subscriptions",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading subscriptions",
          variant: "destructive"
        })
        console.error("Failed to fetch subscriptions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [toast])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: "bg-emerald-500", label: "Active" },
      'expired': { color: "bg-red-500", label: "Expired" },
      'expiring-soon': { color: "bg-amber-500", label: "Expiring Soon" },
      'suspended': { color: "bg-gray-500", label: "Suspended" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    
    return (
      <Badge className={`${config.color} text-white hover:${config.color}/80 shadow-sm`}>
        <div className="w-2 h-2 bg-white rounded-full mr-1.5"></div>
        {config.label}
      </Badge>
    )
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-gradient-to-r from-red-500 to-red-600"
    if (percentage >= 60) return "bg-gradient-to-r from-amber-500 to-orange-500"
    return "bg-gradient-to-r from-emerald-500 to-green-500"
  }

  const handleUpgrade = (proxyType: string) => {
    router.push(`/proxies/${proxyType}?show=plans`)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  const getLastUsed = (lastPaymentDate: Date | null) => {
    if (!lastPaymentDate) return "Never"
    return formatDate(lastPaymentDate)
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
          onClick={() => router.push('/proxies')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage All
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {subscriptions.map((sub, index) => {
            const typeConfig = proxyTypeConfig[sub.type as keyof typeof proxyTypeConfig] || {
              icon: Shield,
              gradient: "from-gray-500 to-slate-500"
            }
            
            return (
              <Card
                key={`${sub.type}-${index}`}
                className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${typeConfig.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <typeConfig.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-lg font-semibold">{sub.displayName}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{sub.planName}</p>
                      </div>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Traffic/Usage Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Usage</span>
                      <span className="text-foreground font-semibold">
                        {sub.usedBandwidth} / {sub.totalBandwidth}
                      </span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${getProgressColor(sub.usagePercentage)} transition-all duration-500 ease-out`}
                        style={{ width: `${sub.usagePercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">{sub.usagePercentage}% used</div>
                  </div>

                  {/* Subscription Details */}
                  <div className="space-y-3 bg-muted/20 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Expires in</span>
                      </div>
                      <span className="text-foreground font-semibold">
                        {sub.daysRemaining ? `${sub.daysRemaining} days` : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Last used</span>
                      </div>
                      <span className="text-foreground font-semibold">{getLastUsed(sub.lastPaymentDate)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 text-purple-500" />
                        <span className="text-muted-foreground">Auto renewal</span>
                      </div>
                      <Badge
                        variant={sub.isRecurring ? "secondary" : "outline"}
                        className={`text-xs ${sub.isRecurring ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "border-muted-foreground/30"}`}
                      >
                        {sub.isRecurring ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md transition-all duration-300"
                      onClick={() => handleUpgrade(sub.type)}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Upgrade
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/proxies/${sub.type}`)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You don't have any active proxy subscriptions yet. Get started with our premium services and unlock
                  powerful proxy capabilities.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
                  onClick={() => router.push('/proxies?show=plans')}
                >
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