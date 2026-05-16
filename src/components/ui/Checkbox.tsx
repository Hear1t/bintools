import { type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ParameterTooltip } from '@/components/ParameterTooltip'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  helpKey?: string
  className?: string
}

export function Checkbox({
  checked,
  onChange,
  label,
  helpKey,
  className,
}: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-2 text-sm text-ink cursor-pointer', className)}>
      <span className="relative flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            'h-4 w-4 rounded border border-line bg-cream-50',
            'peer-checked:bg-terracotta peer-checked:border-terracotta',
            'transition-colors',
          )}
        />
        {checked && (
          <Check
            className="absolute h-3 w-3 text-cream pointer-events-none"
            strokeWidth={3}
          />
        )}
      </span>
      <span className="flex-1">{label}</span>
      {helpKey && <ParameterTooltip helpKey={helpKey} />}
    </label>
  )
}
