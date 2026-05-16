import { cn } from '@/lib/cn'

interface SheetSelectorProps {
  sheetNames: string[]
  currentIndex: number
  onChange: (index: number) => void
  className?: string
}

export function SheetSelector({
  sheetNames,
  currentIndex,
  onChange,
  className,
}: SheetSelectorProps) {
  if (sheetNames.length <= 1) return null
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <label className="text-xs text-ink-subtle uppercase tracking-wider">
        Sheet
      </label>
      <select
        value={currentIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-9 rounded-md border border-line bg-cream-50 px-3 text-sm text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
        )}
      >
        {sheetNames.map((name, i) => (
          <option key={i} value={i}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
