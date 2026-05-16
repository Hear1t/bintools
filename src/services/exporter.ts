import Plotly from 'plotly.js-dist-min'
import { jsPDF } from 'jspdf'
import { svg2pdf } from 'svg2pdf.js'

export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf'

interface ExportOptions {
  width: number
  height: number
  scale?: number
}

export interface ExportResult {
  ok: boolean
  filePath?: string
  error?: string
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function rasterBytes(
  el: HTMLElement,
  format: 'png' | 'jpeg',
  opts: ExportOptions,
): Promise<Uint8Array> {
  const dataUrl = await Plotly.toImage(el, {
    format,
    width: opts.width,
    height: opts.height,
    scale: opts.scale ?? 2,
  })
  const base64 = dataUrl.split(',')[1] ?? ''
  return base64ToBytes(base64)
}

async function svgString(
  el: HTMLElement,
  opts: ExportOptions,
): Promise<string> {
  const dataUrl = await Plotly.toImage(el, {
    format: 'svg',
    width: opts.width,
    height: opts.height,
  })
  const prefix = 'data:image/svg+xml,'
  let text = dataUrl
  if (text.startsWith(prefix)) text = text.slice(prefix.length)
  return decodeURIComponent(text)
}

async function svgBytes(
  el: HTMLElement,
  opts: ExportOptions,
): Promise<Uint8Array> {
  const text = await svgString(el, opts)
  return new TextEncoder().encode(text)
}

async function pdfBytes(
  el: HTMLElement,
  opts: ExportOptions,
): Promise<Uint8Array> {
  const text = await svgString(el, opts)
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(text, 'image/svg+xml')
  const svgEl = svgDoc.documentElement as unknown as SVGElement

  const hidden = document.createElement('div')
  hidden.style.position = 'absolute'
  hidden.style.left = '-99999px'
  hidden.style.top = '-99999px'
  hidden.appendChild(svgEl)
  document.body.appendChild(hidden)

  const doc = new jsPDF({
    unit: 'pt',
    format: [opts.width, opts.height],
    orientation: opts.width > opts.height ? 'landscape' : 'portrait',
  })

  try {
    await svg2pdf(svgEl, doc, {
      x: 0,
      y: 0,
      width: opts.width,
      height: opts.height,
    })
  } finally {
    document.body.removeChild(hidden)
  }

  return new Uint8Array(doc.output('arraybuffer'))
}

function defaultName(format: ExportFormat, baseName: string): string {
  const cleanBase = baseName.replace(/\.[^.]+$/, '') || 'bintools-heatmap'
  return `${cleanBase}.${format === 'jpg' ? 'jpg' : format}`
}

function filterFor(format: ExportFormat): {
  name: string
  extensions: string[]
} {
  switch (format) {
    case 'png':
      return { name: 'PNG 图片', extensions: ['png'] }
    case 'jpg':
      return { name: 'JPG 图片', extensions: ['jpg', 'jpeg'] }
    case 'svg':
      return { name: 'SVG 矢量图', extensions: ['svg'] }
    case 'pdf':
      return { name: 'PDF 文档', extensions: ['pdf'] }
  }
}

export async function exportHeatmap(
  el: HTMLElement,
  format: ExportFormat,
  baseName: string,
  width: number,
  height: number,
): Promise<ExportResult> {
  const filter = filterFor(format)
  const filePath = await window.api.showSaveDialog({
    defaultName: defaultName(format, baseName),
    filterName: filter.name,
    extensions: filter.extensions,
  })
  if (!filePath) return { ok: false }

  try {
    let bytes: Uint8Array
    if (format === 'png') bytes = await rasterBytes(el, 'png', { width, height })
    else if (format === 'jpg') bytes = await rasterBytes(el, 'jpeg', { width, height })
    else if (format === 'svg') bytes = await svgBytes(el, { width, height })
    else bytes = await pdfBytes(el, { width, height })

    const result = await window.api.writeFile({ filePath, bytes })
    if (!result.ok) {
      return { ok: false, error: result.error ?? '保存失败' }
    }
    return { ok: true, filePath }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
