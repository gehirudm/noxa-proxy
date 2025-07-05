"use client"

import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { MainContent } from "./components/main-content"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Header />
          <MainContent />
        </div>
      </div>
    </div>
  )
}
