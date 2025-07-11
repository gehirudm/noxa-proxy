import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PROXY_PLANS, ProxyPlan } from "@/lib/proxy-plans";
import { handleProxyPlanPurchase, PaymentProvider } from "@/app/actions/payment-actions";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProxyPlansProps {
    proxyType: keyof typeof PROXY_PLANS;
}

export function ProxyPlans({ proxyType }: ProxyPlansProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{
        tier: "basic" | "pro" | "enterprise";
        plan: ProxyPlan;
    } | null>(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("stripe");
    const [cryptoNetwork, setCryptoNetwork] = useState("ETH");

    const plans = PROXY_PLANS[proxyType];
    
    // Format price from cents to dollars
    const formatPrice = (price: number) => {
        return `$${(price / 100).toFixed(2)}`;
    };

    const handleSelectPlan = (tier: "basic" | "pro" | "enterprise", plan: ProxyPlan) => {
        setSelectedPlan({ tier, plan });
        setPaymentDialogOpen(true);
    };

    const handlePayment = async () => {
        if (!selectedPlan) return;
        
        setIsLoading(true);
        
        try {
            const response = await handleProxyPlanPurchase({
                proxyType,
                tier: selectedPlan.tier,
                paymentProvider,
                cryptoNetwork: paymentProvider === "cryptomus" ? cryptoNetwork : undefined
            });
            
            if (response.success && response.redirectUrl) {
                // Redirect to payment page
                window.location.href = response.redirectUrl;
            } else {
                toast({
                    title: "Payment Error",
                    description: response.error || "Failed to process payment",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Payment Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Define common benefits for all plans
    const benefits = [
        {
            name: "Bandwidth",
            values: {
                basic: plans.basic.bandwidth,
                pro: plans.pro.bandwidth,
                enterprise: plans.enterprise.bandwidth
            }
        },
        {
            name: "Concurrent Sessions",
            values: { basic: true, pro: true, enterprise: true }
        },
        {
            name: "City-level targeting",
            values: { basic: true, pro: true, enterprise: true }
        },
        {
            name: "24/7 Support",
            values: { basic: true, pro: true, enterprise: true }
        },
        {
            name: "Dedicated Account Manager",
            values: { basic: false, pro: true, enterprise: true }
        },
        {
            name: "Priority Routing",
            values: { basic: false, pro: false, enterprise: true }
        }
    ];

    return (
        <div>
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentProvider(value as PaymentProvider)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="stripe">Credit Card</TabsTrigger>
                                <TabsTrigger value="cryptomus">Cryptocurrency</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="stripe" className="space-y-4 mt-4">
                                <p className="text-sm text-muted-foreground">
                                    You'll be redirected to Stripe to complete your payment securely.
                                </p>
                            </TabsContent>
                            
                            <TabsContent value="cryptomus" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Cryptocurrency Network</label>
                                    <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select network" />
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
                                <p className="text-sm text-muted-foreground">
                                    You'll be redirected to complete your payment using cryptocurrency.
                                </p>
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
                            {isLoading ? "Processing..." : "Proceed to Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}