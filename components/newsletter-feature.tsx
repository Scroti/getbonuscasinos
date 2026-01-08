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

  // Don't show on admin routes or 404 pages
  if (pathname?.startsWith("/admin") || pathname === "/404" || pathname === null) {
    return null
  }

  useEffect(() => {
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
  }, [])

  useEffect(() => {
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
  }, [])

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
