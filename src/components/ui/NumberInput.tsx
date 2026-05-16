import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ParameterTooltip } from '@/components/ParameterTooltip'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  label?: ReactNode
  helpKey?: string
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function NumberInput({
  value,
  onChange,
  label,
  helpKey,
  min,
  max,
  step = 1,
  className,
  disabled,
}: NumberInputProps) {
  return (
    <label className={cn('flex items-center gap-2 text-sm text-ink', className)}>
      {label && <span className="flex-1">{label}</span>}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(n)
        }}
        className={cn(
          'h-8 w-20 rounded-md border border-line bg-cream-50 px-2 text-right',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      />
      {helpKey && <ParameterTooltip helpKey={helpKey} />}
    </label>
  )
}
