import Image from 'next/image'

interface SlotMachineImageProps {
  width?: number
  height?: number
  className?: string
  alt?: string
}

export function SlotMachineImage({ 
  width = 300, 
  height = 400, 
  className = "",
  alt = "Slot Machine"
}: SlotMachineImageProps) {
  return (
    <Image
      src="/test.png"
      alt={alt}
      width={width}
      height={height}
      className={`w-auto h-auto object-contain ${className}`}
      priority
    />
  )
}

