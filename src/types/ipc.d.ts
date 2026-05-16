export interface OpenedExcelFile {
  name: string
  path: string
  bytes: Uint8Array
}

export interface SaveDialogArgs {
  defaultName: string
  filterName: string
  extensions: string[]
}

export interface WriteFileArgs {
  filePath: string
  bytes: Uint8Array
}

export interface BinToolsApi {
  openExcelFile: () => Promise<OpenedExcelFile | null>
  showSaveDialog: (args: SaveDialogArgs) => Promise<string | null>
  writeFile: (args: WriteFileArgs) => Promise<{ ok: boolean; error?: string }>
}

declare global {
  interface Window {
    api: BinToolsApi
  }
}

export {}
