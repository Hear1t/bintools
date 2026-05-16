import { ArrowLeft } from 'lucide-react'
import { ExportMenu } from '@/components/ExportMenu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/cn'

type ActiveTab = 'heatmap' | 'network'

interface TopBarProps {
  getPlotElement: () => HTMLElement | null
  activeTab: ActiveTab
  onBackHome: () => void
}

const TAB_LABEL: Record<ActiveTab, string> = {
  heatmap: 'HEATMAP',
  network: 'NETWORK',
}

export function TopBar({ getPlotElement, activeTab, onBackHome }: TopBarProps) {
  return (
    <header
      className={cn(
        'h-12 shrink-0 flex items-center justify-between px-5 relative z-10',
        'bg-cream text-ink',
        'border-b border-line',
      )}
    >
      <button
        onClick={onBackHome}
        className={cn(
          'group inline-flex items-center gap-2 h-7 px-3',
          'font-mono text-[11px] uppercase tracking-wider',
          'text-terracotta border border-terracotta/40',
          'hover:bg-terracotta/10 hover:border-terracotta',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terracotta',
        )}
      >
        <ArrowLeft
          className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
          strokeWidth={2}
        />
        [ HOME ]
      </button>

      <div className="font-mono text-[12px] tracking-wider flex items-center gap-2">
        <span className="text-ink-subtle">BINTOOLS</span>
        <span className="text-ink-faint">/</span>
        <span className="text-terracotta">{TAB_LABEL[activeTab]}</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle size="sm" />
        <ExportMenu getPlotElement={getPlotElement} />
      </div>
    </header>
  )
}
