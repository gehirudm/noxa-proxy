"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { testProxyPlanPurchase, testWalletDeposit } from "@/app/actions/payment-actions";
import { useToast } from "@/components/ui/use-toast";
import { PROXY_PLANS } from "@/lib/proxy-plans";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/firebase";
import { collectionGroup, getDocs, limit, query, where } from "firebase/firestore";

export default function TestWebhookPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("proxy");

    // Proxy plan purchase state
    const [proxyType, setProxyType] = useState<keyof typeof PROXY_PLANS>("residential");
    const [tier, setTier] = useState<"basic" | "pro" | "enterprise">("basic");

    // Wallet deposit state
    const [depositAmount, setDepositAmount] = useState("10");

    // Common state
    const [cryptoNetwork, setCryptoNetwork] = useState("TRX");
    const [cryptoCurrency, setCryptoCurrency] = useState("USDT");
    const [result, setResult] = useState<string | null>(null);

    const handleTestProxyWebhook = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await testProxyPlanPurchase({
                proxyType,
                tier,
                cryptoNetwork,
                cryptoCurrency
            });

            if (response.success) {
                toast({
                    title: "Test webhook sent successfully",
                    description: `Order ID: ${response.orderId}`,
                    variant: "default"
                });
                setResult(JSON.stringify(response, null, 2));
            } else {
                toast({
                    title: "Test webhook failed",
                    description: response.error || "Unknown error",
                    variant: "destructive"
                });
                setResult(JSON.stringify(response, null, 2));
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive"
            });
            setResult(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestWalletWebhook = async () => {
        setIsLoading(true);
        setResult(null);

        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid deposit amount",
                variant: "destructive"
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await testWalletDeposit({
                amount,
                cryptoNetwork,
                cryptoCurrency
            });

            if (response.success) {
                toast({
                    title: "Test wallet deposit webhook sent successfully",
                    description: `Order ID: ${response.orderId}`,
                    variant: "default"
                });
                setResult(JSON.stringify(response, null, 2));
            } else {
                toast({
                    title: "Test webhook failed",
                    description: response.error || "Unknown error",
                    variant: "destructive"
                });
                setResult(JSON.stringify(response, null, 2));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive"
            });
            setResult(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-10">
            <h1 className="text-2xl font-bold mb-6">Test Payment Webhook</h1>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Test Cryptomus Webhook</CardTitle>
                    <CardDescription>
                        This will simulate a successful payment webhook from Cryptomus
                    </CardDescription>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="proxy">Proxy Purchase</TabsTrigger>
                        <TabsTrigger value="wallet">Wallet Deposit</TabsTrigger>
                    </TabsList>

                    <TabsContent value="proxy" className="space-y-4">
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Proxy Type</label>
                                <Select value={proxyType} onValueChange={(value) => setProxyType(value as keyof typeof PROXY_PLANS)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select proxy type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential</SelectItem>
                                        <SelectItem value="datacenter">Datacenter</SelectItem>
                                        <SelectItem value="mobile">Mobile</SelectItem>
                                        <SelectItem value="static_residential">Static Residential</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Plan Tier</label>
                                <Select value={tier} onValueChange={(value) => setTier(value as "basic" | "pro" | "enterprise")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select plan tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="pro">Pro</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Crypto Network</label>
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
                                <label className="text-sm font-medium">Crypto Currency</label>
                                <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {result && (
                                <div className="mt-4 p-4 bg-muted rounded-md">
                                    <h3 className="text-sm font-medium mb-2">Result:</h3>
                                    <pre className="text-xs overflow-auto max-h-40">{result}</pre>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Button
                                onClick={handleTestProxyWebhook}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Test Webhook...
                                    </>
                                ) : (
                                    "Test Proxy Purchase"
                                )}
                            </Button>
                        </CardFooter>
                    </TabsContent>

                    <TabsContent value="wallet" className="space-y-4">
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deposit Amount ($)</label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Enter deposit amount"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Crypto Network</label>
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
                                <label className="text-sm font-medium">Crypto Currency</label>
                                <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {result && (
                                <div className="mt-4 p-4 bg-muted rounded-md">
                                    <h3 className="text-sm font-medium mb-2">Result:</h3>
                                    <pre className="text-xs overflow-auto max-h-40">{result}</pre>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Button
                                onClick={handleTestWalletWebhook}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Test Webhook...
                                    </>
                                ) : (
                                    "Test Wallet Deposit"
                                )}
                            </Button>
                        </CardFooter>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}