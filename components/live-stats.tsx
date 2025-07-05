"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, ShoppingCart, BarChart3, Globe } from "lucide-react"

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  baseValue: number
  currentValue: number
  increment: number
  color: string
  bgGradient: string
}

export function LiveStats() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      icon: Users,
      label: "Customers",
      baseValue: 1247,
      currentValue: 1247,
      increment: 0.3,
      color: "text-green-500",
      bgGradient: "from-green-400 to-green-500",
    },
    {
      icon: ShoppingCart,
      label: "Services Sold",
      baseValue: 892,
      currentValue: 892,
      increment: 0.5,
      color: "text-yellow-500",
      bgGradient: "from-yellow-400 to-yellow-500",
    },
    {
      icon: BarChart3,
      label: "GB Processed",
      baseValue: 15420,
      currentValue: 15420,
      increment: 2.1,
      color: "text-red-500",
      bgGradient: "from-red-400 to-red-500",
    },
    {
      icon: Globe,
      label: "Locations",
      baseValue: 45,
      currentValue: 45,
      increment: 0.02,
      color: "text-orange-500",
      bgGradient: "from-orange-400 to-orange-500",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          currentValue: stat.currentValue + stat.increment,
        })),
      )
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, label: string) => {
    if (label === "GB Processed") {
      return Math.floor(value).toLocaleString()
    }
    if (label === "Locations") {
      return `${Math.floor(value)}+`
    }
    return Math.floor(value).toLocaleString()
  }

  return (
    <div className="mt-20 glass-effect rounded-3xl shadow-xl p-8 relative overflow-hidden border border-orange-200/30 dark:border-orange-500/30">
      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flame-flicker"></div>
        <span className="text-xs text-muted-foreground font-medium">LIVE</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient} shadow-lg transition-transform group-hover:scale-110 duration-300 flame-flicker`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
              <div
                className={`text-3xl font-bold text-foreground transition-all duration-500 ${
                  Math.floor(stat.currentValue) !== Math.floor(stat.currentValue - stat.increment)
                    ? "scale-105 flame-text"
                    : ""
                }`}
              >
                {formatValue(stat.currentValue, stat.label)}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>

              {/* Growth indicator */}
              <div className="mt-1 flex items-center justify-center">
                <div className={`flex items-center space-x-1 text-xs ${stat.color}`}>
                  <div className={`w-1 h-1 ${stat.color.replace("text-", "bg-")} rounded-full animate-pulse`}></div>
                  <span>+{stat.increment}/min</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Background flame animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 via-yellow-500/5 to-green-500/5 animate-pulse pointer-events-none"></div>
    </div>
  )
}
