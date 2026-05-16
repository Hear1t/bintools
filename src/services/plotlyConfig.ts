import type { ProcessedDataset } from '@/types/processed'
import type { HeatmapParams } from '@/types/params'
import { colorScales } from '@/data/colorSchemes'

export interface PlotlyFigure {
  data: unknown[]
  layout: unknown
  config: unknown
}

function reorderMatrix(
  matrix: number[][],
  rowOrder: number[],
  colOrder: number[],
): number[][] {
  return rowOrder.map((r) => colOrder.map((c) => matrix[r][c]))
}

function reorder<T>(arr: T[], order: number[]): T[] {
  return order.map((i) => arr[i])
}

function computeRange(matrix: number[][]): { min: number; max: number } {
  let min = Infinity
  let max = -Infinity
  for (const row of matrix) {
    for (const v of row) {
      if (!Number.isNaN(v)) {
        if (v < min) min = v
        if (v > max) max = v
      }
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: -1, max: 1 }
  }
  return { min, max }
}

export function buildHeatmapFigure(
  processed: ProcessedDataset,
  params: HeatmapParams,
): PlotlyFigure {
  const orderedMatrix = reorderMatrix(
    processed.matrix,
    processed.rowOrder,
    processed.colOrder,
  )
  const orderedGenes = reorder(processed.geneIds, processed.rowOrder)
  const orderedSamples = reorder(processed.sampleIds, processed.colOrder)

  const range =
    params.colorRangeMode === 'manual'
      ? { min: params.colorRangeMin, max: params.colorRangeMax }
      : computeRange(orderedMatrix)

  const xgap =
    params.cellBorder === 'medium' ? 4 : params.cellBorder === 'thin' ? 2 : 0
  const ygap = xgap

  const data = [
    {
      type: 'heatmap',
      z: orderedMatrix,
      x: orderedSamples,
      y: orderedGenes,
      colorscale: colorScales[params.colorScheme],
      zmin: range.min,
      zmax: range.max,
      xgap,
      ygap,
      hovertemplate:
        '<b>%{y}</b> · %{x}<br>值：%{z:.3f}<extra></extra>',
      colorbar: {
        thickness: 12,
        len: 0.7,
        outlinewidth: 0,
        tickfont: { family: 'Inter', size: 10, color: '#6B6660' },
      },
    },
  ]

  const layout = {
    autosize: params.fitWindow,
    width: params.fitWindow ? undefined : params.width,
    height: params.fitWindow ? undefined : params.height,
    margin: { l: 90, r: 60, t: 30, b: 90 },
    paper_bgcolor: '#FAF9F5',
    plot_bgcolor: '#FAF9F5',
    font: { family: 'Inter', color: '#2D2A26' },
    xaxis: {
      showgrid: false,
      zeroline: false,
      tickangle: -45,
      tickfont: {
        family: 'Inter',
        size: params.colFontSize,
        color: '#2D2A26',
      },
      showticklabels: params.showColNames,
      automargin: true,
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      autorange: 'reversed',
      tickfont: {
        family: 'Inter',
        size: params.rowFontSize,
        color: '#2D2A26',
      },
      showticklabels: params.showRowNames,
      automargin: true,
    },
  }

  const config = {
    displayModeBar: false,
    responsive: true,
  }

  return { data, layout, config }
}
