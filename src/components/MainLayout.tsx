import { useRef } from 'react'
import { TopBar } from '@/components/TopBar'
import { ParameterPanel } from '@/components/ParameterPanel'
import { HeatmapCanvas } from '@/components/HeatmapCanvas'
import { NetworkCanvas } from '@/components/NetworkCanvas'
import { NetworkParamPanel } from '@/components/NetworkParamPanel'
import { PhyloCanvas } from '@/components/PhyloCanvas'
import { PhyloParamPanel } from '@/components/PhyloParamPanel'

type ActiveTab = 'heatmap' | 'network' | 'phylo'

interface MainLayoutProps {
  onReupload: () => void
  initialTab: ActiveTab
}

export function MainLayout({ onReupload, initialTab }: MainLayoutProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const networkSvgRef = useRef<SVGSVGElement>(null)
  const phyloSvgRef = useRef<SVGSVGElement>(null)

  const getExportElement = (): HTMLElement | null => {
    if (initialTab === 'heatmap') return plotRef.current
    if (initialTab === 'network') return networkSvgRef.current?.parentElement ?? null
    return phyloSvgRef.current?.parentElement ?? null
  }

  return (
    <div className="h-screen flex flex-col bg-cream">
      <TopBar
        getPlotElement={getExportElement}
        activeTab={initialTab}
        onBackHome={onReupload}
      />
      <div className="flex-1 flex overflow-hidden">
        {initialTab === 'heatmap' && (
          <>
            <ParameterPanel onReupload={onReupload} />
            <HeatmapCanvas plotRef={plotRef} />
          </>
        )}
        {initialTab === 'network' && (
          <>
            <NetworkParamPanel />
            <NetworkCanvas networkSvgRef={networkSvgRef} />
          </>
        )}
        {initialTab === 'phylo' && (
          <>
            <PhyloParamPanel />
            <PhyloCanvas svgRef={phyloSvgRef} />
          </>
        )}
      </div>
    </div>
  )
}
