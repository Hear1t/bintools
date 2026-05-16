import { useState } from 'react'
import { Upload, ArrowLeft, LayoutGrid, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExampleDatasetCard } from '@/components/ExampleDatasetCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { exampleDatasets } from '@/data/examples'
import { loadExcelFromUpload } from '@/services/fileLoader'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/cn'
import type { ParsedFile } from '@/types/sheet'

type Feature = 'heatmap' | 'network'

interface WelcomeScreenProps {
  onLoaded: (file: ParsedFile, feature: Feature) => void
}

const LARGE_ROW_THRESHOLD = 5000
const LARGE_COL_THRESHOLD = 50

const FEATURES: {
  id: Feature
  title: string
  subtitle: string
  description: string
  icon: typeof LayoutGrid
}[] = [
  {
    id: 'heatmap',
    title: '热图制作',
    subtitle: 'Heatmap',
    description: '上传基因表达或丰度矩阵，生成带聚类的发表级热图，支持 Z-score 标准化。',
    icon: LayoutGrid,
  },
  {
    id: 'network',
    title: '共现网络图',
    subtitle: 'Co-occurrence Network',
    description: '上传 OTU / ASV 丰度表，自动计算 Spearman 相关性，生成力导向共现网络。',
    icon: Share2,
  },
]

// Decorative SVG patterns shown in card corners
function HeatmapPattern() {
  const cells = []
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const opacity = 0.3 + ((i + j) % 3) * 0.25
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={i * 14}
          y={j * 14}
          width={11}
          height={11}
          rx={1.5}
          fill="currentColor"
          opacity={opacity}
        />,
      )
    }
  }
  return (
    <svg
      viewBox="0 0 80 80"
      className="absolute top-5 right-5 w-20 h-20 text-ink opacity-[0.07] group-hover:opacity-[0.12] transition-opacity pointer-events-none"
    >
      {cells}
    </svg>
  )
}

function NetworkPattern() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="absolute top-5 right-5 w-20 h-20 text-ink opacity-[0.08] group-hover:opacity-[0.14] transition-opacity pointer-events-none"
    >
      <g stroke="currentColor" strokeWidth={1} fill="none">
        <line x1={15} y1={15} x2={40} y2={40} />
        <line x1={65} y1={15} x2={40} y2={40} />
        <line x1={15} y1={65} x2={40} y2={40} />
        <line x1={65} y1={65} x2={40} y2={40} />
        <line x1={15} y1={15} x2={65} y2={15} />
        <line x1={15} y1={65} x2={65} y2={65} />
      </g>
      <g fill="currentColor">
        <circle cx={15} cy={15} r={3.5} />
        <circle cx={65} cy={15} r={3.5} />
        <circle cx={15} cy={65} r={3.5} />
        <circle cx={65} cy={65} r={3.5} />
        <circle cx={40} cy={40} r={5} />
      </g>
    </svg>
  )
}

