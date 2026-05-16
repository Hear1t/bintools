import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ParameterTooltip } from '@/components/ParameterTooltip'

interface SelectOption<T extends string> {
  value: T
  label: ReactNode
}

interface SelectProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  label?: ReactNode
  helpKey?: string
  className?: string
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  helpKey,
  className,
}: SelectProps<T>) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm', className)}>
      {label && (
        <span className="flex items-center gap-2 text-ink">
          <span className="flex-1">{label}</span>
          {helpKey && <ParameterTooltip helpKey={helpKey} />}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'h-8 rounded-md border border-line bg-cream-50 px-2 text-sm text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {typeof opt.label === 'string' ? opt.label : opt.value}
          </option>
        ))}
      </select>
    </label>
  )
}
