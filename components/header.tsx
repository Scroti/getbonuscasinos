"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Mail, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"

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
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
      ? "bg-background/80 backdrop-blur-xl border-b border-foreground/5 py-2"
      : "bg-transparent py-4"
      }`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Logo titleSize="text-2xl" subtitleSize="text-[0.7rem]" className="px-0" />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <Link href="/contact">
            <Button
              size="sm"
              className="flex gap-2 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 border border-foreground/5 backdrop-blur-md transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

