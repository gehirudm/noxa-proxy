"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Mail, User, Lock } from "lucide-react"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { createParser, useQueryState } from 'nuqs'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useQueryState('mode', createParser({
    parse(queryValue) {
      return queryValue === 'login' ? true : false
    },
    serialize(value) {
      return value ? 'login' : 'register'
    }
  }).withDefault(true))
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signInWithGoogle, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      if (isLogin) {
        // Login logic
        await signIn(email, password)
        router.push("/dashboard")
      } else {
        // Registration logic
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          return
        }

        if (!agreeToTerms) {
          setError("Please agree to the Terms of Service")
          return
        }

        await signUp(fullName, email, password)
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error(isLogin ? "Login error:" : "Registration error:", err)

      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.")
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email is already in use. Please use a different email or login.")
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.")
      } else {
        setError(err.message || "An error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await signInWithGoogle()
    } catch (err: any) {
      console.error("Google login error:", err)
      setError("Failed to login with Google. Please try again.")
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
            <h1 className="text-3xl font-bold text-white">{isLogin ? "Welcome Back" : "Get Started"}</h1>
            <p className="text-gray-400">
              {isLogin ? "Sign in to your proxy dashboard" : "Create your proxy account today"}
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
                <h2 className="text-xl font-semibold text-white">{isLogin ? "Sign In" : "Create Account"}</h2>
                <p className="text-gray-400 text-sm">
                  {isLogin ? "Enter your credentials to access your account" : "Join thousands of satisfied customers"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Google Login Button */}
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-300 text-base"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>{loading ? "Processing..." : "Login with Google"}</span>
                </Button>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-800 px-4 text-gray-400 font-medium">OR</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field (only for registration) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password Field (only for registration) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me / Terms Agreement */}
                <div className="flex items-center">
                  {isLogin ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        disabled={loading}
                      />
                      <Label htmlFor="rememberMe" className="text-gray-300 text-sm cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Forgot Password Link (only for login) */}
                {isLogin && (
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                  disabled={loading || (!isLogin && !agreeToTerms)}
                >
                  {loading
                    ? "Processing..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </Button>

                {/* Toggle between Login and Register */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    disabled={loading}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
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