"use client"

import { useState } from "react"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "auto-renewal", label: "Auto renewal", icon: RefreshCw },
  ]

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={`${activeTab === tab.id
                    ? "bg-background text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">General settings</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-background border-border text-foreground mt-1"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    className="bg-background border-border text-foreground mt-1"
                    defaultValue="John"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    className="bg-background border-border text-foreground mt-1"
                    defaultValue="Doe"
                  />
                </div>

                <div>
                  <Label className="text-foreground">Telegram Connect</Label>
                  <p className="text-sm text-muted-foreground mb-2">Connect for getting notifications</p>
                  <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                    Connect
                  </Button>
                </div>

                <div>
                  <Label className="text-foreground">Language</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    NoxaProxy delivers versatile proxy solutions
                  </p>
                  <Select defaultValue="en">
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (EN)</SelectItem>
                      <SelectItem value="es">Spanish (ES)</SelectItem>
                      <SelectItem value="fr">French (FR)</SelectItem>
                      <SelectItem value="de">German (DE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Currency</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    We will use this as your currency for payments
                  </p>
                  <Select defaultValue="usd">
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Time format</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    NoxaProxy delivers versatile proxy solutions
                  </p>
                  <Select defaultValue="local">
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Format</SelectItem>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-pink-600 hover:bg-pink-700">Save</Button>
                <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Security settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label className="text-foreground">Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-2">Update your account password</p>
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                    Change Password
                  </Button>
                </div>

                <div>
                  <Label className="text-foreground">Session Management</Label>
                  <p className="text-sm text-muted-foreground mb-2">Manage your active sessions</p>
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                    View Active Sessions
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-pink-600 hover:bg-pink-700">Save</Button>
                <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Usage Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you reach usage limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Billing Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive billing and payment notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Telegram Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via Telegram</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-pink-600 hover:bg-pink-700">Save</Button>
                <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeTab === "auto-renewal" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Auto renewal settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Enable Auto Renewal</Label>
                    <p className="text-sm text-muted-foreground">Automatically renew your subscriptions</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label className="text-foreground">Renewal Period</Label>
                  <p className="text-sm text-muted-foreground mb-2">Choose how often to renew your services</p>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Renewal Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified before auto renewal</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label className="text-foreground">Notification Timing</Label>
                  <p className="text-sm text-muted-foreground mb-2">When to send renewal notifications</p>
                  <Select defaultValue="3days">
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1day">1 Day Before</SelectItem>
                      <SelectItem value="3days">3 Days Before</SelectItem>
                      <SelectItem value="1week">1 Week Before</SelectItem>
                      <SelectItem value="2weeks">2 Weeks Before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-pink-600 hover:bg-pink-700">Save</Button>
                <Button variant="secondary" className="bg-muted hover:bg-muted/80">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
