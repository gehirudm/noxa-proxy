"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  redirectTo = "/auth" 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only proceed with checks after the auth context has loaded
    if (!loading) {
      // If user is not logged in, redirect to auth page
      if (!user) {
        router.push(redirectTo)
        return
      }
      
      // User is authenticated, stop checking
      setIsChecking(false)
    }
  }, [user, loading, router, redirectTo])

  // Show loading state while auth context is loading or we're checking authentication
  if (loading || (isChecking && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if user is authenticated
  return <>{children}</>
}