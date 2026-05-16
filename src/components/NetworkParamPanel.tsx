import { useNetworkStore } from '@/store/networkStore'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { GroupShell } from '@/components/parameter-groups/GroupShell'
import type { CorrelationMethod, TaxonomyLevel } from '@/types/network'
import { cn } from '@/lib/cn'

const methodOptions: { value: CorrelationMethod; label: string }[] = [
  { value: 'spearman', label: 'Spearman（推荐）' },
  { value: 'pearson', label: 'Pearson' },
]

const taxonomyOptions: { value: TaxonomyLevel; label: string }[] = [
  { value: 'phylum', label: '门 Phylum' },
  { value: 'class', label: '纲 Class' },
  { value: 'order', label: '目 Order' },
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
        onChange={e => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          'bg-cream-200 accent-terracotta',
        )}
      />
    </div>
  )
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex-1 text-ink">{label}</span>
      <label className="cursor-pointer relative">
        <div
          className="w-7 h-7 rounded-md border border-line shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  )
}

export function NetworkParamPanel() {
  const params = useNetworkStore(s => s.params)
  const setParam = useNetworkStore(s => s.setParam)

  return (
    <aside className="w-[320px] shrink-0 border-r border-line bg-cream overflow-y-auto">
      <div className="px-5 py-6 space-y-6">
        <GroupShell label="相关性计算">
          <Select
            label="计算方法"
            value={params.method}
            onChange={v => setParam('method', v)}
            options={methodOptions}
          />

          <SliderRow
            label="|r| 阈值"
            value={params.rThreshold}
            min={0.1}
            max={0.99}
            step={0.01}
            onChange={v => setParam('rThreshold', v)}
            display={params.rThreshold.toFixed(2)}
          />

          <div className="space-y-1.5">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-ink">p 值阈值</span>
              <input
                type="number"
                value={params.pThreshold}
                min={0.001}
                max={0.2}
                step={0.001}
                onChange={e => setParam('pThreshold', Number(e.target.value))}
                className={cn(
                  'h-8 rounded-md border border-line bg-cream-50 px-2 text-sm text-ink',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
                )}
              />
            </label>
          </div>

          <Checkbox
            checked={params.useFDR}
            onChange={v => setParam('useFDR', v)}
            label="FDR 校正（BH 法）"
          />
        </GroupShell>

        <GroupShell label="节点分类">
          <Select
            label="分类层级着色"
            value={params.taxonomyLevel}
            onChange={v => setParam('taxonomyLevel', v)}
            options={taxonomyOptions}
          />
          <p className="text-xs text-ink-subtle leading-relaxed">
            需要 Excel 中包含 Taxonomy 列。<br />
            支持 GreenGenes（k__/p__）和 SILVA 格式。
          </p>
        </GroupShell>

        <GroupShell label="外观">
          <ColorRow
            label="正相关颜色"
            value={params.positiveColor}
            onChange={v => setParam('positiveColor', v)}
          />
          <ColorRow
            label="负相关颜色"
            value={params.negativeColor}
            onChange={v => setParam('negativeColor', v)}
          />
          <Checkbox
            checked={params.showLabels}
            onChange={v => setParam('showLabels', v)}
            label="显示节点标签"
          />
        </GroupShell>
      </div>
    </aside>
  )
}
