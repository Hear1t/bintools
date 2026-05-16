import { useProcessedData } from '@/hooks/useProcessedData'

export function HeatmapCanvas() {
  const processed = useProcessedData()

  if (!processed) {
    return (
      <main className="flex-1 overflow-auto bg-cream-100">
        <div className="h-full flex items-center justify-center text-ink-subtle">
          等待数据
        </div>
      </main>
    )
  }

  const previewRowCount = Math.min(5, processed.matrix.length)
  const previewColCount = Math.min(5, processed.matrix[0]?.length ?? 0)

  return (
    <main className="flex-1 overflow-auto bg-cream-100 p-10">
      <div className="space-y-5">
        <div>
          <p className="text-xs text-ink-subtle uppercase tracking-wider">
            热图占位 · Phase 7 接入 Plotly
          </p>
          <p className="font-serif text-2xl text-ink mt-1">
            数据流水线已工作
          </p>
        </div>

        {processed.warning && (
          <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-900">
            {processed.warning}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm max-w-2xl">
          <div className="rounded-lg border border-line bg-cream-50 px-4 py-3 space-y-1">
            <p className="text-xs text-ink-subtle uppercase tracking-wider">行顺序（前 10）</p>
            <p className="font-mono text-xs text-ink-muted break-all">
              [{processed.rowOrder.slice(0, 10).join(', ')}
              {processed.rowOrder.length > 10 ? ', …' : ''}]
            </p>
          </div>
          <div className="rounded-lg border border-line bg-cream-50 px-4 py-3 space-y-1">
            <p className="text-xs text-ink-subtle uppercase tracking-wider">列顺序</p>
            <p className="font-mono text-xs text-ink-muted break-all">
              [{processed.colOrder.join(', ')}]
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-cream-50 p-4 max-w-2xl">
          <p className="text-xs text-ink-subtle uppercase tracking-wider mb-2">
            归一化后前 {previewRowCount} × {previewColCount}
          </p>
          <table className="text-sm font-mono">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-ink-subtle">基因</th>
                {processed.colOrder.slice(0, previewColCount).map((cIdx) => (
                  <th
                    key={cIdx}
                    className="px-2 py-1 text-right text-ink-subtle"
                  >
                    {processed.sampleIds[cIdx]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processed.rowOrder.slice(0, previewRowCount).map((rIdx) => (
                <tr key={rIdx} className="border-t border-line">
                  <td className="px-2 py-1 text-ink">
                    {processed.geneIds[rIdx]}
                  </td>
                  {processed.colOrder.slice(0, previewColCount).map((cIdx) => (
                    <td
                      key={cIdx}
                      className="px-2 py-1 text-right text-ink-muted"
                    >
                      {formatNumber(processed.matrix[rIdx][cIdx])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function formatNumber(n: number): string {
  if (Number.isNaN(n)) return '—'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(2)
}
