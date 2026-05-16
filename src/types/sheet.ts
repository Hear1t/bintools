export interface RawSheet {
  name: string
  rows: unknown[][]
}

export interface ParsedFile {
  source: 'file' | 'example'
  fileName: string
  sheets: RawSheet[]
}
