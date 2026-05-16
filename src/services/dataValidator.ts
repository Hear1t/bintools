import type { RawSheet } from '@/types/sheet'
import type {
  BinToolsDataset,
  ValidationResult,
  ValidationWarning,
} from '@/types/data'

const MISSING_TOKENS = new Set(['', '-', 'na', 'n/a', 'nan', 'null', '.'])

function isMissing(cell: unknown): boolean {
  if (cell === null || cell === undefined) return true
  if (typeof cell === 'number' && Number.isNaN(cell)) return true
  if (typeof cell === 'string') {
    const s = cell.trim().toLowerCase()
    return MISSING_TOKENS.has(s)
  }
  return false
}

function toNumber(cell: unknown): number {
  if (isMissing(cell)) return Number.NaN
  if (typeof cell === 'number') return cell
  const n = Number(String(cell).trim())
  return Number.isFinite(n) ? n : Number.NaN
}

function isStringy(cell: unknown): boolean {
  if (typeof cell === 'string') {
    const s = cell.trim()
    if (s === '') return false
    return Number.isNaN(Number(s))
  }
  return false
}

function detectGeneColumn(rows: unknown[][]): number {
  if (rows.length < 2) return -1
  const dataRows = rows.slice(1)
  const colCount = rows[0]?.length ?? 0
  for (let col = 0; col < colCount; col++) {
    const sample = dataRows.slice(0, Math.min(10, dataRows.length))
    const stringCount = sample.filter((r) => isStringy(r[col])).length
    if (stringCount >= sample.length * 0.8) return col
  }
  return -1
}

function dedupeGeneIds(ids: string[]): { ids: string[]; duplicates: string[] } {
  const seen = new Map<string, number>()
  const out: string[] = []
  const duplicates = new Set<string>()
  for (const id of ids) {
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    if (count === 0) {
      out.push(id)
    } else {
      out.push(`${id}_${count + 1}`)
      duplicates.add(id)
    }
  }
  return { ids: out, duplicates: Array.from(duplicates) }
}

export function validateSheet(
  sheet: RawSheet,
  geneColumnOverride?: number,
): ValidationResult {
  const rows = sheet.rows
  if (rows.length < 2) {
    return { ok: false, issue: 'empty_sheet', raw: { rows } }
  }

  const geneColumnIndex =
    geneColumnOverride !== undefined ? geneColumnOverride : detectGeneColumn(rows)

  if (geneColumnIndex < 0) {
    return { ok: false, issue: 'no_string_first_col', raw: { rows } }
  }

  const header = rows[0]
  const dataRows = rows.slice(1)
  const colCount = header.length

  const sampleIndices: number[] = []
  for (let c = 0; c < colCount; c++) {
    if (c !== geneColumnIndex) sampleIndices.push(c)
  }

  if (sampleIndices.length === 0) {
    return { ok: false, issue: 'no_numeric_data', raw: { rows } }
  }

  const sampleIds = sampleIndices.map((c) => String(header[c] ?? `Sample_${c + 1}`))

  const rawGeneIds: string[] = []
  const matrix: number[][] = []
  let missingCount = 0
  let totalCells = 0
  let skippedRows = 0

  for (const row of dataRows) {
    const rawGene = row[geneColumnIndex]
    if (rawGene === null || rawGene === undefined || String(rawGene).trim() === '') {
      skippedRows++
      continue
    }
    const values = sampleIndices.map((c) => toNumber(row[c]))
    const allZeroOrMissing = values.every(
      (v) => Number.isNaN(v) || v === 0,
    )
    if (allZeroOrMissing) {
      skippedRows++
      continue
    }
    const rowMissing = values.filter((v) => Number.isNaN(v)).length
    missingCount += rowMissing
    totalCells += values.length
    rawGeneIds.push(String(rawGene).trim())
    matrix.push(values)
  }

  if (matrix.length === 0) {
    return { ok: false, issue: 'no_numeric_data', raw: { rows } }
  }

  const { ids: geneIds, duplicates } = dedupeGeneIds(rawGeneIds)

  const warnings: ValidationWarning[] = []
  if (duplicates.length > 0) {
    warnings.push({
      type: 'duplicate_genes',
      count: duplicates.length,
      sample: duplicates.slice(0, 3),
    })
  }
  if (missingCount > 0) {
    const percent = (missingCount / totalCells) * 100
    warnings.push({ type: 'missing_values', count: missingCount, percent })
  }
  if (skippedRows > 0) {
    warnings.push({ type: 'zero_rows_skipped', count: skippedRows })
  }

  const dataset: BinToolsDataset = {
    geneIds,
    sampleIds,
    matrix,
    missingCount,
    totalCells,
    duplicateGeneIds: duplicates,
    skippedRows,
  }

  return { ok: true, dataset, warnings, geneColumnIndex }
}
