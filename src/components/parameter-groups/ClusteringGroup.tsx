import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { GroupShell } from './GroupShell'
import { cn } from '@/lib/cn'
import type { DistanceMetric, LinkageMethod } from '@/types/params'

const distanceOptions: { value: DistanceMetric; label: string }[] = [
  { value: 'euclidean', label: '欧氏距离' },
  { value: 'correlation', label: '相关性距离' },
  { value: 'manhattan', label: '曼哈顿距离' },
]

const linkageOptions: { value: LinkageMethod; label: string }[] = [
  { value: 'ward', label: 'Ward.D' },
  { value: 'complete', label: 'Complete' },
  { value: 'average', label: 'Average' },
  { value: 'single', label: 'Single' },
]

export function ClusteringGroup() {
  const params = useAppStore((s) => s.params)
  const setParam = useAppStore((s) => s.setParam)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <GroupShell label="聚类">
      <Checkbox
        checked={params.clusterRows}
        onChange={(v) => setParam('clusterRows', v)}
        label="行聚类"
        helpKey="cluster.rows"
      />
      <Checkbox
        checked={params.clusterCols}
        onChange={(v) => setParam('clusterCols', v)}
        label="列聚类"
        helpKey="cluster.cols"
      />
      {(params.clusterRows || params.clusterCols) && (
        <>
          <Select
            label="行距离"
            value={params.distanceRow}
            onChange={(v) => setParam('distanceRow', v)}
            options={distanceOptions}
            helpKey={`cluster.distance.${params.distanceRow}`}
          />
          <Select
            label="列距离"
            value={params.distanceCol}
            onChange={(v) => setParam('distanceCol', v)}
            options={distanceOptions}
            helpKey={`cluster.distance.${params.distanceCol}`}
          />

          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex items-center gap-1 text-xs text-ink-subtle hover:text-ink transition-colors"
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                advancedOpen && 'rotate-90',
              )}
            />
            高级
          </button>
          {advancedOpen && (
            <div className="pl-3 border-l border-line">
              <Select
                label="连接方法"
                value={params.linkageMethod}
                onChange={(v) => setParam('linkageMethod', v)}
                options={linkageOptions}
                helpKey={`cluster.linkage.${params.linkageMethod}`}
              />
            </div>
          )}
        </>
      )}
    </GroupShell>
  )
}
