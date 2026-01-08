import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" data-not-found="true">
      <div className="bg-black rounded-2xl p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Section - Slot Machine Illustration */}
        <div className="flex-shrink-0">
          <div className="relative w-48 h-64 md:w-64 md:h-80">
            {/* Slot Machine Container */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 shadow-2xl">
              {/* Top Screen with Sad Face */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-gray-900 rounded border border-gray-700 flex items-center justify-center">
                <div className="text-2xl">😞</div>
              </div>
              
              {/* Reels Container */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-2">
                {/* Reel 1 - 4 */}
                <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-serif font-bold text-gray-900">4</span>
                </div>
                {/* Reel 2 - 0 */}
                <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-serif font-bold text-gray-900">0</span>
                </div>
                {/* Reel 3 - 4 */}
                <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-serif font-bold text-gray-900">4</span>
                </div>
              </div>
              
              {/* Lever */}
              <div className="absolute top-32 right-4 w-8 h-16">
                <div className="w-2 h-12 bg-gray-600 rounded-full absolute right-0"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full absolute bottom-0 right-0"></div>
              </div>
              
              {/* Button */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 rounded-full border-2 border-red-700 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Text and Button */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Oops! A glitch in the reels.
          </h1>
          <p className="text-lg md:text-xl font-serif text-gray-300 mb-8">
            The slot page you were looking for is missing.
          </p>
          <Button 
            asChild 
            className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-lg"
          >
            <Link href="/">Go back</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

