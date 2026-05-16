import { create } from 'zustand'
import type { PhyloData, PhyloParams, PhyloSequence } from '@/types/phylo'
import { DEFAULT_PHYLO_PARAMS } from '@/types/phylo'

interface PhyloState {
  sequences: PhyloSequence[] | null
  fileName: string | null
  data: PhyloData | null
  params: PhyloParams
  setSequences: (seqs: PhyloSequence[], fileName: string) => void
  setData: (data: PhyloData) => void
  setParam: <K extends keyof PhyloParams>(key: K, value: PhyloParams[K]) => void
  resetParams: () => void
  clear: () => void
}

export const usePhyloStore = create<PhyloState>((set) => ({
  sequences: null,
  fileName: null,
  data: null,
  params: { ...DEFAULT_PHYLO_PARAMS },
  setSequences: (sequences, fileName) => set({ sequences, fileName }),
  setData: (data) => set({ data }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  resetParams: () => set({ params: { ...DEFAULT_PHYLO_PARAMS } }),
  clear: () =>
    set({
      sequences: null,
      fileName: null,
      data: null,
      params: { ...DEFAULT_PHYLO_PARAMS },
    }),
}))
