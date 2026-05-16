import * as XLSX from 'xlsx'
import type { ParsedFile, RawSheet } from '@/types/sheet'

export async function loadExcelFromUpload(): Promise<ParsedFile | null> {
  const file = await window.api.openExcelFile()
  if (!file) return null
  return parseExcelBytes(file.bytes, file.name)
}

export function parseExcelBytes(bytes: Uint8Array, fileName: string): ParsedFile {
  const workbook = XLSX.read(bytes, { type: 'array' })
  const sheets: RawSheet[] = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: null,
      blankrows: false,
    })
    return { name, rows }
  })
  return { source: 'file', fileName, sheets }
}
