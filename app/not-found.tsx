import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SlotMachineImage } from '@/components/slot-machine-image'

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black" data-not-found="true">
      <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-8 md:gap-12 p-8 md:p-12 text-center">
        {/* Slot Machine Image */}
        <div className="flex-shrink-0">
          <SlotMachineImage 
            width={500}
            height={650}
            className="max-w-[500px] max-h-[650px] md:max-w-[600px] md:max-h-[780px]"
            alt="404 Slot Machine"
          />
        </div>

        {/* Text and Button */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight" style={{ 
            WebkitTextStroke: '2px white',
            color: 'transparent',
            letterSpacing: '0.02em'
          }}>
            Oops! A glitch in the reels.
          </h1>
          <p className="text-xl md:text-2xl font-serif text-gray-300 mb-10 leading-relaxed">
            The slot page you were looking for is missing.
          </p>
          <Button 
            asChild 
            className="bg-white text-black hover:bg-gray-100 font-medium px-10 py-3 text-base rounded-lg shadow-sm"
          >
            <Link href="/">Go back</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

