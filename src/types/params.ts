export type NormalizationMode = 'none' | 'zscore_row' | 'log2' | 'mean_center'
export type DistanceMetric = 'euclidean' | 'correlation' | 'manhattan'
export type LinkageMethod = 'ward' | 'complete' | 'average' | 'single'
export type ColorScheme =
  | 'red_blue'
  | 'white_red'
  | 'viridis'
  | 'magma'
  | 'green_yellow'
export type CellBorder = 'none' | 'thin' | 'medium'

export interface HeatmapParams {
  normalization: NormalizationMode
  clusterRows: boolean
  clusterCols: boolean
  distanceRow: DistanceMetric
  distanceCol: DistanceMetric
  linkageMethod: LinkageMethod
  colorScheme: ColorScheme
  colorRangeMode: 'auto' | 'manual'
  colorRangeMin: number
  colorRangeMax: number
  showRowNames: boolean
  showColNames: boolean
  rowFontSize: number
  colFontSize: number
  cellBorder: CellBorder
  width: number
  height: number
  fitWindow: boolean
}

export const DEFAULT_PARAMS: HeatmapParams = {
  normalization: 'zscore_row',
  clusterRows: true,
  clusterCols: true,
  distanceRow: 'euclidean',
  distanceCol: 'euclidean',
  linkageMethod: 'ward',
  colorScheme: 'red_blue',
  colorRangeMode: 'auto',
  colorRangeMin: -2,
  colorRangeMax: 2,
  showRowNames: true,
  showColNames: true,
  rowFontSize: 10,
  colFontSize: 10,
  cellBorder: 'thin',
  width: 800,
  height: 600,
  fitWindow: true,
}
