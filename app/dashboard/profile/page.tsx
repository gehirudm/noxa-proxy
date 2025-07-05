import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Calendar, MapPin } from "lucide-react"

export default function ProfilePage() {
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
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-foreground">John Doe</CardTitle>
                  <p className="text-muted-foreground">Premium User</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">john.doe@example.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined January 2024</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">New York, USA</span>
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
                          defaultValue="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-foreground">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          className="bg-background border-border text-foreground"
                          defaultValue="Doe"
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
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        className="bg-background border-border text-foreground"
                        placeholder="+1 (555) 123-4567"
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
                      />
                    </div>
                    <Button className="bg-pink-600 hover:bg-pink-700">Update Profile</Button>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">0</div>
                        <div className="text-sm text-muted-foreground">Active Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">0.00 GB</div>
                        <div className="text-sm text-muted-foreground">Total Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">$0.00</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
