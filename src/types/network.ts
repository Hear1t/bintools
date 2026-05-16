export type CorrelationMethod = 'spearman' | 'pearson'
export type TaxonomyLevel = 'phylum' | 'class' | 'order'

export interface NetworkNode {
  id: string
  label: string
  phylum: string
  phylumColor: string
  degree: number
  isHub: boolean
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export interface NetworkEdge {
  // D3 replaces string ids with node references after simulation init
  source: string | NetworkNode
  target: string | NetworkNode
  r: number
  pValue: number
  adjPValue: number
}

export interface NetworkStats {
  nodeCount: number
  edgeCount: number
  positiveCount: number
  negativeCount: number
}

export interface NetworkData {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  stats: NetworkStats
}

export interface NetworkParams {
  method: CorrelationMethod
  rThreshold: number
  pThreshold: number
  useFDR: boolean
  taxonomyLevel: TaxonomyLevel
  positiveColor: string
  negativeColor: string
  showLabels: boolean
}

export const DEFAULT_NETWORK_PARAMS: NetworkParams = {
  method: 'spearman',
  rThreshold: 0.6,
  pThreshold: 0.05,
  useFDR: true,
  taxonomyLevel: 'phylum',
  positiveColor: '#E05252',
  negativeColor: '#52A0E0',
  showLabels: true,
}
