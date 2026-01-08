"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  return (
    <Button 
      variant="outline"
      size="lg"
      className="px-8 py-6 text-base border-2 border-gray-600 hover:bg-gray-800 hover:border-gray-500 text-white transition-all duration-300 hover:scale-105 w-full sm:w-auto"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Go Back
    </Button>
  )
}

