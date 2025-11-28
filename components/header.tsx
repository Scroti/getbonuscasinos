"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Mail, Menu, Search } from "lucide-react"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Determine which logo to show based on resolved theme
  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/logo-white.png"
    : "/logo-black.png"

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-xl border-b border-foreground/5 py-2" 
        : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="Logo"
              width={280}
              height={84}
              className="h-10 w-auto sm:h-12 md:h-14 transition-all hover:opacity-80"
              priority
            />
          ) : (
            <div className="h-10 w-32 animate-pulse bg-muted/20 rounded" />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <Button
            size="sm"
            className="hidden sm:flex gap-2 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 border border-foreground/5 backdrop-blur-md transition-all"
          >
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="sm:hidden text-foreground hover:bg-foreground/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

