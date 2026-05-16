import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExampleDatasetCard } from '@/components/ExampleDatasetCard'
import { exampleDatasets } from '@/data/examples'
import { loadExcelFromUpload } from '@/services/fileLoader'
import type { ParsedFile } from '@/types/sheet'

interface WelcomeScreenProps {
  onLoaded: (file: ParsedFile) => void
}

export function WelcomeScreen({ onLoaded }: WelcomeScreenProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    setError(null)
    setLoading(true)
    try {
      const file = await loadExcelFromUpload()
      if (file) onLoaded(file)
    } catch (e) {
      setError(e instanceof Error ? e.message : '解析失败，请检查文件')
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
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
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
                onClick={() => onLoaded(ds.data)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
