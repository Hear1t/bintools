import { useState } from 'react'
import { Upload, ArrowLeft, LayoutGrid, Share2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Logo } from '@/components/Logo'
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
  tags: string[]
  icon: typeof LayoutGrid
}[] = [
  {
    id: 'heatmap',
    title: 'HEATMAP',
    subtitle: '热图制作',
    description: '上传基因表达或丰度矩阵，生成带聚类的发表级热图，支持 Z-score 标准化。',
    tags: ['Z-SCORE', 'CLUSTER', 'EXPORT'],
    icon: LayoutGrid,
  },
  {
    id: 'network',
    title: 'NETWORK',
    subtitle: '共现网络图',
    description: '上传 OTU/ASV 丰度表，自动计算 Spearman 相关性，生成力导向共现网络。',
    tags: ['SPEARMAN', 'D3-FORCE', 'PHYLUM'],
    icon: Share2,
  },
]

// Subtle dot grid; opacity adapts to theme via currentColor on ink-faint
const DOT_GRID_CLASS = 'absolute inset-0 pointer-events-none [background-image:radial-gradient(rgb(var(--ink-faint)/0.35)_1px,transparent_1px)] [background-size:24px_24px] opacity-30'

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

  // ── Feature selection ──────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-cream text-ink relative">
        <div className={DOT_GRID_CLASS} />

        {/* Top status bar */}
        <div className="border-b border-line/70 px-6 py-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-subtle relative">
          <div className="flex items-center gap-2.5">
            <Logo size={16} />
            <span>BinTools v0.0.1</span>
            <span className="text-ink-faint">·</span>
            <span>Local Runtime</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-ink-faint hidden sm:inline">[ OFFLINE ]</span>
            <span className="text-ink-faint hidden sm:inline">[ NO TELEMETRY ]</span>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Main hero */}
        <div className="px-10 py-20 max-w-3xl mx-auto relative">
          <div className="mb-16">
            <Logo size={72} className="mb-7 shadow-2xl" />
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-subtle mb-5">
              [ BIO ANALYSIS TOOLKIT ]
            </div>
            <h1 className="font-mono text-7xl font-medium tracking-tight text-ink leading-none">
              BinTools<span className="text-terracotta">.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm text-ink-muted leading-relaxed">
              面向实验室科研人员的生物分析可视化工具。
              <br />
              选择一个模块开始：
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon
              return (
                <button
                  key={f.id}
                  onClick={() => setPhase(f.id)}
                  className={cn(
                    'group relative text-left',
                    'border border-line bg-cream-50/60',
                    'p-6 transition-all duration-200',
                    'hover:border-terracotta/50 hover:bg-cream-50',
                    'hover:shadow-[0_0_40px_-10px_rgb(var(--terracotta)/0.25)]',
                    'focus-visible:outline-none focus-visible:border-terracotta',
                  )}
                >
                  <div className="flex items-center justify-between mb-8 pb-3 border-b border-line group-hover:border-terracotta/30 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle group-hover:text-terracotta transition-colors">
                      [ MODULE.{String(idx + 1).padStart(2, '0')} ]
                    </span>
                    <Icon className="h-4 w-4 text-ink-subtle group-hover:text-terracotta transition-colors" strokeWidth={1.5} />
                  </div>

                  <h2 className="font-mono text-2xl font-medium text-ink mb-1 tracking-tight">
                    {f.title}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle mb-5">
                    {f.subtitle}
                  </p>

                  <p className="text-sm text-ink-muted leading-relaxed mb-8 min-h-[60px]">
                    {f.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-1.5 py-0.5 border border-line text-ink-subtle group-hover:border-line group-hover:text-ink-muted transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-line group-hover:border-terracotta/30 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      READY
                    </span>
                    <span className="font-mono text-xs text-terracotta inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      ENTER
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-20 font-mono text-[10px] uppercase tracking-widest text-ink-faint flex items-center gap-2">
            <span className="h-px w-8 bg-line" />
            <span>SYSTEM READY · STANDING BY</span>
          </div>
        </div>
      </div>
    )
  }

  // ── Data loading ───────────────────────────────────────────────────────
  const currentFeature = FEATURES.find((f) => f.id === phase)!
  const Icon = currentFeature.icon

  return (
    <div className="min-h-screen bg-cream text-ink relative">
      <div className={DOT_GRID_CLASS} />

      <div className="border-b border-line/70 px-6 py-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-subtle relative">
        <button
          onClick={() => setPhase('select')}
          className="group flex items-center gap-2 text-ink-subtle hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
          [ BACK ]
        </button>
        <div className="flex items-center gap-2.5">
          <Logo size={14} />
          <span className="text-ink-faint">MODULE</span>
          <span className="text-terracotta">{currentFeature.title}</span>
        </div>
        <ThemeToggle size="sm" />
      </div>

      <div className="px-10 py-20 max-w-3xl mx-auto relative">
        <div className="mb-12 flex items-start gap-5">
          <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 border border-terracotta/30 bg-terracotta/5">
            <Icon className="h-5 w-5 text-terracotta" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-subtle mb-2">
              [ {currentFeature.subtitle.toUpperCase()} ]
            </div>
            <h1 className="font-mono text-5xl font-medium tracking-tight text-ink leading-none">
              {currentFeature.title}
              <span className="text-terracotta">.</span>
            </h1>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-md">
              {currentFeature.description}
            </p>
          </div>
        </div>

        <div className="border border-line bg-cream-50/60 p-8 mb-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle mb-5">
            [ INPUT.SOURCE ]
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className={cn(
              'group w-full flex items-center justify-center gap-3',
              'h-12 px-6 font-mono text-sm font-medium',
              'border border-terracotta/50 bg-terracotta/10 text-terracotta',
              'hover:bg-terracotta/20 hover:border-terracotta',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
            )}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            <span className="uppercase tracking-wider">
              {loading ? 'PARSING…' : 'UPLOAD EXCEL'}
            </span>
          </button>
        </div>

        <div className="border border-line bg-cream-50/60 p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
              [ EXAMPLES ]
            </div>
            <div className="font-mono text-[10px] text-ink-faint">
              {featureExamples.length} AVAILABLE
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {featureExamples.map((ds, idx) => (
              <button
                key={ds.id}
                onClick={() => proceed(ds.data, activeFeature!)}
                className={cn(
                  'group flex items-center justify-between',
                  'border border-line bg-cream px-5 py-4',
                  'hover:border-terracotta/40 hover:bg-cream-50',
                  'transition-colors text-left',
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-ink-faint group-hover:text-terracotta/70 transition-colors shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-sm text-ink group-hover:text-terracotta transition-colors">
                      {ds.title}
                    </div>
                    <div className="text-xs text-ink-subtle mt-0.5">
                      {ds.description}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint shrink-0 ml-4">
                  {ds.shape}
                </div>
              </button>
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
