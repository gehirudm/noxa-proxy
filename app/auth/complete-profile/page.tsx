"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, Mail, Lock } from "lucide-react"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, setDoc, getFirestore } from "firebase/firestore"
import { createEvomiSubUser } from "@/app/actions/user-actions"

export default function CompleteProfilePage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, fetchUserData } = useAuth()
  const router = useRouter()
  const db = getFirestore()

  // Pre-fill email from the user's Firebase account
  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
      // If user has a display name, pre-fill the username field
      if (user.displayName) {
        setUsername(user.displayName)
      }
    } else {
      // If no user is logged in, redirect to login page
      router.push("/auth")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError("You must be logged in to complete your profile")
      return
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create Evomi sub-user via server action
      const evomiResponse = await createEvomiSubUser(username, email)

      if (!evomiResponse.success || !evomiResponse.data) {
        throw new Error(`Failed to create proxy account: ${evomiResponse.error}`)
      }

      // Extract the subuser data from the response
      const subUser = evomiResponse.data

      // Create or update user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        profileImage: user.photoURL,
        username,
        email,
        createdAt: new Date().toISOString(),
        role: "user",
        evomi: {
          username: subUser.username,
          email: subUser.email,
          created_at: subUser.created_at,
          updated_at: subUser.updated_at,
          products: subUser.products || {}
        }
      }, { merge: true })

      // Refresh user data in context
      await fetchUserData()

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Profile completion error:", err)
      setError(err.message || "Failed to complete your profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back to Home */}
      <button
        onClick={handleBackToLogin}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back to Login</span>
      </button>

      {/* Main Content */}
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-yellow-500 rounded-xl flex items-center justify-center p-1">
              <Image
                src="/logos/1.png"
                alt="NoxaProxy Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white text-xl font-semibold">NoxaProxy</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
            <p className="text-gray-400">
              Just one more step to access your proxy dashboard
            </p>
          </div>
        </div>

        {/* Form Card with Dark Blue Flare Background */}
        <div className="relative">
          {/* Dark Blue Flare Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-700/50 to-blue-900/40 rounded-3xl blur-xl scale-110 opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/35 via-blue-600/40 to-blue-800/35 rounded-3xl blur-2xl scale-115 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-700/35 to-blue-900/30 rounded-3xl blur-3xl scale-120 opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-blue-600/25 to-blue-900/25 rounded-3xl blur-[100px] scale-125 opacity-90"></div>

          {/* Form Card */}
          <div className="relative bg-gray-800/60 backdrop-blur-md rounded-2xl p-10 border border-gray-700/60 shadow-2xl">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-white">Complete Registration</h2>
                <p className="text-gray-400 text-sm">
                  We need a few more details to set up your proxy account
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Field (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      disabled
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-gray-300 text-sm cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                  disabled={loading || !agreeToTerms}
                >
                  {loading ? "Processing..." : "Complete Registration"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} NoxaProxy. All rights reserved.</p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-600/20 rounded-full filter blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      </div>
    </div>
  )
}