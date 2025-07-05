"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset request for:", email)
    // In real app, this would send reset email
    setIsSubmitted(true)
  }

  const handleBackToLogin = () => {
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="flex justify-center pt-12 pb-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">IgnitexProxy</span>
        </div>
      </div>

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Back to Login */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-blue-200 hover:text-white text-sm mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>

          {isSubmitted ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-green-500/30">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-medium text-white">Check Your Email</h1>
              <p className="text-blue-200">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
              <Button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Back to Login
              </Button>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full border-blue-500/50 text-blue-200 hover:bg-blue-500/10 hover:text-white hover:border-blue-400 font-medium py-3 rounded-lg backdrop-blur-sm transition-all duration-200"
              >
                Try Different Email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-medium text-white text-center mb-8">Forgot Password</h1>
              <p className="text-blue-200 text-center mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm text-blue-200">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border-blue-700/50 text-white placeholder:text-blue-300/70 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg py-3 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send Reset Link
                </Button>

                {/* Back to Login Button */}
                <Button
                  type="button"
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full border-blue-500/50 text-blue-200 hover:bg-blue-500/10 hover:text-white hover:border-blue-400 font-medium py-3 rounded-lg backdrop-blur-sm transition-all duration-200"
                >
                  Back to Login
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
