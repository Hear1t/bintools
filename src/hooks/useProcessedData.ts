import { useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { useAppStore } from '@/store/appStore'
import { normalize } from '@/services/normalizer'
import { clusterAxis } from '@/services/clustering'
import type { ProcessedDataset } from '@/types/processed'

export function useProcessedData(): ProcessedDataset | null {
  const dataset = useAppStore((s) => s.dataset)
  const params = useAppStore((s) => s.params)
  const [debouncedParams] = useDebounce(params, 200)

  return useMemo(() => {
    if (!dataset) return null
    let warning: string | null = null
    const normalized = normalize(dataset.matrix, debouncedParams.normalization)

    let rowOrder = dataset.geneIds.map((_, i) => i)
    let rowDendrogram = null
    if (debouncedParams.clusterRows && normalized.length >= 2) {
      try {
        const r = clusterAxis(
          normalized,
          'row',
          debouncedParams.distanceRow,
          debouncedParams.linkageMethod,
        )
        rowOrder = r.order
        rowDendrogram = r.tree
      } catch (e) {
        warning = '行聚类失败，已退化为不聚类'
        console.error('[BinTools] row clustering failed', e)
      }
    }

    let colOrder = dataset.sampleIds.map((_, i) => i)
    let colDendrogram = null
    if (debouncedParams.clusterCols && normalized[0]?.length >= 2) {
      try {
        const r = clusterAxis(
          normalized,
          'col',
          debouncedParams.distanceCol,
          debouncedParams.linkageMethod,
        )
        colOrder = r.order
        colDendrogram = r.tree
      } catch (e) {
        warning = warning
          ? `${warning}；列聚类失败，已退化为不聚类`
          : '列聚类失败，已退化为不聚类'
        console.error('[BinTools] col clustering failed', e)
      }
    }

    return {
      geneIds: dataset.geneIds,
      sampleIds: dataset.sampleIds,
      matrix: normalized,
      rowOrder,
      colOrder,
      rowDendrogram,
      colDendrogram,
      warning,
    }
  }, [dataset, debouncedParams])
}
