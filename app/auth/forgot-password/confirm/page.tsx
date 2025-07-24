"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"

export default function ResetPasswordConfirmPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validCode, setValidCode] = useState(false)
  const [oobCode, setOobCode] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Extract the oobCode (one-time code) from the URL
    const code = searchParams.get('oobCode')
    
    if (!code) {
      setError("Invalid or expired password reset link. Please request a new one.")
      router.replace("/auth")
      return
    }
    
    setOobCode(code)
    
    // Verify the password reset code
    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, code)
        setValidCode(true)
      } catch (err: any) {
        console.error("Invalid reset code:", err)
        router.replace("/auth")
        setError("Invalid or expired password reset link. Please request a new one.")
      }
    }
    
    verifyCode()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!oobCode) {
      setError("Missing reset code. Please request a new password reset link.")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, oobCode, newPassword)
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth")
      }, 3000)
    } catch (err: any) {
      console.error("Password reset error:", err)
      
      if (err.code === 'auth/expired-action-code') {
        setError("The password reset link has expired. Please request a new one.")
      } else if (err.code === 'auth/invalid-action-code') {
        setError("Invalid reset link. Please request a new password reset link.")
      } else if (err.code === 'auth/weak-password') {
        setError("Please choose a stronger password. It should be at least 8 characters long.")
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
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
            <h1 className="text-3xl font-bold text-white">
              {success ? "Password Reset Complete" : "Create New Password"}
            </h1>
            <p className="text-gray-400">
              {success 
                ? "Your password has been successfully reset" 
                : "Please enter and confirm your new password"}
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
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-gray-300">
                    Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                    asChild
                  >
                    <Link href="/auth">Go to Login</Link>
                  </Button>
                </div>
              ) : validCode ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        disabled={loading}
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                      asChild
                      disabled={loading}
                    >
                      <Link href="/auth/forgot-password">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Forgot Password
                      </Link>
                    </Button>
                  </div>
                </form>
              ) : (
                <></>
                // <div className="text-center space-y-6">
                //   <p className="text-gray-300">
                //     {error || "Verifying your reset link..."}
                //   </p>
                //   <Button
                //     variant="outline"
                //     className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                //     asChild
                //   >
                //     <Link href="/auth/forgot-password">
                //       Request a New Reset Link
                //     </Link>
                //   </Button>
                // </div>
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