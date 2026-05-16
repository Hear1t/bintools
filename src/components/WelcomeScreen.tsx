import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExampleDatasetCard } from '@/components/ExampleDatasetCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { exampleDatasets } from '@/data/examples'
import { loadExcelFromUpload } from '@/services/fileLoader'
import { useUiStore } from '@/store/uiStore'
import type { ParsedFile } from '@/types/sheet'

interface WelcomeScreenProps {
  onLoaded: (file: ParsedFile) => void
}

const LARGE_ROW_THRESHOLD = 5000
const LARGE_COL_THRESHOLD = 50

export function WelcomeScreen({ onLoaded }: WelcomeScreenProps) {
  const [loading, setLoading] = useState(false)
  const [pendingLarge, setPendingLarge] = useState<{
    file: ParsedFile
    rowCount: number
    colCount: number
  } | null>(null)
  const showToast = useUiStore((s) => s.showToast)

  const proceedWith = (file: ParsedFile) => {
    const first = file.sheets[0]
    const rowCount = first?.rows.length ?? 0
    const colCount = first?.rows[0]?.length ?? 0
    if (rowCount > LARGE_ROW_THRESHOLD || colCount > LARGE_COL_THRESHOLD) {
      setPendingLarge({ file, rowCount, colCount })
      return
    }
    onLoaded(file)
  }

  const handleUpload = async () => {
    setLoading(true)
    try {
      const file = await loadExcelFromUpload()
      if (file) proceedWith(file)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '解析失败，请检查文件'
      showToast('error', `文件解析失败：${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-10 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-display text-ink">
            生物分析<br />从未如此简单
          </h1>
          <p className="text-base text-ink-muted max-w-md mx-auto">
            上传 Excel，几步导出发表级别的热图。
            数据全程留在你的电脑里，离线运行。
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-14">
          <Button size="lg" onClick={handleUpload} disabled={loading}>
            <Upload className="h-4 w-4" strokeWidth={2} />
            {loading ? '正在读取…' : '上传 Excel'}
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-ink-subtle uppercase tracking-wider text-center">
            或试试示例数据
          </p>
          <div className="grid grid-cols-2 gap-4">
            {exampleDatasets.map((ds) => (
              <ExampleDatasetCard
                key={ds.id}
                dataset={ds}
                onClick={() => proceedWith(ds.data)}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingLarge !== null}
        onOpenChange={(open) => !open && setPendingLarge(null)}
        title="数据较大"
        description={
          pendingLarge && (
            <>
              这份数据有 <strong>{pendingLarge.rowCount}</strong> 行 ×{' '}
              <strong>{pendingLarge.colCount}</strong> 列，
              渲染可能需要 10-30 秒。是否继续？
            </>
          )
        }
        confirmLabel="继续渲染"
        onConfirm={() => {
          if (pendingLarge) {
            onLoaded(pendingLarge.file)
            setPendingLarge(null)
          }
        }}
      />
    </div>
  )
}
