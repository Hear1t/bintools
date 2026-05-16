import type { PhyloSequence } from '@/types/phylo'

const GAP_OR_UNKNOWN = new Set(['-', '.', 'N', '?'])

/**
 * p-distance for aligned sequences.
 * = mismatches / valid-positions (skipping gaps and Ns on either side)
 */
export function pDistance(s1: string, s2: string): number {
  const len = Math.min(s1.length, s2.length)
  let mismatches = 0
  let valid = 0
  for (let i = 0; i < len; i++) {
    const a = s1[i]
    const b = s2[i]
    if (GAP_OR_UNKNOWN.has(a) || GAP_OR_UNKNOWN.has(b)) continue
    valid++
    if (a !== b) mismatches++
  }
  return valid === 0 ? 0 : mismatches / valid
}

/**
 * Extract all k-mers (as substrings) from a sequence.
 * Ignores k-mers containing gap/unknown chars.
 */
function extractKmers(seq: string, k: number): Set<string> {
  const out = new Set<string>()
  outer: for (let i = 0; i <= seq.length - k; i++) {
    const km = seq.slice(i, i + k)
    for (let j = 0; j < k; j++) {
      if (GAP_OR_UNKNOWN.has(km[j])) continue outer
    }
    out.add(km)
  }
  return out
}

/**
 * Jaccard distance on k-mer sets, alignment-free.
 * d = 1 - |A ∩ B| / |A ∪ B|
 */
export function kmerJaccard(s1: string, s2: string, k = 5): number {
  const a = extractKmers(s1, k)
  const b = extractKmers(s2, k)
  if (a.size === 0 && b.size === 0) return 0
  let inter = 0
  for (const km of a) if (b.has(km)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : 1 - inter / union
}

export type DistanceMethod = 'p-distance' | 'k-mer'

export function computeDistanceMatrix(
  seqs: PhyloSequence[],
  method: DistanceMethod,
): number[][] {
  const n = seqs.length
  const D: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d =
        method === 'p-distance'
          ? pDistance(seqs[i].sequence, seqs[j].sequence)
          : kmerJaccard(seqs[i].sequence, seqs[j].sequence)
      D[i][j] = d
      D[j][i] = d
    }
  }
  return D
}
