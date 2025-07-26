"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, RotateCcw } from "lucide-react"

export type TransactionFilterValues = {
  dateRange: string
  status: string
  transactionType: string
  proxyType: string
}

interface TransactionFiltersProps {
  onApplyFilters: (filters: TransactionFilterValues) => void
  onClearFilters: () => void
  initialFilters?: Partial<TransactionFilterValues>
  isLoading?: boolean
}

export function TransactionFilters({
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  isLoading = false
}: TransactionFiltersProps) {
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || "")
  const [status, setStatus] = useState(initialFilters.status || "")
  const [transactionType, setTransactionType] = useState(initialFilters.transactionType || "")
  const [proxyType, setProxyType] = useState(initialFilters.proxyType || "")

  const handleApplyFilters = () => {
    onApplyFilters({
      dateRange,
      status,
      transactionType,
      proxyType
    })
  }

  const handleClearFilters = () => {
    setDateRange("")
    setStatus("")
    setTransactionType("")
    setProxyType("")
    onClearFilters()
  }

  return (
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
          <Select value={dateRange} onValueChange={setDateRange}>
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
          <Select value={status} onValueChange={setStatus}>
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
          <Select value={transactionType} onValueChange={setTransactionType}>
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
          <Select value={proxyType} onValueChange={setProxyType}>
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
          <Button
            className="w-full bg-muted hover:bg-muted/80 text-foreground"
            variant="secondary"
            onClick={handleApplyFilters}
          >
            Apply filters
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            size="sm"
            onClick={handleClearFilters}
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Clear all
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}