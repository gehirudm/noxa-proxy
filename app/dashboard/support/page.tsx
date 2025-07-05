import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, Mail } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
              <p className="text-gray-400">Get help and contact our support team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Get instant help from our support team</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-indigo-400" />
                    Discord
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Join our Discord community for support and updates</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">Join Discord</Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-500" />
                    Telegram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Contact us directly via Telegram for quick support</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 w-full">Open Telegram</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Submit a Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject" className="text-gray-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter ticket subject"
                  />
                </div>
                <div>
                  <Label htmlFor="priority" className="text-gray-300">
                    Priority
                  </Label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Describe your issue in detail"
                    rows={6}
                  />
                </div>
                <Button className="bg-pink-600 hover:bg-pink-700">Submit Ticket</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
