"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, AlertTriangle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only proceed with checks after the auth context has loaded
    if (!loading) {
      // If user is not logged in, redirect to auth page
      if (!user) {
        router.push("/auth")
        return
      }
      
      // If user data is loaded but user is not an admin, stay on the page to show unauthorized message
      if (userData) {
        setIsChecking(false)
      }
    }
  }, [user, userData, loading, router])

  // Show loading state while auth context is loading or we're checking permissions
  if (loading || (isChecking && user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white">Loading Admin Panel</h1>
          <p className="text-gray-300 max-w-md">
            Please wait while we verify your credentials and load the admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  // If user is not an admin, show unauthorized message
  if (!userData || userData.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-slate-800/60 backdrop-blur-md rounded-2xl p-10 border border-slate-700/60 shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          
          <p className="text-gray-300">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white mr-4"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={() => router.push("/auth")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Sign In as Admin
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If user is an admin, render the children
  return <>{children}</>
}