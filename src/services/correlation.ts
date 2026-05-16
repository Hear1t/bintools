// Abramowitz & Stegun approximation for erf, max error ~1.5e-7
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  return Math.sign(x) * (1 - poly * Math.exp(-x * x))
}

function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

function rankArray(arr: number[]): number[] {
  const n = arr.length
  const indexed = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
  const ranks = new Array<number>(n)
  let i = 0
  while (i < n) {
    let j = i
    while (j < n - 1 && indexed[j + 1].v === indexed[j].v) j++
    const avgRank = (i + j) / 2 + 1
    for (let k = i; k <= j; k++) ranks[indexed[k].i] = avgRank
    i = j + 1
  }
  return ranks
}

function pearsonCorr(x: number[], y: number[]): number {
  const n = x.length
  let sumX = 0, sumY = 0
  for (let i = 0; i < n; i++) { sumX += x[i]; sumY += y[i] }
  const mx = sumX / n, my = sumY / n
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) {
    const ex = x[i] - mx, ey = y[i] - my
    num += ex * ey; dx += ex * ex; dy += ey * ey
  }
  const denom = Math.sqrt(dx * dy)
  return denom < 1e-10 ? 0 : num / denom
}

function spearmanCorr(x: number[], y: number[]): number {
  return pearsonCorr(rankArray(x), rankArray(y))
}

// Fisher's z-transformation p-value (two-tailed)
function pValueFromR(r: number, n: number): number {
  if (n <= 3 || Math.abs(r) >= 1) return 1
  const z = 0.5 * Math.log((1 + Math.abs(r)) / (1 - Math.abs(r)))
  const zScore = z * Math.sqrt(n - 3)
  return 2 * (1 - normalCDF(zScore))
}

// Benjamini-Hochberg FDR correction
function bhFDR(pValues: number[]): number[] {
  const n = pValues.length
  if (n === 0) return []
  const indexed = pValues.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p)
  const adj = new Array<number>(n)
  let minAdj = 1
  for (let k = n - 1; k >= 0; k--) {
    minAdj = Math.min(Math.min((indexed[k].p * n) / (k + 1), 1), minAdj)
    adj[indexed[k].i] = minAdj
  }
  return adj
}

export interface CorrelationPair {
  i: number
  j: number
  r: number
  pValue: number
  adjPValue: number
}

export function computeCorrelations(
  matrix: number[][],
  method: 'spearman' | 'pearson',
): CorrelationPair[] {
  const n = matrix.length
  const m = matrix[0]?.length ?? 0
  const pairs: CorrelationPair[] = []
  const rawP: number[] = []

  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      const rowA = matrix[a]
      const rowB = matrix[b]

      // Collect indices where both rows have valid (non-NaN) values
      const validIdx: number[] = []
      for (let k = 0; k < m; k++) {
        if (!Number.isNaN(rowA[k]) && !Number.isNaN(rowB[k])) validIdx.push(k)
      }
      if (validIdx.length < 4) continue

      const xVals = validIdx.map(k => rowA[k])
      const yVals = validIdx.map(k => rowB[k])

      const r = method === 'spearman' ? spearmanCorr(xVals, yVals) : pearsonCorr(xVals, yVals)
      if (Number.isNaN(r)) continue

      const p = pValueFromR(r, validIdx.length)
      pairs.push({ i: a, j: b, r, pValue: p, adjPValue: p })
      rawP.push(p)
    }
  }

  // Apply BH-FDR in-place
  const adj = bhFDR(rawP)
  for (let k = 0; k < pairs.length; k++) pairs[k].adjPValue = adj[k]

  return pairs
}
