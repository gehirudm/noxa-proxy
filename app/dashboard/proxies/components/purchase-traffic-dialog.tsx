"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { handleProxyPlanPurchase, handleWalletProxyPurchase } from "@/app/actions/payment-actions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PurchaseTrafficDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    proxyType: string
    proxyDisplayName?: string
}

type PaymentProvider = "cryptomus" | "wallet"

export function PurchaseTrafficDialog({
    open,
    onOpenChange,
    proxyType,
    proxyDisplayName
}: PurchaseTrafficDialogProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [quantity, setQuantity] = useState("")
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("cryptomus")
    const [cryptoNetwork, setCryptoNetwork] = useState("TRX")

    // Calculate estimated price (this is just an example, replace with actual pricing logic)
    const pricePerGB = 2.75 // $2.75 per GB
    const estimatedPrice = quantity ? parseFloat(quantity) * pricePerGB : 0

    const handleNext = () => {
        if (currentStep === 1) {
            // Validate quantity
            if (!quantity || parseFloat(quantity) <= 0) {
                toast({
                    title: "Invalid quantity",
                    description: "Please enter a valid amount of bandwidth",
                    variant: "destructive"
                })
                return
            }
        }

        setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        if (!quantity || parseFloat(quantity) <= 0) return

        setIsLoading(true)

        try {
            if (paymentProvider === "cryptomus") {
                const response = await handleProxyPlanPurchase({
                    proxyType: proxyType as any,
                    tier: "custom",
                    paymentProvider: "cryptomus",
                    customQuantity: parseFloat(quantity)
                })

                if (response.success && response.redirectUrl) {
                    // Redirect to payment page
                    window.location.href = response.redirectUrl
                } else {
                    toast({
                        title: "Payment Error",
                        description: response.error || "Failed to process payment",
                        variant: "destructive"
                    })
                }
            } else if (paymentProvider === "wallet") {
                // Implement wallet-based purchase similar to ProxyPlans component
                const response = await handleWalletProxyPurchase({
                    proxyType: proxyType as any,
                    tier: "custom",
                    customQuantity: parseFloat(quantity)
                })

                if (response.success) {
                    toast({
                        title: "Payment Successful",
                        description: "Your purchase has been processed successfully.",
                        variant: "default"
                    })
                    onOpenChange(false) // Close the dialog on success
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

    const resetDialog = () => {
        setCurrentStep(1)
        setQuantity("")
    }

    const handleDialogChange = (open: boolean) => {
        if (!open) {
            resetDialog()
        }
        onOpenChange(open)
    }

    const displayName = proxyDisplayName ||
        proxyType.charAt(0).toUpperCase() + proxyType.slice(1).replace(/_/g, ' ') + " Bandwidth"

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{displayName}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-300"
                                }`}>
                                1
                            </div>
                            <span className={`text-sm mt-2 ${currentStep === 1 ? "text-blue-400" : "text-muted-foreground"
                                }`}>
                                Choose your plan
                            </span>
                        </div>

                        <div className="h-0.5 flex-1 bg-blue-900/50 mx-2" />

                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-300"
                                }`}>
                                2
                            </div>
                            <span className={`text-sm mt-2 ${currentStep === 2 ? "text-blue-400" : "text-muted-foreground"
                                }`}>
                                Payment method
                            </span>
                        </div>

                        <div className="h-0.5 flex-1 bg-blue-900/50 mx-2" />

                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 3 ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-300"
                                }`}>
                                3
                            </div>
                            <span className={`text-sm mt-2 ${currentStep === 3 ? "text-blue-400" : "text-muted-foreground"
                                }`}>
                                Payment detail
                            </span>
                        </div>
                    </div>

                    {/* Step 1: Choose Plan */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="quantity" className="text-sm font-medium">
                                    Quantity (GB)
                                </label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter amount in GB"
                                    className="bg-blue-950/50"
                                />
                            </div>

                            {quantity && parseFloat(quantity) > 0 && (
                                <div className="text-sm">
                                    <p>Estimated price: <span className="font-bold">${estimatedPrice.toFixed(2)}</span></p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Payment Method */}
                    {currentStep === 2 && (
                        <Tabs defaultValue="cryptomus" onValueChange={(value) => setPaymentProvider(value as PaymentProvider)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="cryptomus">Cryptocurrency</TabsTrigger>
                                <TabsTrigger value="wallet">Wallet Balance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="cryptomus" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Cryptocurrency</label>
                                    <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select network" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TRX">Tron (TRX)</SelectItem>
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
                                        <span className="font-medium">${estimatedPrice.toFixed(2)}</span>
                                    </div>
                                    {/* You could add wallet balance check here */}
                                    {/* <div className="flex justify-between">
                    <span>Your balance:</span>
                    <span className="font-medium">${walletBalance.toFixed(2)}</span>
                  </div> */}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    {/* Step 3: Payment Detail */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="bg-blue-950/50 p-4 rounded-md">
                                <h3 className="font-medium mb-2">Order Summary</h3>
                                <div className="flex justify-between mb-2">
                                    <span>Proxy Type:</span>
                                    <span>{displayName}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Quantity:</span>
                                    <span>{quantity} GB</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Payment Method:</span>
                                    <span>{paymentProvider === "cryptomus" ? "Cryptocurrency" : "Wallet Balance"}</span>
                                </div>
                                {paymentProvider === "cryptomus" && (
                                    <div className="flex justify-between mb-2">
                                        <span>Crypto:</span>
                                        <span>{cryptoNetwork}</span>
                                    </div>
                                )}
                                <div className="border-t border-blue-800 mt-2 pt-2 flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>${estimatedPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                By proceeding, you agree to our terms of service and privacy policy.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {currentStep > 1 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="w-full sm:w-auto"
                        >
                            Back
                        </Button>
                    )}

                    {currentStep < 3 ? (
                        <Button
                            onClick={handleNext}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
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
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => handleDialogChange(false)}
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}