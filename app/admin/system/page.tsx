"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  Mail,
} from "lucide-react"

export default function AdminOverview() {
    // Mock data
    const stats = {
        totalUsers: 1247,
        activeProxies: 156,
        dailyBandwidth: "2.4 TB",
        monthlyRevenue: "$45,230",
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">API Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="api-limit" className="text-gray-300">
                            API Rate Limit (requests/hour)
                        </Label>
                        <Input id="api-limit" defaultValue="1000" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                        <Label htmlFor="concurrent" className="text-gray-300">
                            Max Concurrent Connections
                        </Label>
                        <Input id="concurrent" defaultValue="50" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Email Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="welcome-email" className="text-gray-300">
                            Welcome Email
                        </Label>
                        <Textarea
                            id="welcome-email"
                            defaultValue="Welcome to IgnitexProxy! Your account has been created successfully."
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="h-4 w-4 mr-2" />
                        Update Templates
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Maintenance Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Enable Maintenance Mode</span>
                        <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                            Disabled
                        </Button>
                    </div>
                    <div>
                        <Label htmlFor="maintenance-message" className="text-gray-300">
                            Maintenance Message
                        </Label>
                        <Textarea
                            id="maintenance-message"
                            defaultValue="We're currently performing scheduled maintenance. Please check back soon."
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Payment Providers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Stripe</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">CoinPayments</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">PayPal</span>
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Configure Providers
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}