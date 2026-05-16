import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ParameterTooltip } from '@/components/ParameterTooltip'

interface RadioOption<T extends string> {
  value: T
  label: ReactNode
  helpKey?: string
}

interface RadioGroupProps<T extends string> {
  name: string
  value: T
  onChange: (value: T) => void
  options: RadioOption<T>[]
  className?: string
}

export function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  className,
}: RadioGroupProps<T>) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm text-ink cursor-pointer"
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'h-4 w-4 rounded-full border border-line bg-cream-50',
                'peer-checked:border-terracotta peer-checked:border-[5px]',
                'transition-colors',
              )}
            />
          </span>
          <span className="flex-1">{opt.label}</span>
          {opt.helpKey && <ParameterTooltip helpKey={opt.helpKey} />}
        </label>
      ))}
    </div>
  )
}
