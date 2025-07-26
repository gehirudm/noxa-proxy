"use client"

import { useState, useEffect } from "react"
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
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const [isProxiesExpanded, setIsProxiesExpanded] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile when component mounts and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Set initial state
    checkIfMobile()
    
    // Default to open on desktop, closed on mobile
    setIsSidebarOpen(window.innerWidth >= 768)
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: pathname === "/dashboard/billing" },
    // { icon: Users, label: "Referral", href: "/dashboard/referral", active: pathname === "/dashboard/referral" },
    { icon: HelpCircle, label: "Support", href: "/dashboard/support", active: pathname === "/dashboard/support" },
    // { icon: Settings, label: "Settings", href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
  ]

  const proxyItems = [
    // { icon: Shield, label: "Premium Residential", href: "/dashboard/proxies/premium-residential" },
    { icon: Wifi, label: "Static Residential", href: "/dashboard/proxies/static-residential" },
    // { icon: Smartphone, label: "Mobile Proxy", href: "/dashboard/proxies/mobile-proxy" },
    // { icon: Server, label: "Datacenter IPv4", href: "/dashboard/proxies/datacenter-ipv4" },
    // { icon: Network, label: "Datacenter IPv6", href: "/dashboard/proxies/datacenter-ipv6" },
  ]

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-background border border-border shadow-md hover:bg-muted md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block md:w-64 bg-background border-r border-border min-h-screen transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 pt-16">
          <SidebarContent 
            menuItems={menuItems} 
            proxyItems={proxyItems} 
            pathname={pathname}
            isProxiesExpanded={isProxiesExpanded}
            setIsProxiesExpanded={setIsProxiesExpanded}
            closeSidebar={closeSidebar}
          />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-background border-r border-border
          transition-all duration-300 ease-in-out overflow-hidden md:hidden
          ${isSidebarOpen ? 'w-64' : 'w-0'}
        `}
      >
        <div className="p-4 pt-16">
          <SidebarContent 
            menuItems={menuItems} 
            proxyItems={proxyItems} 
            pathname={pathname}
            isProxiesExpanded={isProxiesExpanded}
            setIsProxiesExpanded={setIsProxiesExpanded}
            closeSidebar={closeSidebar}
          />
        </div>
      </aside>
    </>
  )
}

// Extracted sidebar content to avoid duplication
interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
}

interface ProxyItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarContentProps {
  menuItems: MenuItem[];
  proxyItems: ProxyItem[];
  pathname: string;
  isProxiesExpanded: boolean;
  setIsProxiesExpanded: (expanded: boolean) => void;
  closeSidebar: () => void;
}

function SidebarContent({ 
  menuItems, 
  proxyItems, 
  pathname, 
  isProxiesExpanded, 
  setIsProxiesExpanded,
  closeSidebar
}: SidebarContentProps) {
  return (
    <nav className="space-y-2">
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href || "#"} onClick={closeSidebar}>
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
              <Link key={index} href={item.href} onClick={closeSidebar}>
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
  )
}