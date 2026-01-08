"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { NewsletterModal } from "@/components/newsletter-modal"
import { FloatingSubscribeButton } from "@/components/floating-subscribe-button"

export function NewsletterFeature() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const [is404Page, setIs404Page] = useState(false)

  // Check if we're on a 404 page
  useEffect(() => {
    // Check for Next.js not-found page indicators
    const check404 = () => {
      // Check for data-not-found attribute (from our custom not-found page)
      const notFoundElement = document.querySelector('[data-not-found]')
      if (notFoundElement) {
        setIs404Page(true)
        return
      }
      
      // Check page title
      const title = document.title?.toLowerCase() || ''
      if (title.includes('404') || title.includes('not found')) {
        setIs404Page(true)
        return
      }
      
      // Check for common 404 indicators in the page
      const h1Text = document.querySelector('h1')?.textContent?.toLowerCase() || ''
      const bodyText = document.body?.textContent?.toLowerCase() || ''
      
      if (h1Text.includes('not found') || 
          h1Text.includes('404') || 
          bodyText.includes('this page could not be found') ||
          bodyText.includes('page not found')) {
        setIs404Page(true)
        return
      }
      
      setIs404Page(false)
    }
    
    // Check immediately and after DOM is ready
    check404()
    const timer = setTimeout(check404, 500)
    
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // Don't show modal on admin routes or 404 pages
    if (pathname?.startsWith("/admin") || pathname === "/404" || pathname === null || is404Page) {
      return
    }

    // Check session storage for first visit
    const hasSeenModal = sessionStorage.getItem("hasSeenNewsletterModal")
    if (!hasSeenModal) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsModalOpen(true)
        sessionStorage.setItem("hasSeenNewsletterModal", "true")
      }, 2000)
      return () => clearTimeout(timer)
    }
    setHasCheckedSession(true)
  }, [pathname, is404Page])

  useEffect(() => {
    // Don't show button on admin routes or 404 pages
    if (pathname?.startsWith("/admin") || pathname === "/404" || pathname === null || is404Page) {
      setShowFloatingButton(false)
      return
    }

    // Intersection Observer for Footer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If footer is intersecting (visible), hide the button
        // If footer is NOT intersecting (not visible), show the button
        setShowFloatingButton(!entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    )

    const footer = document.getElementById("main-footer")
    if (footer) {
      observer.observe(footer)
    }

    // Initial check in case footer is not yet rendered or observer takes time
    // We default to showing it after a short delay if we're not at the bottom
    const timer = setTimeout(() => {
        if (!footer) setShowFloatingButton(true)
    }, 500)

    return () => {
      if (footer) observer.unobserve(footer)
      clearTimeout(timer)
    }
  }, [pathname, is404Page])

  // Don't render anything on admin routes or 404 pages
  if (pathname?.startsWith("/admin") || pathname === "/404" || pathname === null || is404Page) {
    return null
  }

  return (
    <>
      <FloatingSubscribeButton 
        onClick={() => setIsModalOpen(true)} 
        isVisible={showFloatingButton} 
      />
      <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
