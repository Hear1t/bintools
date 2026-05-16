import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface TopBarProps {
  onExport?: () => void
}

export function TopBar({ onExport }: TopBarProps) {
  return (
    <header className="h-14 shrink-0 border-b border-line bg-cream flex items-center justify-between px-6">
      <h1 className="font-serif text-xl text-ink">BinTools</h1>
      <Button size="sm" variant="primary" onClick={onExport}>
        导出
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
      </Button>
    </header>
  )
}
