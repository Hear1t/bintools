import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Loader2, Check } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
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

type Status =
  | { type: 'idle' }
  | { type: 'exporting'; format: ExportFormat }
  | { type: 'success'; filePath: string }
  | { type: 'error'; message: string }

export function ExportMenu({ getPlotElement }: ExportMenuProps) {
  const fileName = useAppStore((s) => s.fileName)
  const params = useAppStore((s) => s.params)
  const [status, setStatus] = useState<Status>({ type: 'idle' })
  const [open, setOpen] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setOpen(false)
    const el = getPlotElement()
    if (!el) {
      setStatus({ type: 'error', message: '热图未渲染，无法导出' })
      return
    }
    setStatus({ type: 'exporting', format })
    const width =
      params.fitWindow ? Math.max(800, el.clientWidth) : params.width
    const height =
      params.fitWindow ? Math.max(600, el.clientHeight) : params.height
    const result = await exportHeatmap(
      el,
      format,
      fileName ?? 'heatmap',
      width,
      height,
    )
    if (result.ok && result.filePath) {
      setStatus({ type: 'success', filePath: result.filePath })
      setTimeout(() => setStatus({ type: 'idle' }), 3000)
    } else if (result.error) {
      setStatus({ type: 'error', message: result.error })
      setTimeout(() => setStatus({ type: 'idle' }), 5000)
    } else {
      setStatus({ type: 'idle' })
    }
  }

  return (
    <>
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
            disabled={status.type === 'exporting'}
          >
            {status.type === 'exporting' ? (
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

      {status.type === 'success' && (
        <FloatingStatus tone="success">
          <Check className="h-4 w-4" />
          已保存到 {status.filePath}
        </FloatingStatus>
      )}
      {status.type === 'error' && (
        <FloatingStatus tone="error">{status.message}</FloatingStatus>
      )}
    </>
  )
}

function FloatingStatus({
  tone,
  children,
}: {
  tone: 'success' | 'error'
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-50 max-w-md rounded-md px-4 py-2.5 text-sm shadow-md',
        'flex items-center gap-2',
        tone === 'success' && 'bg-emerald-50 text-emerald-900 border border-emerald-200',
        tone === 'error' && 'bg-red-50 text-red-900 border border-red-200',
      )}
    >
      {children}
    </div>
  )
}
