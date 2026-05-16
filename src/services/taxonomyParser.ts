import type { TaxonomyLevel } from '@/types/network'

const LEVEL_PREFIX: Record<TaxonomyLevel, string> = {
  phylum: 'p__',
  class: 'c__',
  order: 'o__',
}

const LEVEL_INDEX: Record<TaxonomyLevel, number> = {
  phylum: 1,
  class: 2,
  order: 3,
}

export function parseTaxonomyLevel(
  taxonomy: string | undefined,
  level: TaxonomyLevel,
): string {
  if (!taxonomy) return 'Unclassified'
  const t = taxonomy.trim()
  if (!t) return 'Unclassified'

  // GreenGenes/QIIME format: k__Bacteria;p__Firmicutes;c__Bacilli;...
  if (t.includes('__')) {
    const prefix = LEVEL_PREFIX[level]
    const re = new RegExp(`${prefix}([^;]+)`, 'i')
    const m = t.match(re)
    if (m && m[1].trim()) return m[1].trim()
    return 'Unclassified'
  }

  // SILVA format: Bacteria;Firmicutes;Bacilli;...
  const parts = t.split(';').map(p => p.trim())
  const idx = LEVEL_INDEX[level]
  return parts[idx] && parts[idx].length > 0 ? parts[idx] : 'Unclassified'
}
