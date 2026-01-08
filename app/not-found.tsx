import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" data-not-found="true">
      <div className="bg-black rounded-2xl p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Section - Slot Machine Image */}
        <div className="flex-shrink-0">
          <Image
            src="/404.png"
            alt="404 Slot Machine"
            width={300}
            height={400}
            className="w-auto h-auto max-w-[300px] max-h-[400px]"
            priority
          />
        </div>

        {/* Right Section - Text and Button */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ 
            WebkitTextStroke: '1px white',
            color: 'transparent'
          }}>
            Oops! A glitch in the reels.
          </h1>
          <p className="text-lg md:text-xl font-serif text-gray-300 mb-8">
            The page you were looking for is missing.
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

