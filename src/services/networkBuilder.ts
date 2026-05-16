import type { BinToolsDataset } from '@/types/data'
import type { NetworkData, NetworkNode, NetworkEdge, NetworkParams } from '@/types/network'
import { computeCorrelations } from '@/services/correlation'
import { parseTaxonomyLevel } from '@/services/taxonomyParser'

const KNOWN_PHYLUM_COLORS: Record<string, string> = {
  Proteobacteria: '#7BAFD4',
  Firmicutes: '#F4A8B0',
  Bacteroidota: '#F5C842',
  Bacteroidetes: '#F5C842',
  Actinobacteria: '#E8A87C',
  Actinobacteriota: '#E8A87C',
  Actinomycetota: '#E8A87C',
  Verrucomicrobiota: '#9B59B6',
  Verrucomicrobia: '#9B59B6',
  Chloroflexi: '#27AE60',
  Chloroflexota: '#27AE60',
  Acidobacteriota: '#5DADE2',
  Acidobacteria: '#5DADE2',
  Planctomycetes: '#E67E22',
  Planctomycetota: '#E67E22',
  Nitrospirota: '#2C3E50',
  Crenarchaeota: '#1ABC9C',
  Thermoplasmatota: '#C0392B',
  Myxococcota: '#F39C12',
  Patescibacteria: '#A569BD',
  Bdellovibrionota: '#D35400',
  Unclassified: '#BDC3C7',
  unidentified: '#BDC3C7',
}

const EXTRA_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#82E0AA', '#F1948A',
  '#AEB6BF', '#85C1E9', '#F0B27A', '#A9DFBF', '#D2B4DE',
]

// Stable color cache across renders for consistent phylum colors
const dynamicColorCache = new Map<string, string>()
let dynamicColorIdx = 0

export function getPhylumColor(phylum: string): string {
  if (KNOWN_PHYLUM_COLORS[phylum]) return KNOWN_PHYLUM_COLORS[phylum]
  if (dynamicColorCache.has(phylum)) return dynamicColorCache.get(phylum)!
  const color = EXTRA_COLORS[dynamicColorIdx % EXTRA_COLORS.length]
  dynamicColorIdx++
  dynamicColorCache.set(phylum, color)
  return color
}

export function buildNetworkData(
  dataset: BinToolsDataset,
  params: NetworkParams,
): NetworkData {
  const { geneIds, matrix, taxonLabels } = dataset
  const empty: NetworkData = {
    nodes: [], edges: [],
    stats: { nodeCount: 0, edgeCount: 0, positiveCount: 0, negativeCount: 0 },
  }

  if (geneIds.length < 2) return empty

  const pairs = computeCorrelations(matrix, params.method)

  const pField = params.useFDR ? 'adjPValue' : 'pValue'
  const filtered = pairs.filter(
    p => Math.abs(p.r) >= params.rThreshold && p[pField] <= params.pThreshold,
  )

  if (filtered.length === 0) return empty

  // Degree map
  const degreeMap = new Map<number, number>()
  for (const { i, j } of filtered) {
    degreeMap.set(i, (degreeMap.get(i) ?? 0) + 1)
    degreeMap.set(j, (degreeMap.get(j) ?? 0) + 1)
  }

  // Hub threshold: 90th percentile of degrees
  const sortedDegrees = Array.from(degreeMap.values()).sort((a, b) => a - b)
  const hubThreshold =
    sortedDegrees.length > 1
      ? (sortedDegrees[Math.floor(sortedDegrees.length * 0.9)] ?? 1)
      : Infinity // if only 1 node, no hub

  // Unique node indices in filtered edges
  const nodeIndexSet = new Set<number>()
  for (const { i, j } of filtered) { nodeIndexSet.add(i); nodeIndexSet.add(j) }

  const nodes: NetworkNode[] = Array.from(nodeIndexSet).map(idx => {
    const phylum = parseTaxonomyLevel(taxonLabels?.[idx], params.taxonomyLevel)
    const degree = degreeMap.get(idx) ?? 0
    return {
      id: geneIds[idx],
      label: geneIds[idx],
      phylum,
      phylumColor: getPhylumColor(phylum),
      degree,
      isHub: degree >= hubThreshold,
    }
  })

  const edges: NetworkEdge[] = filtered.map(({ i, j, r, pValue, adjPValue }) => ({
    source: geneIds[i],
    target: geneIds[j],
    r,
    pValue,
    adjPValue,
  }))

  const positiveCount = edges.filter(e => e.r > 0).length

  return {
    nodes,
    edges,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      positiveCount,
      negativeCount: edges.length - positiveCount,
    },
  }
}
