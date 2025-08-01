"use server"

import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail } from "lucide-react"
import { SupportTabs } from "@/app/dashboard/support/components/support-tabs"
import Link from "next/link"

export default async function SupportPage() {

  return (
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
            <Link href={"https://discord.gg/8tR6RBNgUW"}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">Join Discord</Button>
            </Link>
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
            <Link href={"https://t.me/noxaproxy"}>
              <Button className="bg-blue-500 hover:bg-blue-600 w-full">Open Telegram</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <SupportTabs></SupportTabs>
    </main>
  )
}