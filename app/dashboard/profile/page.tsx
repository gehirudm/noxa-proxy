"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Calendar, MapPin, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/app/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, userData, fetchUserData } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: ""
  })

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      // Split the username into first and last name if available
      const nameParts = userData.username?.split(" ") || ["", ""]
      
      setFormData({
        firstName: userData.firstName || nameParts[0] || "",
        lastName: userData.lastName || nameParts.slice(1).join(" ") || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        location: userData.location || ""
      })
    }
  }, [userData, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const result = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location
      })
      
      if (result.success) {
        // Refresh user data
        await fetchUserData()
        
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
          variant: "default"
        })
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile information",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format the join date
  const formatJoinDate = () => {
    if (!userData?.createdAt) return "Unknown join date"
    
    try {
      const date = new Date(userData.createdAt)
      return `Joined ${format(date, "MMMM yyyy")}`
    } catch (e) {
      return "Unknown join date"
    }
  }

  // Calculate total usage across all products
  const calculateTotalUsage = () => {
    if (!userData?.evomi?.products) return "0.00 GB"
    
    const products = userData.evomi.products
    let totalMB = 0
    
    // Sum up balances from all products
    Object.values(products).forEach(product => {
      if (product && 'balance' in product) {
        totalMB += product.balance || 0
      }
    })
    
    // Convert MB to GB with 2 decimal places
    return `${(totalMB / 1000).toFixed(2)} GB`
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {userData?.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-foreground">
                    {userData?.username || user?.displayName || "User"}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {userData?.role === "admin" ? "Admin User" : "Standard User"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatJoinDate()}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {userData?.location || "Location not set"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-foreground">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          className="bg-background border-border text-foreground"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-foreground">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          className="bg-background border-border text-foreground"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-background border-border text-foreground"
                        value={formData.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        className="bg-background border-border text-foreground"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-foreground">
                        Location
                      </Label>
                      <Input
                        id="location"
                        className="bg-background border-border text-foreground"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-foreground">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        className="bg-background border-border text-foreground"
                        placeholder="Tell us about yourself"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                      />
                    </div>
                    <Button 
                      className="bg-pink-600 hover:bg-pink-700"
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {userData?.activeOrders || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {calculateTotalUsage()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Balance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          ${userData?.totalSpent?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}