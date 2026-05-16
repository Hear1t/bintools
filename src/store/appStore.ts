import { create } from 'zustand'
import type { BinToolsDataset } from '@/types/data'
import type { HeatmapParams } from '@/types/params'
import { DEFAULT_PARAMS } from '@/types/params'

interface AppState {
  dataset: BinToolsDataset | null
  fileName: string | null
  params: HeatmapParams
  setDataset: (dataset: BinToolsDataset, fileName: string) => void
  setParam: <K extends keyof HeatmapParams>(
    key: K,
    value: HeatmapParams[K],
  ) => void
  resetParams: () => void
  clearDataset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  dataset: null,
  fileName: null,
  params: DEFAULT_PARAMS,
  setDataset: (dataset, fileName) => set({ dataset, fileName }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  resetParams: () => set({ params: { ...DEFAULT_PARAMS } }),
  clearDataset: () =>
    set({ dataset: null, fileName: null, params: { ...DEFAULT_PARAMS } }),
}))
