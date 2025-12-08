"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingSubscribeButtonProps {
  onClick: () => void
  isVisible: boolean
}

export function FloatingSubscribeButton({ onClick, isVisible }: FloatingSubscribeButtonProps) {
  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <Button
        onClick={onClick}
        variant="ghost"
        size="lg"
        className="h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 hover:scale-105 transition-all duration-300 shadow-lg px-6 gap-2"
      >
        <Mail className="h-5 w-5" />
        <span className="font-medium">Subscribe</span>
      </Button>
    </div>
  )
}
