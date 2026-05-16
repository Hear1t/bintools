import { ArrowLeft } from 'lucide-react'
import { ExportMenu } from '@/components/ExportMenu'
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
        'bg-[#0A0A0A] text-zinc-100',
        'border-b border-zinc-800',
      )}
    >
      {/* Back home */}
      <button
        onClick={onBackHome}
        className={cn(
          'group inline-flex items-center gap-2 h-7 px-3',
          'font-mono text-[11px] uppercase tracking-wider',
          'text-orange-500 border border-orange-500/40',
          'hover:bg-orange-500/10 hover:border-orange-500',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500',
        )}
      >
        <ArrowLeft
          className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
          strokeWidth={2}
        />
        [ HOME ]
      </button>

      {/* Path / current view */}
      <div className="font-mono text-[12px] tracking-wider flex items-center gap-2">
        <span className="text-zinc-600">BINTOOLS</span>
        <span className="text-zinc-700">/</span>
        <span className="text-orange-500">{TAB_LABEL[activeTab]}</span>
      </div>

      <ExportMenu getPlotElement={getPlotElement} />
    </header>
  )
}
