import { agnes, type Cluster } from 'ml-hclust'
import type { DistanceMetric, LinkageMethod } from '@/types/params'
import type { DendrogramNode } from '@/types/processed'

export interface ClusterResult {
  order: number[]
  tree: DendrogramNode
}

const linkageMap: Record<LinkageMethod, 'ward' | 'complete' | 'average' | 'single'> = {
  ward: 'ward',
  complete: 'complete',
  average: 'average',
  single: 'single',
}

function euclidean(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    sum += d * d
  }
  return Math.sqrt(sum)
}

function manhattan(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i])
  return sum
}

function correlationDistance(a: number[], b: number[]): number {
  const n = a.length
  let sumA = 0
  let sumB = 0
  for (let i = 0; i < n; i++) {
    sumA += a[i]
    sumB += b[i]
  }
  const meanA = sumA / n
  const meanB = sumB / n
  let num = 0
  let denA = 0
  let denB = 0
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA
    const db = b[i] - meanB
    num += da * db
    denA += da * da
    denB += db * db
  }
  const denom = Math.sqrt(denA * denB)
  if (denom === 0) return 1
  const correlation = num / denom
  return 1 - correlation
}

function pickDistance(
  metric: DistanceMetric,
): (a: number[], b: number[]) => number {
  if (metric === 'manhattan') return manhattan
  if (metric === 'correlation') return correlationDistance
  return euclidean
}

function fillNaNRow(row: number[]): number[] {
  return row.map((v) => (Number.isNaN(v) ? 0 : v))
}

function transpose(matrix: number[][]): number[][] {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const out: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c][r] = matrix[r][c]
    }
  }
  return out
}

function clusterToTree(cluster: Cluster): DendrogramNode {
  return {
    height: cluster.height,
    isLeaf: cluster.isLeaf,
    index: cluster.index,
    children: cluster.children.map(clusterToTree),
  }
}

export function clusterAxis(
  matrix: number[][],
  axis: 'row' | 'col',
  metric: DistanceMetric,
  linkage: LinkageMethod,
): ClusterResult {
  const oriented = axis === 'row' ? matrix : transpose(matrix)
  const vectors = oriented.map(fillNaNRow)
  if (vectors.length < 2) {
    return {
      order: vectors.map((_, i) => i),
      tree: { height: 0, isLeaf: true, index: 0, children: [] },
    }
  }
  const cluster = agnes(vectors, {
    distanceFunction: pickDistance(metric),
    method: linkageMap[linkage],
  })
  return {
    order: cluster.indices(),
    tree: clusterToTree(cluster),
  }
}
