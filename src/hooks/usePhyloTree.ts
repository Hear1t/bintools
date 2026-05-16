import { useEffect } from 'react'
import { usePhyloStore } from '@/store/phyloStore'
import { buildPhyloTree } from '@/services/phyloBuilder'

/**
 * Triggers tree construction whenever uploaded sequences change.
 * Stored result lives in the store so it persists across tab toggles.
 */
export function usePhyloTreeBuild(): void {
  const sequences = usePhyloStore((s) => s.sequences)
  const data = usePhyloStore((s) => s.data)
  const setData = usePhyloStore((s) => s.setData)

  useEffect(() => {
    if (!sequences) return
    if (data && data.stats.sequenceCount === sequences.length) return
    try {
      const built = buildPhyloTree(sequences)
      setData(built)
    } catch {
      // ignore: validation should have caught issues upstream
    }
  }, [sequences, data, setData])
}
