"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Subscribing from modal:", email)
    setEmail("")
    onClose()
    alert("Welcome to the club! Check your email for your bonus.")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-foreground/10 p-0 overflow-hidden gap-0 shadow-2xl">
        <div className="relative p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none" />
          
          {/* Icon/Logo Area */}
          <div className="mb-6 relative z-10">
             <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 flex items-center justify-center mb-4 mx-auto border border-purple-500/20 backdrop-blur-md">
                <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
             </div>
          </div>

          <DialogHeader className="mb-6 relative z-10 max-w-lg mx-auto">
            <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Unlock the <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">Ultimate Bonus</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Join our exclusive VIP club and get <span className="font-semibold text-foreground">50 Free Spins</span> + <span className="font-semibold text-foreground">No Deposit Offers</span> delivered straight to your inbox.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-2 relative z-10">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-foreground/5 border-foreground/10 h-12 text-base focus-visible:ring-purple-500"
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold h-12 px-8 transition-all hover:scale-105 hover:shadow-lg"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 relative z-10">
            100% free. Unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
