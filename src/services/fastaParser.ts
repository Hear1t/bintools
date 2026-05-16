import type { PhyloSequence } from '@/types/phylo'

/**
 * Parse FASTA text into a list of sequences.
 *
 * - Sequence name = first whitespace-delimited token after '>'
 * - Sequence content uppercased, whitespace stripped
 * - Empty headers and empty sequences are skipped
 */
export function parseFasta(text: string): PhyloSequence[] {
  const sequences: PhyloSequence[] = []
  let currentName: string | null = null
  let currentChunks: string[] = []

  const flush = () => {
    if (currentName !== null) {
      const seq = currentChunks.join('').toUpperCase()
      if (seq.length > 0) {
        sequences.push({ name: currentName, sequence: seq, length: seq.length })
      }
    }
    currentName = null
    currentChunks = []
  }

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('>')) {
      flush()
      const headerTokens = line.slice(1).trim().split(/\s+/)
      currentName = headerTokens[0] || ''
      if (!currentName) currentName = null
    } else if (currentName !== null) {
      currentChunks.push(line.replace(/\s/g, ''))
    }
  }
  flush()

  return sequences
}

export interface FastaValidationResult {
  ok: boolean
  sequences: PhyloSequence[]
  issue?:
    | 'empty'
    | 'too-few'        // < 3 sequences
    | 'duplicate-names'
    | 'invalid-chars'
  duplicateNames?: string[]
}

/** Basic check: at least 3 distinct named sequences. */
export function validateSequences(seqs: PhyloSequence[]): FastaValidationResult {
  if (seqs.length === 0) return { ok: false, sequences: seqs, issue: 'empty' }
  if (seqs.length < 3) return { ok: false, sequences: seqs, issue: 'too-few' }

  const seen = new Map<string, number>()
  const dups = new Set<string>()
  for (const s of seqs) {
    const c = (seen.get(s.name) ?? 0) + 1
    seen.set(s.name, c)
    if (c > 1) dups.add(s.name)
  }
  if (dups.size > 0) {
    return {
      ok: false, sequences: seqs, issue: 'duplicate-names',
      duplicateNames: Array.from(dups),
    }
  }

  return { ok: true, sequences: seqs }
}

/** True iff every sequence has identical length. */
export function detectAlignment(seqs: PhyloSequence[]): boolean {
  if (seqs.length < 2) return false
  const len = seqs[0].length
  return seqs.every((s) => s.length === len)
}
