import { contextBridge, ipcRenderer } from 'electron'

export interface OpenedExcelFile {
  name: string
  path: string
  bytes: Uint8Array
}

const api = {
  openExcelFile: (): Promise<OpenedExcelFile | null> =>
    ipcRenderer.invoke('dialog:openExcel'),
  showSaveDialog: (args: {
    defaultName: string
    filterName: string
    extensions: string[]
  }): Promise<string | null> => ipcRenderer.invoke('dialog:saveFile', args),
  writeFile: (args: {
    filePath: string
    bytes: Uint8Array
  }): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke('file:write', args),
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
