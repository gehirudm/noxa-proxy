import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthGuard } from "@/components/guards/auth-guard"
import { AuthProvider } from "@/contexts/auth-context"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"

export const metadata: Metadata = {
  title: "NoxaProxy Dashboard",
  description: "Welcome to NoxaProxy Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AuthGuard redirectTo="/auth">
        <div className="min-h-screen bg-background text-foreground">
          <div className="flex">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Header />
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  )
}