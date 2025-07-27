"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase/firebase"
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SpendingChartProps {
  initialTimeRange?: string
}

interface SpendingDataPoint {
  date: string
  amount: number
  formattedDate: string
}

export function SpendingChart({ initialTimeRange = "1D" }: SpendingChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState(initialTimeRange)
  const [isLoading, setIsLoading] = useState(true)
  const [spendingData, setSpendingData] = useState<SpendingDataPoint[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()
  
  const timeRanges = ["1D", "7D", "1M"]

  useEffect(() => {
    if (user) {
      fetchSpendingData(activeTimeRange)
    }
  }, [user, activeTimeRange])

  const fetchSpendingData = async (timeRange: string) => {
    if (!user) return

    try {
      setIsLoading(true)
      
      const now = new Date()
      let startDate: Date
      
      // Determine start date based on time range
      switch (timeRange) {
        case "1D":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 1)
          break
        case "7D":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          break
        case "1M":
          startDate = new Date(now)
          startDate.setMonth(now.getMonth() - 1)
          break
        default:
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 1)
      }
      
      // Query transactions with paid status within the date range
      const transactionsQuery = query(
        collection(db, "users", user.uid, "transactions"),
        where("type", "==", "purchase"),
        where("metadata.rawData.status", "==", "paid"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(now)),
        orderBy("createdAt", "asc")
      )
      
      const querySnapshot = await getDocs(transactionsQuery)
      
      // Process transactions into spending data points
      const data: Record<string, SpendingDataPoint> = {}
      let total = 0
      
      querySnapshot.forEach(doc => {
        const transaction = doc.data()
        console.log("Transaction Data:", transaction)
        const date = transaction.createdAt.toDate()
        const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
        
        // Format date for display based on time range
        let formattedDate
        if (timeRange === "1D") {
          formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else {
          formattedDate = date.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
        }
        
        // Aggregate spending by date
        if (data[dateKey]) {
          data[dateKey].amount += transaction.amount
        } else {
          data[dateKey] = {
            date: dateKey,
            amount: transaction.amount,
            formattedDate
          }
        }
        
        total += transaction.amount
      })
      
      // Convert to array and ensure we have data points for all dates in range
      const dataPoints = Object.values(data)
      
      // If no data, create empty data points for visualization
      if (dataPoints.length === 0) {
        const emptyDataPoints = generateEmptyDataPoints(startDate, now, timeRange)
        setSpendingData(emptyDataPoints)
      } else {
        setSpendingData(dataPoints)
      }
      
      setTotalSpent(total)
    } catch (error) {
      console.error("Error fetching spending data:", error)
      toast({
        title: "Error",
        description: "Failed to load spending data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Generate empty data points for visualization when no data is available
  const generateEmptyDataPoints = (startDate: Date, endDate: Date, timeRange: string): SpendingDataPoint[] => {
    const dataPoints: SpendingDataPoint[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      let formattedDate
      if (timeRange === "1D") {
        formattedDate = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        formattedDate = currentDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
      }
      
      dataPoints.push({
        date: currentDate.toISOString().split('T')[0],
        amount: 0,
        formattedDate
      })
      
      // Increment based on time range
      if (timeRange === "1D") {
        currentDate.setHours(currentDate.getHours() + 4) // 4-hour intervals for 1D
      } else if (timeRange === "7D") {
        currentDate.setDate(currentDate.getDate() + 1) // Daily for 7D
      } else {
        currentDate.setDate(currentDate.getDate() + 3) // 3-day intervals for 1M
      }
    }
    
    return dataPoints
  }
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  // Get date labels for the x-axis based on time range
  const getDateLabels = () => {
    if (spendingData.length === 0) {
      // Default labels if no data
      if (activeTimeRange === "1D") {
        return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"]
      } else if (activeTimeRange === "7D") {
        const today = new Date()
        const labels = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          labels.push(date.toLocaleDateString([], { month: '2-digit', day: '2-digit' }))
        }
        return labels
      } else {
        const today = new Date()
        const labels = []
        for (let i = 30; i >= 0; i -= 5) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          labels.push(date.toLocaleDateString([], { month: '2-digit', day: '2-digit' }))
        }
        return labels
      }
    }
    
    // Use actual data points for labels if available
    return spendingData.map(point => point.formattedDate)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground text-sm font-medium">Total Spent</CardTitle>
          <div className="text-2xl font-bold text-foreground mt-2">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
            ) : (
              formatCurrency(totalSpent)
            )}
          </div>
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
        {isLoading ? (
          <div className="h-32 bg-muted/50 animate-pulse rounded"></div>
        ) : spendingData.some(point => point.amount > 0) ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={spendingData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Spent']}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#f9fafb'
                  }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ec4899" 
                  fillOpacity={1} 
                  fill="url(#colorSpending)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 bg-muted rounded flex items-end justify-center">
            <div className="text-muted-foreground text-sm">No spending data available</div>
          </div>
        )}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {getDateLabels().map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}