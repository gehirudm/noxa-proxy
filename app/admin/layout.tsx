"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Settings, LogOut } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, ReactNode, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, user, logout } = useAuth()

  // Redirect non-admin users to auth page
  useEffect(() => {
    if (user && userData && userData.role !== "admin") {
      router.push("/auth")
    } else if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  // If user is not admin or not logged in, don't render the admin layout
  if (!user || !userData || userData.role !== "admin") {
    return null
  }

  // Determine active tab based on the current path
  const getActiveTab = () => {
    if (pathname.includes("/admin/users")) return "users"
    if (pathname.includes("/admin/proxies")) return "proxies"
    if (pathname.includes("/admin/payments")) return "payments"
    if (pathname.includes("/admin/system")) return "system"
    return "overview" // Default tab
  }

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
              <span className="text-xl font-bold text-white">NoxaProxy Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Administrator
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <Tabs value={getActiveTab()} className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <Link href="/admin">
                <TabsTrigger
                  value="overview"
                  className={`data-[state=active]:bg-slate-700 ${getActiveTab() === "overview" ? "bg-slate-700" : ""}`}
                >
                  Overview
                </TabsTrigger>
              </Link>
              <Link href="/admin/users">
                <TabsTrigger
                  value="users"
                  className={`data-[state=active]:bg-slate-700 ${getActiveTab() === "users" ? "bg-slate-700" : ""}`}
                >
                  Users
                </TabsTrigger>
              </Link>
              <Link href="/admin/proxies">
                <TabsTrigger
                  value="proxies"
                  className={`data-[state=active]:bg-slate-700 ${getActiveTab() === "proxies" ? "bg-slate-700" : ""}`}
                >
                  Proxies
                </TabsTrigger>
              </Link>
              <Link href="/admin/payments">
                <TabsTrigger
                  value="payments"
                  className={`data-[state=active]:bg-slate-700 ${getActiveTab() === "payments" ? "bg-slate-700" : ""}`}
                >
                  Payments
                </TabsTrigger>
              </Link>
              <Link href="/admin/system">
                <TabsTrigger
                  value="system"
                  className={`data-[state=active]:bg-slate-700 ${getActiveTab() === "system" ? "bg-slate-700" : ""}`}
                >
                  System
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        {/* Page Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>

      {/* Support Links - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          size="sm"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
        >
          Support
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutContent children={children} />
    </AuthProvider>
  )
}