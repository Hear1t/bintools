import { useEffect, type RefObject } from 'react'
import Plotly from 'plotly.js-dist-min'
import { useProcessedData } from '@/hooks/useProcessedData'
import { useAppStore } from '@/store/appStore'
import { useThemeStore } from '@/store/themeStore'
import { buildHeatmapFigure } from '@/services/plotlyConfig'

interface HeatmapCanvasProps {
  plotRef: RefObject<HTMLDivElement>
}

export function HeatmapCanvas({ plotRef }: HeatmapCanvasProps) {
  const processed = useProcessedData()
  const params = useAppStore((s) => s.params)
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const el = plotRef.current
    if (!el || !processed) return

    const figure = buildHeatmapFigure(processed, params, theme)
    Plotly.react(el, figure.data as any, figure.layout as any, figure.config as any)

    return () => {
      Plotly.purge(el)
    }
  }, [processed, params, theme, plotRef])

  useEffect(() => {
    if (!params.fitWindow) return
    const handleResize = () => {
      if (plotRef.current) Plotly.Plots.resize(plotRef.current)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [params.fitWindow, plotRef])

  if (!processed) {
    return (
      <main className="flex-1 overflow-auto bg-cream-100">
        <div className="h-full flex items-center justify-center text-ink-subtle">
          等待数据
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-auto bg-cream-100 relative">
      {processed.warning && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-md bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 backdrop-blur-sm">
          {processed.warning}
        </div>
      )}
      <div
        ref={plotRef}
        className="w-full h-full"
        style={params.fitWindow ? undefined : { width: params.width, height: params.height }}
      />
    </main>
  )
}
