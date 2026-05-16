export interface OpenedExcelFile {
  name: string
  path: string
  bytes: Uint8Array
}

export interface BinToolsApi {
  openExcelFile: () => Promise<OpenedExcelFile | null>
}

declare global {
  interface Window {
    api: BinToolsApi
  }
}

export {}
