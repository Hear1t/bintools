export interface BinToolsDataset {
  geneIds: string[]
  sampleIds: string[]
  matrix: number[][]
  missingCount: number
  totalCells: number
  duplicateGeneIds: string[]
  skippedRows: number
}

export type ValidationWarning =
  | { type: 'duplicate_genes'; count: number; sample: string[] }
  | { type: 'missing_values'; count: number; percent: number }
  | { type: 'zero_rows_skipped'; count: number }

export type ValidationResult =
  | {
      ok: true
      dataset: BinToolsDataset
      warnings: ValidationWarning[]
      geneColumnIndex: number
    }
  | {
      ok: false
      issue: 'no_string_first_col' | 'no_numeric_data' | 'empty_sheet'
      raw: { rows: unknown[][] }
    }
