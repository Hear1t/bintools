import { useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { ParsedFile } from '@/types/sheet'

export default function App() {
  const [loadedFile, setLoadedFile] = useState<ParsedFile | null>(null)

  const handleLoaded = (file: ParsedFile) => {
    console.log('[BinTools] Parsed file:', file)
    console.log('[BinTools] First sheet preview:', file.sheets[0])
    setLoadedFile(file)
  }

  if (!loadedFile) {
    return <WelcomeScreen onLoaded={handleLoaded} />
  }

  const firstSheet = loadedFile.sheets[0]
  const rowCount = firstSheet.rows.length
  const colCount = firstSheet.rows[0]?.length ?? 0

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-10 py-16">
      <div className="w-full max-w-md space-y-6">
        <p className="font-serif text-2xl text-ink text-center">
          数据已加载
        </p>
        <Card>
          <div className="space-y-2">
            <p className="text-xs text-ink-subtle uppercase tracking-wider">文件</p>
            <p className="font-serif text-lg text-ink">{loadedFile.fileName}</p>
            <p className="text-sm text-ink-muted">
              {loadedFile.sheets.length} 个 sheet · 首个含 {rowCount} 行 × {colCount} 列
            </p>
            <p className="text-xs text-ink-subtle pt-2">
              下个阶段会接上「数据预览」页，目前数据已进入应用内存。
            </p>
          </div>
        </Card>
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setLoadedFile(null)}>
            重新选择
          </Button>
        </div>
      </div>
    </div>
  )
}
