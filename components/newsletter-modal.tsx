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
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/firebase/newsletter"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'already-subscribed' | null;
    message: string;
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: '' })

    try {
      // Get user profile data before subscribing
      const { getUserProfileData } = await import('@/lib/firebase/newsletter')
      const profileData = await getUserProfileData()
      
      const result = await subscribeToNewsletter(email, profileData)
      
      if (result.alreadySubscribed) {
        setStatus({
          type: 'already-subscribed',
          message: 'This email is already subscribed! Thank you for your interest.',
        })
        // Clear email after showing message
        setTimeout(() => {
          setEmail("")
          setStatus({ type: null, message: '' })
        }, 3000)
      } else if (result.success) {
        setStatus({
          type: 'success',
          message: 'Welcome to the club! Check your email for your bonus.',
        })
        setEmail("")
        // Close modal after success
        setTimeout(() => {
          onClose()
          setStatus({ type: null, message: '' })
        }, 2000)
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to subscribe. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
              className="bg-foreground/5 border-foreground/10 h-12 text-base focus-visible:ring-purple-500"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold h-12 px-8 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          {/* Status Messages */}
          {status.type && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm relative z-10 ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : status.type === 'already-subscribed'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}>
              {status.type === 'success' && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
              {status.type === 'already-subscribed' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              {status.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6 relative z-10">
            100% free. Unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
