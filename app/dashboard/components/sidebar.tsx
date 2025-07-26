"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Globe,
  ChevronDown,
  Shield,
  Wifi,
  Server,
  Network,
  Smartphone,
  CreditCard,
  Users,
  HelpCircle,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const [isProxiesExpanded, setIsProxiesExpanded] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/", active: pathname === "/" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: pathname === "/billing" },
    // { icon: Users, label: "Referral", href: "/dashboard/referral", active: pathname === "/referral" },
    { icon: HelpCircle, label: "Support", href: "/dashboard/support", active: pathname === "/support" },
    // { icon: Settings, label: "Settings", href: "/dashboard/settings", active: pathname === "/settings" },
  ]

  const proxyItems = [
    // { icon: Shield, label: "Premium Residential", href: "/dashboard/proxies/premium-residential" },
    { icon: Wifi, label: "Static Residential", href: "/dashboard/proxies/static-residential" },
    // { icon: Smartphone, label: "Mobile Proxy", href: "/dashboard/proxies/mobile-proxy" },
    // { icon: Server, label: "Datacenter IPv4", href: "/dashboard/proxies/datacenter-ipv4" },
    // { icon: Network, label: "Datacenter IPv6", href: "/dashboard/proxies/datacenter-ipv6" },
  ]

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-background border border-border shadow-md hover:bg-muted"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-background border-r border-border min-h-screen transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-4 pt-16">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href || "#"}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    item.active
                      ? "bg-pink-600 hover:bg-pink-700 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Proxies Menu with Collapsible Submenu */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsProxiesExpanded(!isProxiesExpanded)}
              >
                <Globe className="w-4 h-4 mr-3" />
                Proxies
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform ${isProxiesExpanded ? "" : "-rotate-90"}`}
                />
              </Button>

              {isProxiesExpanded && (
                <div className="ml-4 mt-2 space-y-1">
                  {proxyItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left ${
                          pathname === item.href
                            ? "bg-pink-600 hover:bg-pink-700 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
