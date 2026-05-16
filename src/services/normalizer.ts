import type { NormalizationMode } from '@/types/params'

export function normalize(
  matrix: number[][],
  mode: NormalizationMode,
): number[][] {
  if (mode === 'none') return matrix.map((row) => [...row])
  if (mode === 'log2') return matrix.map((row) => row.map(safeLog2))
  if (mode === 'mean_center') return matrix.map(meanCenterRow)
  return matrix.map(zscoreRow)
}

function safeLog2(value: number): number {
  if (Number.isNaN(value)) return Number.NaN
  return Math.log2(value + 1)
}

function rowMean(row: number[]): number {
  let sum = 0
  let count = 0
  for (const v of row) {
    if (!Number.isNaN(v)) {
      sum += v
      count++
    }
  }
  return count > 0 ? sum / count : 0
}

function rowStd(row: number[], mean: number): number {
  let sum = 0
  let count = 0
  for (const v of row) {
    if (!Number.isNaN(v)) {
      sum += (v - mean) ** 2
      count++
    }
  }
  return count > 1 ? Math.sqrt(sum / (count - 1)) : 0
}

function zscoreRow(row: number[]): number[] {
  const mean = rowMean(row)
  const std = rowStd(row, mean)
  if (std === 0) return row.map((v) => (Number.isNaN(v) ? Number.NaN : 0))
  return row.map((v) => (Number.isNaN(v) ? Number.NaN : (v - mean) / std))
}

function meanCenterRow(row: number[]): number[] {
  const mean = rowMean(row)
  return row.map((v) => (Number.isNaN(v) ? Number.NaN : v - mean))
}
