import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NoxaProxy - Premium Proxy Services",
  description: "Professional proxy solutions for modern businesses"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
