import { ExportMenu } from '@/components/ExportMenu'

interface TopBarProps {
  getPlotElement: () => HTMLElement | null
}

export function TopBar({ getPlotElement }: TopBarProps) {
  return (
    <header className="h-14 shrink-0 border-b border-line bg-cream flex items-center justify-between px-6">
      <h1 className="font-serif text-xl text-ink">BinTools</h1>
      <ExportMenu getPlotElement={getPlotElement} />
    </header>
  )
}
