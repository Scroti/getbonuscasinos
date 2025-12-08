"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Send } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here (e.g., API call)
    console.log("Subscribing:", email)
    setEmail("")
    alert("Thanks for subscribing!")
  }

  return (
    <footer id="main-footer" className="bg-background border-t border-foreground/10 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6 ">
            <Link href="/" className="block">
              <Logo titleSize="text-2xl" subtitleSize="text-[0.7rem]" className="py-4" />
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Your trusted source for the best casino bonuses, free spins, and exclusive offers. We provide honest reviews and the latest promotions to help you play smarter.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-foreground/5 rounded-full">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="md:pl-12">
            <h3 className="font-bold text-lg mb-6">Support & Legal</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Responsible Gaming
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to get the latest bonuses and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all text-sm shadow-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-9 w-9 rounded-md bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GetBonusCasinos. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              18+ Play Responsibly
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
