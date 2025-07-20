"use client"

import { useState } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 relative overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-white hover:bg-white/10 p-1 h-8 w-8"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-4 h-4" />
      </Button>
      <div className="flex items-center justify-between">
        <div className="max-w-2xl">
          <h2 className="text-sm font-semibold text-pink-200 mb-2">Bulk Residential Proxy</h2>
          <p className="text-white text-lg leading-relaxed">
            Right now we're searching for large-scale residential proxy clients. Depending on how much is bought, we can
            give a discount of up to 50%. Contact us on our discord server or our Sales Management on telegram.
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
