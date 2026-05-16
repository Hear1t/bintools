/**
 * Extract group name from a sequence name by splitting on the first
 * occurring separator. If only one group emerges (all sequences share
 * the same prefix or none have separators), returns null to signal
 * "no meaningful grouping".
 */

const SEPARATORS = ['_', '|', '-', '/']

export function extractGroup(name: string): string {
  for (const sep of SEPARATORS) {
    const idx = name.indexOf(sep)
    if (idx > 0) return name.slice(0, idx)
  }
  return name  // no separator → whole name is its own group
}

const PALETTE = [
  '#7BAFD4', '#F4A8B0', '#F5C842', '#E8A87C', '#9B59B6',
  '#27AE60', '#5DADE2', '#E67E22', '#2C3E50', '#1ABC9C',
  '#C0392B', '#F39C12', '#A569BD', '#D35400', '#85C1E9',
  '#F1948A', '#82E0AA', '#F0B27A',
]

export function assignGroupColors(names: string[]): {
  perName: Record<string, string>
  perGroup: Record<string, string>
  groupOfName: Record<string, string>
} {
  const groupOfName: Record<string, string> = {}
  const uniqueGroups: string[] = []
  for (const n of names) {
    const g = extractGroup(n)
    groupOfName[n] = g
    if (!uniqueGroups.includes(g)) uniqueGroups.push(g)
  }

  const perGroup: Record<string, string> = {}
  uniqueGroups.forEach((g, i) => {
    perGroup[g] = PALETTE[i % PALETTE.length]
  })

  const perName: Record<string, string> = {}
  for (const n of names) perName[n] = perGroup[groupOfName[n]]

  return { perName, perGroup, groupOfName }
}
