import Image from 'next/image'

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-lg border border-[var(--gold-border)] bg-[var(--surface-2)]"
      style={{ width: size, height: size }}
    >
      <Image 
        src="/icons/dnd_logo.png" 
        alt="D&D Logo" 
        width={size} 
        height={size} 
        className="object-cover w-full h-full"
      />
    </div>
  )
}
