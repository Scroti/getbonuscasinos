import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { BackButton } from '@/components/back-button'
import { SlotMachineImage } from '@/components/slot-machine-image'

export default function NotFound() {
  return (
    <div className="min-h-screen lg:h-screen w-full flex items-center justify-center bg-black relative overflow-hidden" data-not-found="true">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-pink-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full px-4 py-8 sm:py-12 lg:py-0 max-w-4xl mx-auto h-full lg:h-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 lg:space-y-4">
          {/* Image - Centered and prominent */}
          <div className="w-full flex items-center justify-center lg:mb-2">
            <SlotMachineImage
              className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[280px] xl:h-[320px]"
              alt="404 Illustration"
            />
          </div>

          {/* Large 404 Number */}
          <div className="space-y-1 lg:space-y-0">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                4
              </span>
              <span className="bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '0.3s' }}>
                0
              </span>
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '0.6s' }}>
                4
              </span>
            </h1>
          </div>

          {/* Text Content */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-2 max-w-xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
              Oops! A glitch in the reels
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
              The page you were looking for is missing. Let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-2 lg:pt-1">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 lg:py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  )
}

