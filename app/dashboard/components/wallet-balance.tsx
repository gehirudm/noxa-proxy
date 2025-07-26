"use client"

import { useEffect, useState } from "react"
import { CreditCard, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function WalletBalanceDisplay() {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchWalletBalance = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const walletBalance = userData.walletBalance || 0
        setBalance(walletBalance)
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your wallet balance.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch balance on component mount
  useEffect(() => {
    fetchWalletBalance()
  }, [user])

  return (
    <Link href="/dashboard/billing" className="group">
      <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-all">
        {isLoading ? (
          <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4 text-emerald-600" />
        )}
        <span className="font-semibold text-emerald-700 dark:text-emerald-300">
          ${isLoading ? "..." : balance.toFixed(2)}
        </span>
      </div>
    </Link>
  )
}