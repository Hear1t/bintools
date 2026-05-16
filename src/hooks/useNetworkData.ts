import { useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { useAppStore } from '@/store/appStore'
import { useNetworkStore } from '@/store/networkStore'
import { buildNetworkData } from '@/services/networkBuilder'
import type { NetworkData } from '@/types/network'

export function useNetworkData(): NetworkData | null {
  const dataset = useAppStore((s) => s.dataset)
  const params = useNetworkStore((s) => s.params)
  const [debouncedParams] = useDebounce(params, 300)

  return useMemo(() => {
    if (!dataset) return null
    try {
      return buildNetworkData(dataset, debouncedParams)
    } catch {
      return null
    }
  }, [dataset, debouncedParams])
}
