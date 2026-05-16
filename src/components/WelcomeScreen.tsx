import { useState } from 'react'
import { Upload, ArrowLeft, LayoutGrid, Share2 } from 'lucide-react'
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

// Subtle dot grid background pattern
const DOT_GRID = {
  backgroundImage:
    'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
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

  // ── Feature selection ──────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 relative">
        <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />

        {/* Top status bar */}
        <div className="border-b border-zinc-800/80 px-6 py-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-zinc-500 relative">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>BinTools v0.0.1</span>
            <span className="text-zinc-700">·</span>
            <span>Local Runtime</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600">[ OFFLINE ]</span>
            <span className="text-zinc-600">[ NO TELEMETRY ]</span>
          </div>
        </div>

        {/* Main hero */}
        <div className="px-10 py-20 max-w-3xl mx-auto relative">
          <div className="mb-16">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-5">
              [ BIO ANALYSIS TOOLKIT ]
            </div>
            <h1 className="font-mono text-7xl font-medium tracking-tight text-zinc-100 leading-none">
              BinTools<span className="text-orange-500">.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm text-zinc-400 leading-relaxed">
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
                    'border border-zinc-800 bg-zinc-950/60',
                    'p-6 transition-all duration-200',
                    'hover:border-orange-500/50 hover:bg-zinc-900/60',
                    'hover:shadow-[0_0_40px_-10px_rgba(255,107,53,0.25)]',
                    'focus-visible:outline-none focus-visible:border-orange-500',
                  )}
                >
                  {/* Card header line */}
                  <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-orange-500/80 transition-colors">
                      [ MODULE.{String(idx + 1).padStart(2, '0')} ]
                    </span>
                    <Icon className="h-4 w-4 text-zinc-600 group-hover:text-orange-500 transition-colors" strokeWidth={1.5} />
                  </div>

                  <h2 className="font-mono text-2xl font-medium text-zinc-100 mb-1 tracking-tight">
                    {f.title}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mb-5">
                    {f.subtitle}
                  </p>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 min-h-[60px]">
                    {f.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-1.5 py-0.5 border border-zinc-800 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-400 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Enter line */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      READY
                    </span>
                    <span className="font-mono text-xs text-orange-500 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      ENTER
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-20 font-mono text-[10px] uppercase tracking-widest text-zinc-700 flex items-center gap-2">
            <span className="h-px w-8 bg-zinc-800" />
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
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 relative">
      <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />

      {/* Top status bar */}
      <div className="border-b border-zinc-800/80 px-6 py-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-zinc-500 relative">
        <button
          onClick={() => setPhase('select')}
          className="group flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
          [ BACK ]
        </button>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">MODULE</span>
          <span className="text-orange-500">{currentFeature.title}</span>
        </div>
      </div>

      <div className="px-10 py-20 max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="mb-12 flex items-start gap-5">
          <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 border border-orange-500/30 bg-orange-500/5">
            <Icon className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
              [ {currentFeature.subtitle.toUpperCase()} ]
            </div>
            <h1 className="font-mono text-5xl font-medium tracking-tight text-zinc-100 leading-none">
              {currentFeature.title}
              <span className="text-orange-500">.</span>
            </h1>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
              {currentFeature.description}
            </p>
          </div>
        </div>

        {/* Upload section */}
        <div className="border border-zinc-800 bg-zinc-950/60 p-8 mb-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-5">
            [ INPUT.SOURCE ]
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className={cn(
              'group w-full flex items-center justify-center gap-3',
              'h-12 px-6 font-mono text-sm font-medium',
              'border border-orange-500/50 bg-orange-500/10 text-orange-500',
              'hover:bg-orange-500/20 hover:border-orange-500',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40',
            )}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            <span className="uppercase tracking-wider">
              {loading ? 'PARSING…' : 'UPLOAD EXCEL'}
            </span>
          </button>
        </div>

        {/* Examples */}
        <div className="border border-zinc-800 bg-zinc-950/60 p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              [ EXAMPLES ]
            </div>
            <div className="font-mono text-[10px] text-zinc-700">
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
                  'border border-zinc-800 bg-zinc-950 px-5 py-4',
                  'hover:border-orange-500/40 hover:bg-zinc-900',
                  'transition-colors text-left',
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-zinc-600 group-hover:text-orange-500/70 transition-colors shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-sm text-zinc-100 group-hover:text-orange-400 transition-colors">
                      {ds.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {ds.description}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-600 shrink-0 ml-4">
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
