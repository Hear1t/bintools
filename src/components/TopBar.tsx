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
  heatmap: '热图',
  network: '共现网络',
}

export function TopBar({ getPlotElement, activeTab, onBackHome }: TopBarProps) {
  return (
    <header
      className={cn(
        'h-14 shrink-0 flex items-center justify-between px-6 relative z-10',
        'bg-cream/85 backdrop-blur-md',
        'border-b border-line/50',
        'shadow-[0_1px_0_rgba(228,224,214,0.6),0_4px_12px_-8px_rgba(45,42,38,0.08)]',
      )}
    >
      {/* Back to home — prominent but tasteful */}
      <button
        onClick={onBackHome}
        className={cn(
          'group inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium',
          'text-terracotta border border-terracotta/35',
          'hover:bg-terracotta/8 hover:border-terracotta/60',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
        )}
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          strokeWidth={2}
        />
        返回首页
      </button>

      {/* Current view title */}
      <h1 className="font-serif text-xl text-ink">
        BinTools <span className="text-ink-muted font-normal">· {TAB_LABEL[activeTab]}</span>
      </h1>

      <ExportMenu getPlotElement={getPlotElement} />
    </header>
  )
}
