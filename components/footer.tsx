"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { subscribeToNewsletter } from "@/lib/firebase/newsletter"

export function Footer() {
  const pathname = usePathname()
  const [is404Page, setIs404Page] = useState(false)

  useEffect(() => {
    // Check if we're on a 404 page
    const check404 = () => {
      const notFoundElement = document.querySelector('[data-not-found]')
      if (notFoundElement) {
        setIs404Page(true)
        return
      }
      setIs404Page(false)
    }
    
    check404()
    const timer = setTimeout(check404, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  // Don't show footer on 404 pages
  if (is404Page) {
    return null
  }
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
          message: 'This email is already subscribed!',
        })
        setTimeout(() => {
          setEmail("")
          setStatus({ type: null, message: '' })
        }, 3000)
      } else if (result.success) {
        setStatus({
          type: 'success',
          message: 'Thanks for subscribing!',
        })
        setEmail("")
        setTimeout(() => {
          setStatus({ type: null, message: '' })
        }, 3000)
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
    <footer id="main-footer" className="bg-background border-t border-foreground/10 pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="block">
              <Logo titleSize="text-xl sm:text-2xl" subtitleSize="text-[0.65rem] sm:text-[0.7rem]" className="py-3 sm:py-4" />
            </Link>

            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm">
              Your trusted source for the best casino bonuses, free spins, and exclusive offers. We provide honest reviews and the latest promotions to help you play smarter.
            </p>
            <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full touch-target">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full touch-target">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full touch-target">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="md:pl-12">
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Support & Legal</h3>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1 touch-target">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors py-1 touch-target block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors py-1 touch-target block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors py-1 touch-target block">
                  Responsible Gaming
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Stay Updated</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Subscribe to get the latest bonuses and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all text-xs sm:text-sm shadow-sm disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting}
                  className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
              
              {/* Status Messages */}
              {status.type && (
                <div className={`p-2 sm:p-2.5 rounded-lg flex items-start sm:items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${
                  status.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : status.type === 'already-subscribed'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                  {status.type === 'success' && <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5 sm:mt-0" />}
                  {status.type === 'already-subscribed' && <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5 sm:mt-0" />}
                  {status.type === 'error' && <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5 sm:mt-0" />}
                  <span className="break-words leading-relaxed">{status.message}</span>
                </div>
              )}
              
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                We respect your privacy.{" "}
                <Link href="/unsubscribe" className="text-primary hover:underline">
                  Unsubscribe at any time
                </Link>
                .
              </p>
            </form>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="text-center md:text-left">© {new Date().getFullYear()} GetBonusCasinos. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-foreground/5 border border-foreground/5 text-[10px] sm:text-xs">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 animate-pulse"></span>
              18+ Play Responsibly
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
