import { useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { DataPreview } from '@/components/DataPreview'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { ParsedFile } from '@/types/sheet'
import type { BinToolsDataset, ValidationResult } from '@/types/data'

type View =
  | { type: 'welcome' }
  | { type: 'preview'; file: ParsedFile; sheetIndex: number }
  | { type: 'main'; dataset: BinToolsDataset; file: ParsedFile }

export default function App() {
  const [view, setView] = useState<View>({ type: 'welcome' })

  if (view.type === 'welcome') {
    return (
      <WelcomeScreen
        onLoaded={(file) =>
          setView({ type: 'preview', file, sheetIndex: 0 })
        }
      />
    )
  }

  if (view.type === 'preview') {
    return (
      <DataPreview
        file={view.file}
        currentSheet={view.sheetIndex}
        onSheetChange={(i) => setView({ ...view, sheetIndex: i })}
        onConfirm={(result: Extract<ValidationResult, { ok: true }>) => {
          console.log('[BinTools] Confirmed dataset:', result.dataset)
          setView({ type: 'main', dataset: result.dataset, file: view.file })
        }}
        onCancel={() => setView({ type: 'welcome' })}
      />
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-10 py-16">
      <div className="w-full max-w-md space-y-6">
        <p className="font-serif text-2xl text-ink text-center">主界面占位</p>
        <Card>
          <div className="space-y-2">
            <p className="text-xs text-ink-subtle uppercase tracking-wider">已确认数据</p>
            <p className="font-serif text-lg text-ink">{view.file.fileName}</p>
            <p className="text-sm text-ink-muted">
              {view.dataset.geneIds.length} 基因 × {view.dataset.sampleIds.length} 样本
            </p>
            <p className="text-xs text-ink-subtle pt-2">
              Phase 4 会把左侧参数面板 + 右侧热图画布接上来。
            </p>
          </div>
        </Card>
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setView({ type: 'welcome' })}>
            返回欢迎页
          </Button>
        </div>
      </div>
    </div>
  )
}
