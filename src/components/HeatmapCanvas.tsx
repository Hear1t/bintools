import { useAppStore } from '@/store/appStore'

export function HeatmapCanvas() {
  const params = useAppStore((s) => s.params)
  const dataset = useAppStore((s) => s.dataset)

  return (
    <main className="flex-1 overflow-auto bg-cream-100">
      <div className="h-full flex items-center justify-center p-10">
        <div className="text-center space-y-2">
          <p className="font-serif text-2xl text-ink-muted">热图将在这里显示</p>
          <p className="text-xs text-ink-subtle max-w-sm">
            Phase 6 接通数据处理流水线，Phase 7 渲染真正的热图。
            当前参数已生效（看下方调试信息）。
          </p>
          {dataset && (
            <div className="mt-6 text-left inline-block bg-cream-50 border border-line rounded-lg px-4 py-3 text-xs text-ink-muted">
              <p>
                <span className="text-ink-subtle">归一化：</span>
                {params.normalization}
              </p>
              <p>
                <span className="text-ink-subtle">行聚类：</span>
                {params.clusterRows ? '开' : '关'} · {params.distanceRow}
              </p>
              <p>
                <span className="text-ink-subtle">列聚类：</span>
                {params.clusterCols ? '开' : '关'} · {params.distanceCol}
              </p>
              <p>
                <span className="text-ink-subtle">配色：</span>
                {params.colorScheme}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
