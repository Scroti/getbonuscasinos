interface SlotMachineImageProps {
  className?: string
  alt?: string
}

export function SlotMachineImage({ 
  className = "",
  alt = "404 Illustration"
}: SlotMachineImageProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/404.svg"
        alt={alt}
        className="w-full h-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] object-contain transition-all duration-700 hover:scale-110 hover:-rotate-3 animate-pulse"
        style={{
          animationDuration: '2s',
          filter: 'drop-shadow(0 25px 50px rgba(139, 92, 246, 0.4)) drop-shadow(0 15px 30px rgba(236, 72, 153, 0.3)) brightness(1.2) contrast(1.1)',
        }}
      />
    </div>
  )
}

