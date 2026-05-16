import { cn } from '@/lib/cn'
import type { ExampleDataset } from '@/data/examples'

interface ExampleDatasetCardProps {
  dataset: ExampleDataset
  onClick: () => void
}

export function ExampleDatasetCard({ dataset, onClick }: ExampleDatasetCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group text-left rounded-xl border border-line bg-cream-50 px-5 py-4',
        'transition-all duration-200',
        'hover:border-terracotta/35 hover:-translate-y-0.5',
        'hover:shadow-[0_10px_24px_-12px_rgba(204,120,92,0.18)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
      )}
    >
      <p className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors">
        {dataset.title}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{dataset.description}</p>
      <p className="mt-3 text-xs text-ink-subtle tracking-wider uppercase">
        {dataset.shape}
      </p>
    </button>
  )
}
