"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Settings,
  CreditCard,
  Shield,
  Plus,
  Edit,
  Trash2,
  Ban,
  DollarSign,
  Activity,
  Server,
  Mail,
  LogOut,
  MessageCircle,
  Send,
  ExternalLink,
} from "lucide-react"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeProxies: 156,
    dailyBandwidth: "2.4 TB",
    monthlyRevenue: "$45,230",
  }

  const users = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      plan: "Premium",
      status: "Active",
      balance: "45.2 GB",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      plan: "Basic",
      status: "Active",
      balance: "12.8 GB",
      joinDate: "2024-01-10",
    },
    {
      id: 3,
      username: "mike_wilson",
      email: "mike@example.com",
      plan: "Enterprise",
      status: "Banned",
      balance: "0 GB",
      joinDate: "2023-12-20",
    },
  ]

  const proxies = [
    {
      id: 1,
      ip: "192.168.1.100",
      port: "8080",
      country: "🇺🇸 United States",
      protocol: "HTTP",
      status: "Active",
      tags: ["premium"],
    },
    {
      id: 2,
      ip: "10.0.0.50",
      port: "8081",
      country: "🇬🇧 United Kingdom",
      protocol: "HTTPS",
      status: "Active",
      tags: ["basic", "premium"],
    },
    {
      id: 3,
      ip: "172.16.0.25",
      port: "8082",
      country: "🇩🇪 Germany",
      protocol: "SOCKS5",
      status: "Maintenance",
      tags: ["premium"],
    },
  ]

  const payments = [
    {
      id: 1,
      user: "john_doe",
      amount: "$29.99",
      plan: "Premium",
      date: "2024-01-20",
      status: "Completed",
    },
    {
      id: 2,
      user: "jane_smith",
      amount: "$9.99",
      plan: "Basic",
      date: "2024-01-19",
      status: "Completed",
    },
    {
      id: 3,
      user: "alex_brown",
      amount: "$99.99",
      plan: "Enterprise",
      date: "2024-01-18",
      status: "Pending",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">IgnitexProxy Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Administrator
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              Users
            </TabsTrigger>
            <TabsTrigger value="proxies" className="data-[state=active]:bg-slate-700">
              Proxies
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-slate-700">
              Payments
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-sm bg-green-500/20 text-green-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Server className="h-4 w-4 mr-2" />
                    Active Proxies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stats.activeProxies}</p>
                  <p className="text-sm text-blue-400">98.5% uptime</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Daily Bandwidth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stats.dailyBandwidth}</p>
                  <p className="text-sm text-yellow-400">Peak: 3.2 TB</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stats.monthlyRevenue}</p>
                  <p className="text-sm bg-green-500/20 text-green-400">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Country-based Connections Chart */}
            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Country-based Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">🇺🇸 United States</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <span className="text-white text-sm">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">🇬🇧 United Kingdom</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-white text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">🇩🇪 Germany</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="text-white text-sm">30%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage user accounts and subscriptions</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New User</DialogTitle>
                        <DialogDescription className="text-gray-400">Create a new user account</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username" className="text-gray-300">
                            Username
                          </Label>
                          <Input id="username" className="bg-slate-700 border-slate-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300">
                            Email
                          </Label>
                          <Input id="email" type="email" className="bg-slate-700 border-slate-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="plan" className="text-gray-300">
                            Plan
                          </Label>
                          <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                            <option>Basic</option>
                            <option>Premium</option>
                            <option>Enterprise</option>
                          </select>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Create User</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Plan</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Balance</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell className="text-white">{user.username}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === "Active" ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Banned</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-white">{user.balance}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                              <Ban className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proxy Management */}
          <TabsContent value="proxies">
            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Proxy Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage proxy servers and configurations</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Proxy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New Proxy</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Add a new proxy server to the pool
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ip" className="text-gray-300">
                              IP Address
                            </Label>
                            <Input id="ip" className="bg-slate-700 border-slate-600 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="port" className="text-gray-300">
                              Port
                            </Label>
                            <Input id="port" className="bg-slate-700 border-slate-600 text-white" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-gray-300">
                            Country
                          </Label>
                          <Input id="country" className="bg-slate-700 border-slate-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="protocol" className="text-gray-300">
                            Protocol
                          </Label>
                          <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                            <option>HTTP</option>
                            <option>HTTPS</option>
                            <option>SOCKS5</option>
                          </select>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Add Proxy</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">IP</TableHead>
                      <TableHead className="text-gray-300">Port</TableHead>
                      <TableHead className="text-gray-300">Country</TableHead>
                      <TableHead className="text-gray-300">Protocol</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Tags</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proxies.map((proxy) => (
                      <TableRow key={proxy.id} className="border-slate-700">
                        <TableCell className="text-white font-mono">{proxy.ip}</TableCell>
                        <TableCell className="text-white">{proxy.port}</TableCell>
                        <TableCell className="text-white">{proxy.country}</TableCell>
                        <TableCell className="text-white">{proxy.protocol}</TableCell>
                        <TableCell>
                          {proxy.status === "Active" ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {proxy.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Management */}
          <TabsContent value="payments">
            <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Payment Management</CardTitle>
                <CardDescription className="text-gray-400">Monitor payments and handle refunds</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Plan</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="border-slate-700">
                        <TableCell className="text-white">{payment.user}</TableCell>
                        <TableCell className="text-white">{payment.amount}</TableCell>
                        <TableCell className="text-white">{payment.plan}</TableCell>
                        <TableCell className="text-white">{payment.date}</TableCell>
                        <TableCell>
                          {payment.status === "Completed" ? (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                            Refund
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Support Links - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          size="sm"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
          onClick={() => window.open("https://crisp.chat", "_blank")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Crisp Support
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>

        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
          onClick={() => window.open("https://telegram.org", "_blank")}
        >
          <Send className="h-4 w-4 mr-2" />
          Telegram
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>

        <Button
          size="sm"
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg"
          onClick={() => window.open("https://discord.com", "_blank")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Discord
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </div>
    </div>
  )
}
