import { contextBridge, ipcRenderer } from 'electron'

export interface OpenedExcelFile {
  name: string
  path: string
  bytes: Uint8Array
}

const api = {
  openExcelFile: (): Promise<OpenedExcelFile | null> =>
    ipcRenderer.invoke('dialog:openExcel'),
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
