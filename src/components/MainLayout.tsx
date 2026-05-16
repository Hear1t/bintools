import { useRef } from 'react'
import { TopBar } from '@/components/TopBar'
import { ParameterPanel } from '@/components/ParameterPanel'
import { HeatmapCanvas } from '@/components/HeatmapCanvas'
import { NetworkCanvas } from '@/components/NetworkCanvas'
import { NetworkParamPanel } from '@/components/NetworkParamPanel'

type ActiveTab = 'heatmap' | 'network'

interface MainLayoutProps {
  onReupload: () => void
  initialTab: ActiveTab
}

export function MainLayout({ onReupload, initialTab }: MainLayoutProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const networkSvgRef = useRef<SVGSVGElement>(null)

  const getExportElement = (): HTMLElement | null => {
    if (initialTab === 'heatmap') return plotRef.current
    return networkSvgRef.current?.parentElement ?? null
  }

  return (
    <div className="h-screen flex flex-col bg-cream">
      <TopBar
        getPlotElement={getExportElement}
        activeTab={initialTab}
        onBackHome={onReupload}
      />
      <div className="flex-1 flex overflow-hidden">
        {initialTab === 'heatmap' ? (
          <>
            <ParameterPanel onReupload={onReupload} />
            <HeatmapCanvas plotRef={plotRef} />
          </>
        ) : (
          <>
            <NetworkParamPanel />
            <NetworkCanvas networkSvgRef={networkSvgRef} />
          </>
        )}
      </div>
    </div>
  )
}
