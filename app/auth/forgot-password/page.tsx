"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Zap, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email, {
        // This URL will be appended to the password reset link
        // The user will be redirected here after clicking the link in the email
        url: `${window.location.origin}/auth/forgot-password/confirm`,
        handleCodeInApp: true,
      })
      
      console.log("Password reset email sent to:", email)
      setIsSubmitted(true)
    } catch (err: any) {
      console.error("Password reset error:", err)
      
      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found') {
        // For security reasons, don't reveal if the email exists or not
        // Still show success message to prevent email enumeration attacks
        setIsSubmitted(true)
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.")
      } else if (err.code === 'auth/missing-continue-uri') {
        setError("Configuration error. Please contact support.")
      } else if (err.code === 'auth/unauthorized-continue-uri') {
        setError("Configuration error with redirect. Please contact support.")
      } else {
        setError("An error occurred. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back to Home */}
      <button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back to Home</span>
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
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-gray-400">
              {isSubmitted 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive a password reset link"}
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
                <h2 className="text-xl font-semibold text-white">
                  {isSubmitted ? "Check Your Email" : "Forgot Password"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isSubmitted
                    ? "We've sent a password reset link to your email address"
                    : "Enter your email address and we'll send you a link to reset your password"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {isSubmitted ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-gray-300">
                    If an account with email <strong className="text-white">{email}</strong> exists, you will receive a
                    password reset link shortly.
                  </p>
                  <div className="pt-2 text-sm text-gray-400">
                    <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                      asChild
                    >
                      <Link href="/auth">Back to Login</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Try Different Email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                      asChild
                      disabled={loading}
                    >
                      <Link href="/auth">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                      </Link>
                    </Button>
                  </div>
                </form>
              )}
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