export function WelcomeScreen({ onLoaded }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<'select' | Feature>('select')
  const [loading, setLoading] = useState(false)
  const [pendingLarge, setPendingLarge] = useState<{
    file: ParsedFile
    feature: Feature
    rowCount: number
    colCount: number
  } | null>(null)
  const showToast = useUiStore((s) => s.showToast)

  const activeFeature = phase !== 'select' ? (phase as Feature) : null

  const proceed = (file: ParsedFile, feature: Feature) => {
    const first = file.sheets[0]
    const rowCount = first?.rows.length ?? 0
    const colCount = first?.rows[0]?.length ?? 0
    if (rowCount > LARGE_ROW_THRESHOLD || colCount > LARGE_COL_THRESHOLD) {
      setPendingLarge({ file, feature, rowCount, colCount })
      return
    }
    onLoaded(file, feature)
  }

  const handleUpload = async () => {
    if (!activeFeature) return
    setLoading(true)
    try {
      const file = await loadExcelFromUpload()
      if (file) proceed(file, activeFeature)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '解析失败，请检查文件'
      showToast('error', `文件解析失败：${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const featureExamples = activeFeature
    ? exampleDatasets.filter((d) => d.feature === activeFeature)
    : []

  const bgStyle = {
    background:
      'radial-gradient(ellipse 80% 50% at top right, rgba(204,120,92,0.06) 0%, transparent 60%),' +
      'radial-gradient(ellipse 60% 50% at bottom left, rgba(204,120,92,0.04) 0%, transparent 55%),' +
      '#FAF9F5',
  }

  // ── Feature selection ──────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-10 py-16 relative overflow-hidden"
        style={bgStyle}
      >
        <div className="w-full max-w-2xl relative">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-medium">
                Bio Analysis Toolkit
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            </div>
            <h1 className="font-serif text-display text-ink">BinTools</h1>
            <p className="text-base text-ink-muted max-w-sm mx-auto leading-relaxed">
              面向实验室科研人员的生物分析可视化工具
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <button
                  key={f.id}
                  onClick={() => setPhase(f.id)}
                  className={cn(
                    'group text-left rounded-2xl border border-line bg-cream-50 p-7 relative overflow-hidden',
                    'hover:border-terracotta/40 hover:-translate-y-0.5',
                    'hover:shadow-[0_16px_40px_-16px_rgba(204,120,92,0.25)]',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
                  )}
                >
                  {f.id === 'heatmap' ? <HeatmapPattern /> : <NetworkPattern />}

                  <div className="relative">
                    <div className="mb-5">
                      <div
                        className={cn(
                          'inline-flex items-center justify-center w-12 h-12 rounded-2xl',
                          'bg-gradient-to-br from-terracotta/15 to-terracotta/5',
                          'ring-1 ring-terracotta/20',
                          'group-hover:from-terracotta/25 group-hover:to-terracotta/10',
                          'group-hover:ring-terracotta/35',
                          'transition-all duration-200',
                        )}
                      >
                        <Icon className="h-6 w-6 text-terracotta" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h2 className="font-serif text-xl text-ink mb-0.5">{f.title}</h2>
                    <p className="text-[11px] text-ink-subtle uppercase tracking-wider mb-4">
                      {f.subtitle}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {f.description}
                    </p>
                    <p
                      className={cn(
                        'mt-6 text-sm font-medium text-terracotta',
                        'inline-flex items-center gap-1',
                        'transition-transform duration-200 group-hover:translate-x-1',
                      )}
                    >
                      进入 <span aria-hidden>→</span>
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="mt-16 text-center text-xs text-ink-subtle">
            数据全程留在本地 · 离线运行
          </p>
        </div>
      </div>
    )
  }

  // ── Data loading ───────────────────────────────────────────────────────
  const currentFeature = FEATURES.find((f) => f.id === phase)!
  const Icon = currentFeature.icon
  return (
    <div
      className="min-h-screen flex items-center justify-center px-10 py-16 relative overflow-hidden"
      style={bgStyle}
    >
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setPhase('select')}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-10 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          返回
        </button>

        <div className="mb-10 flex items-start gap-4">
          <div
            className={cn(
              'shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl',
              'bg-gradient-to-br from-terracotta/15 to-terracotta/5 ring-1 ring-terracotta/20',
            )}
          >
            <Icon className="h-6 w-6 text-terracotta" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-medium mb-1">
              {currentFeature.subtitle}
            </p>
            <h1 className="font-serif text-display text-ink leading-none">
              {currentFeature.title}
            </h1>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">
              {currentFeature.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mb-14">
          <Button size="lg" onClick={handleUpload} disabled={loading}>
            <Upload className="h-4 w-4" strokeWidth={2} />
            {loading ? '正在读取…' : '上传 Excel'}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line" />
            <p className="text-xs text-ink-subtle uppercase tracking-wider">
              或试试示例数据
            </p>
            <div className="flex-1 h-px bg-line" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featureExamples.map((ds) => (
              <ExampleDatasetCard
                key={ds.id}
                dataset={ds}
                onClick={() => proceed(ds.data, activeFeature!)}
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
              渲染可能需要 10–30 秒。是否继续？
            </>
          )
        }
        confirmLabel="继续"
        onConfirm={() => {
          if (pendingLarge) {
            onLoaded(pendingLarge.file, pendingLarge.feature)
            setPendingLarge(null)
          }
        }}
      />
    </div>
  )
}
