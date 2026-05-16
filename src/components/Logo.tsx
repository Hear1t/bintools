import logoUrl from '@/assets/logo.png'
import { cn } from '@/lib/cn'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 20, className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="BinTools"
      width={size}
      height={size}
      className={cn('rounded-[22%] shrink-0 select-none', className)}
      draggable={false}
    />
  )
}
