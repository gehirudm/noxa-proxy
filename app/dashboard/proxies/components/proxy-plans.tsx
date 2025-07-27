
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Loader2, X } from "lucide-react"
import { handleProxyPlanPurchase, handleWalletProxyPurchase } from "@/app/actions/payment-actions"
import { useToast } from "@/components/ui/use-toast"

// Define types
type PaymentProvider = "cryptomus" | "wallet"
type ProxyTier = "basic" | "pro" | "enterprise"

interface ProxyPlan {
    name: string
    price: number
    bandwidth: string
    isRecurring: boolean
}

interface ProxyPlansProps {
    proxyType: string
    plans: Record<string, ProxyPlan>
    benefits: Array<{
        name: string
        values: Record<string, boolean | string | number>
    }>
}

export function ProxyPlans({ proxyType, plans, benefits }: ProxyPlansProps) {
    const { toast } = useToast()
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<{ tier: ProxyTier; plan: ProxyPlan } | null>(null)
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("cryptomus")
    const [cryptoNetwork, setCryptoNetwork] = useState("ETH")
    const [cryptoCurrency, setCryptoCurrency] = useState("USDT")
    const [isLoading, setIsLoading] = useState(false)

    const formatPrice = (price: number) => {
        return `$${(price / 100).toFixed(2)}`
    }

    const handleSelectPlan = (tier: ProxyTier, plan: ProxyPlan) => {
        setSelectedPlan({ tier, plan })
        setPaymentDialogOpen(true)
    }

    const handlePayment = async () => {
        if (!selectedPlan) return

        setIsLoading(true)

        try {
            if (paymentProvider === "cryptomus") {
                const response = await handleProxyPlanPurchase({
                    proxyType: proxyType as any,
                    tier: selectedPlan.tier,
                    paymentProvider: "cryptomus",
                    cryptoNetwork,
                    cryptoCurrency
                })

                if (response.success && response.redirectUrl) {
                    window.location.href = response.redirectUrl
                } else {
                    toast({
                        title: "Payment Error",
                        description: response.error || "Failed to process payment",
                        variant: "destructive"
                    })
                }
            } else if (paymentProvider === "wallet") {
                // Implement wallet-based purchase
                const response = await handleWalletProxyPurchase({
                    proxyType: proxyType as any,
                    tier: selectedPlan.tier
                })

                if (response.success) {
                    toast({
                        title: "Payment Successful",
                        description: "Your purchase has been processed successfully.",
                        variant: "default"
                    })
                    setPaymentDialogOpen(false)
                    // You might want to refresh the page or update the UI here
                } else {
                    toast({
                        title: "Payment Error",
                        description: response.error || "Failed to process payment",
                        variant: "destructive"
                    })
                }
            }
        } catch (error) {
            toast({
                title: "Payment Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(plans).map(([tier, plan]) => (
                    <Card key={tier} className="bg-card border-border">
                        <CardHeader className="text-center">
                            <CardTitle className="text-foreground text-lg">{plan.name}</CardTitle>
                            <div className="flex items-baseline justify-center">
                                <span className="text-3xl font-bold text-foreground">{formatPrice(plan.price)}</span>
                                <span className="text-muted-foreground text-sm">
                                    {plan.isRecurring ? "/month" : ""}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleSelectPlan(tier as "basic" | "pro" | "enterprise", plan)}
                            >
                                {plan.isRecurring ? "Subscribe" : "Purchase"}
                            </Button>
                            <p className="text-center text-muted-foreground text-sm">
                                {plan.bandwidth} {plan.isRecurring ? "per month" : ""}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Benefits Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium"></th>
                                    {Object.entries(plans).map(([tier, plan]) => (
                                        <th key={tier} className="text-center py-3 px-4 text-muted-foreground font-medium">
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {benefits.map((benefit, benefitIndex) => (
                                    <tr key={benefitIndex} className="border-b border-border/50">
                                        <td className="py-3 px-4 text-foreground font-medium">{benefit.name}</td>
                                        {Object.keys(plans).map((tier) => (
                                            <td key={tier} className="py-3 px-4 text-center">
                                                {typeof benefit.values[tier as keyof typeof benefit.values] === "boolean" ? (
                                                    benefit.values[tier as keyof typeof benefit.values] ? (
                                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-red-500 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="text-foreground font-medium">
                                                        {benefit.values[tier as keyof typeof benefit.values]}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete Your Purchase</DialogTitle>
                        <DialogDescription>
                            {selectedPlan?.plan.name} - {formatPrice(selectedPlan?.plan.price || 0)}
                            {selectedPlan?.plan.isRecurring ? "/month" : ""}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Tabs defaultValue="cryptomus" onValueChange={(value) => setPaymentProvider(value as PaymentProvider)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="cryptomus">Cryptocurrency</TabsTrigger>
                                <TabsTrigger value="wallet">Wallet Balance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="cryptomus" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Cryptocurrency Network</label>
                                    <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select network" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TRX">Tron (TRX)</SelectItem>
                                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                            <SelectItem value="BSC">Binance Smart Chain (BSC)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Cryptocurrency</label>
                                    <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USDT">Tether (USDT)</SelectItem>
                                            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    You'll be redirected to Cryptomus to complete your payment securely.
                                </p>
                            </TabsContent>

                            <TabsContent value="wallet" className="space-y-4 mt-4">
                                <p className="text-sm">
                                    Pay using your account wallet balance. Make sure you have sufficient funds.
                                </p>

                                <div className="bg-blue-950/50 p-4 rounded-md">
                                    <div className="flex justify-between mb-2">
                                        <span>Required amount:</span>
                                        <span className="font-medium">{formatPrice(selectedPlan?.plan.price || 0)}</span>
                                    </div>
                                    {/* You could add wallet balance check here */}
                                    {/* <div className="flex justify-between">
                                        <span>Your balance:</span>
                                        <span className="font-medium">${walletBalance.toFixed(2)}</span>
                                    </div> */}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                paymentProvider === "cryptomus" ? "Pay with Crypto" : "Pay from Wallet"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}