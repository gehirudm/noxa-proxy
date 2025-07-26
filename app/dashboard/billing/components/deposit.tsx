"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleWalletDeposit } from "@/app/actions/payment-actions"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"

interface WalletBalanceCardProps {
  balance?: number
  onBalanceUpdate?: () => void
}

export function WalletBalanceCard({ balance: initialBalance, onBalanceUpdate }: WalletBalanceCardProps) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "cryptomus">("stripe")
  const [cryptoNetwork, setCryptoNetwork] = useState("ETH")
  const [balance, setBalance] = useState(initialBalance || 0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

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
        
        // Call the parent's onBalanceUpdate if provided
        if (onBalanceUpdate) {
          onBalanceUpdate()
        }
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your wallet balance. Please try again.",
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

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    try {
      setIsProcessing(true)
      
      const amount = parseFloat(depositAmount)
      
      // Call the server action to handle the deposit
      const response = await handleWalletDeposit({
        amount,
        paymentProvider,
        cryptoNetwork: paymentProvider === "cryptomus" ? cryptoNetwork : undefined
      })
      
      if (response.success) {
        // Redirect to payment provider if URL is provided
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl
          return
        }
        
        // Otherwise, close dialog and show success message
        setIsDepositDialogOpen(false)
        setDepositAmount("")
        
        // Show success toast
        toast({
          title: "Deposit initiated",
          description: `Your deposit of $${amount.toFixed(2)} is being processed.`,
          variant: "default",
        })
        
        // Refresh balance
        fetchWalletBalance()
      } else {
        // Show error toast
        toast({
          title: "Deposit failed",
          description: response.error || "An error occurred while processing your deposit.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Deposit failed:", error)
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your deposit.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-foreground text-sm font-medium">Wallet balance</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWalletBalance}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh balance</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              <span className="text-2xl font-bold text-foreground">
                ${isLoading ? "..." : balance.toFixed(2)}
              </span>
            </div>
          </div>
          <Button 
            className="w-full bg-muted hover:bg-muted/80 text-foreground" 
            variant="secondary"
            onClick={() => setIsDepositDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Add funds to your wallet</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the amount you want to deposit to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  className="pl-7 bg-background border-border text-foreground"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-method" className="text-right">
                Payment Method
              </Label>
              <div className="col-span-3">
                <Select 
                  value={paymentProvider} 
                  onValueChange={(value) => setPaymentProvider(value as "stripe" | "cryptomus")}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Credit Card (Stripe)</SelectItem>
                    <SelectItem value="cryptomus">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {paymentProvider === "cryptomus" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="crypto-network" className="text-right">
                  Network
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={cryptoNetwork} 
                    onValueChange={setCryptoNetwork}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select crypto network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                      <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDepositDialogOpen(false)}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit} 
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isProcessing}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              {isProcessing ? "Processing..." : "Deposit Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}