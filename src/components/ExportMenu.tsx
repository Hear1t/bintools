import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useUiStore } from '@/store/uiStore'
import { exportHeatmap, type ExportFormat } from '@/services/exporter'
import { cn } from '@/lib/cn'

interface ExportMenuProps {
  getPlotElement: () => HTMLElement | null
}

const formats: { format: ExportFormat; label: string; desc: string }[] = [
  { format: 'png', label: 'PNG', desc: '位图 · 适合 PPT 或报告' },
  { format: 'jpg', label: 'JPG', desc: '位图 · 文件较小' },
  { format: 'svg', label: 'SVG', desc: '矢量图 · 可在 AI 中编辑' },
  { format: 'pdf', label: 'PDF', desc: '矢量文档 · 论文投稿首选' },
]

export function ExportMenu({ getPlotElement }: ExportMenuProps) {
  const fileName = useAppStore((s) => s.fileName)
  const dataset = useAppStore((s) => s.dataset)
  const params = useAppStore((s) => s.params)
  const showToast = useUiStore((s) => s.showToast)
  const [exporting, setExporting] = useState<ExportFormat | null>(null)
  const [open, setOpen] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setOpen(false)
    if (!dataset) {
      showToast('error', '尚未加载数据')
      return
    }
    const el = getPlotElement()
    if (!el) {
      showToast('error', '热图未渲染，无法导出')
      return
    }
    setExporting(format)
    const width =
      params.fitWindow ? Math.max(800, el.clientWidth) : params.width
    const height =
      params.fitWindow ? Math.max(600, el.clientHeight) : params.height
    try {
      const result = await exportHeatmap(
        el,
        format,
        fileName ?? 'heatmap',
        width,
        height,
      )
      if (result.ok && result.filePath) {
        showToast('success', `已保存到 ${result.filePath}`)
      } else if (result.error) {
        showToast('error', `导出失败：${result.error}`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      showToast('error', `导出失败：${msg}`)
    } finally {
      setExporting(null)
    }
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium',
            'bg-terracotta text-cream transition-colors',
            'hover:bg-terracotta-hover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
            'disabled:opacity-50',
          )}
          disabled={exporting !== null}
        >
          {exporting !== null ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              正在导出…
            </>
          ) : (
            <>
              导出
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[240px] rounded-lg border border-line bg-cream-50 p-1 shadow-md"
        >
          {formats.map((f) => (
            <DropdownMenu.Item
              key={f.format}
              onSelect={() => handleExport(f.format)}
              className={cn(
                'rounded-md px-3 py-2 cursor-pointer outline-none',
                'data-[highlighted]:bg-cream-200',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{f.label}</span>
                <span className="text-xs text-ink-subtle">{f.desc}</span>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
