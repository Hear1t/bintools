import { useRef } from 'react'
import { TopBar } from '@/components/TopBar'
import { ParameterPanel } from '@/components/ParameterPanel'
import { HeatmapCanvas } from '@/components/HeatmapCanvas'

interface MainLayoutProps {
  onReupload: () => void
}

export function MainLayout({ onReupload }: MainLayoutProps) {
  const plotRef = useRef<HTMLDivElement>(null)

  return (
    <div className="h-screen flex flex-col bg-cream">
      <TopBar getPlotElement={() => plotRef.current} />
      <div className="flex-1 flex overflow-hidden">
        <ParameterPanel onReupload={onReupload} />
        <HeatmapCanvas plotRef={plotRef} />
      </div>
    </div>
  )
}
