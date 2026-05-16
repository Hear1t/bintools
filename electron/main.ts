import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'BinTools',
    backgroundColor: '#0A0A0A',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

ipcMain.handle('dialog:openExcel', async () => {
  if (!mainWindow) return null
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择 Excel 文件',
    properties: ['openFile'],
    filters: [{ name: 'Excel 表格', extensions: ['xlsx', 'xls'] }],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  const filePath = result.filePaths[0]
  const buffer = await readFile(filePath)
  return {
    name: path.basename(filePath),
    path: filePath,
    bytes: new Uint8Array(buffer),
  }
})

ipcMain.handle('dialog:openFasta', async () => {
  if (!mainWindow) return null
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择 FASTA 文件',
    properties: ['openFile'],
    filters: [
      { name: 'FASTA 序列', extensions: ['fasta', 'fa', 'fna', 'ffn', 'faa', 'frn', 'txt'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  const filePath = result.filePaths[0]
  const buffer = await readFile(filePath, 'utf8')
  return {
    name: path.basename(filePath),
    path: filePath,
    content: buffer,
  }
})

interface SaveDialogArgs {
  defaultName: string
  filterName: string
  extensions: string[]
}

ipcMain.handle(
  'dialog:saveFile',
  async (_event, args: SaveDialogArgs): Promise<string | null> => {
    if (!mainWindow) return null
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: args.defaultName,
      filters: [{ name: args.filterName, extensions: args.extensions }],
    })
    if (result.canceled || !result.filePath) return null
    return result.filePath
  },
)

interface WriteFileArgs {
  filePath: string
  bytes: Uint8Array
}

ipcMain.handle(
  'file:write',
  async (_event, args: WriteFileArgs): Promise<{ ok: boolean; error?: string }> => {
    try {
      await writeFile(args.filePath, Buffer.from(args.bytes))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  },
)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})
