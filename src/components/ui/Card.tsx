import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-line bg-cream-50 p-5',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'
