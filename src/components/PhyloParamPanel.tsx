import { usePhyloStore } from '@/store/phyloStore'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { GroupShell } from '@/components/parameter-groups/GroupShell'
import type { LayoutMode, BranchMode, NodeOrdering } from '@/types/phylo'
import { cn } from '@/lib/cn'

const layoutOptions: { value: LayoutMode; label: string }[] = [
  { value: 'rectangular', label: '矩形' },
  { value: 'circular', label: '圆形 / 辐射' },
]

const branchOptions: { value: BranchMode; label: string }[] = [
  { value: 'proportional', label: '按距离（proportional）' },
  { value: 'cladogram', label: '等长（cladogram）' },
]

const orderingOptions: { value: NodeOrdering; label: string }[] = [
  { value: 'ascending', label: '小簇在上' },
  { value: 'descending', label: '大簇在上' },
  { value: 'none', label: '不排序' },
]

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink">{label}</span>
        <span className="text-ink-muted tabular-nums">{display ?? value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          'bg-cream-200 accent-terracotta',
        )}
      />
    </div>
  )
}

export function PhyloParamPanel() {
  const params = usePhyloStore((s) => s.params)
  const setParam = usePhyloStore((s) => s.setParam)
  const data = usePhyloStore((s) => s.data)
  const fileName = usePhyloStore((s) => s.fileName)

  return (
    <aside className="w-[320px] shrink-0 border-r border-line bg-cream overflow-y-auto">
      <div className="px-5 py-6 space-y-6">
        {fileName && (
          <GroupShell label="数据">
            <p className="font-serif text-base text-ink truncate" title={fileName}>
              {fileName}
            </p>
            {data && (
              <p className="text-xs text-ink-muted">
                {data.stats.sequenceCount} 序列 · 平均 {data.stats.avgLength.toFixed(0)} bp
              </p>
            )}
          </GroupShell>
        )}

        <GroupShell label="布局">
          <Select
            label="形状"
            value={params.layout}
            onChange={(v) => setParam('layout', v)}
            options={layoutOptions}
          />
          <Select
            label="分支长度"
            value={params.branchMode}
            onChange={(v) => setParam('branchMode', v)}
            options={branchOptions}
          />
          <Select
            label="节点排序"
            value={params.nodeOrdering}
            onChange={(v) => setParam('nodeOrdering', v)}
            options={orderingOptions}
          />
        </GroupShell>

        <GroupShell label="标签">
          <SliderRow
            label="叶节点字号"
            value={params.leafFontSize}
            min={7}
            max={20}
            step={1}
            onChange={(v) => setParam('leafFontSize', v)}
            display={`${params.leafFontSize}px`}
          />
          <Checkbox
            checked={params.showBranchLength}
            onChange={(v) => setParam('showBranchLength', v)}
            label="显示分支长度数值"
          />
        </GroupShell>

        {data && (
          <GroupShell label="结果">
            <p className="text-xs text-ink-muted leading-relaxed">
              检测：<span className="font-mono">{data.stats.isAligned ? 'aligned' : 'unaligned'}</span>
              <br />
              距离：<span className="font-mono">{data.stats.distanceMethod}</span>
              <br />
              分组：{Object.keys(data.groups).length} 个
            </p>
          </GroupShell>
        )}
      </div>
    </aside>
  )
}
