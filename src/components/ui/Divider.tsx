import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DividerProps {
  label?: ReactNode
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn('border-0 border-t border-line', className)} />
  }
  return (
    <div className={cn('flex items-center gap-3 text-xs text-ink-subtle', className)}>
      <span className="uppercase tracking-wider font-medium">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
