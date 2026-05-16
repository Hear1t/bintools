import { create } from 'zustand'
import type { NetworkParams } from '@/types/network'
import { DEFAULT_NETWORK_PARAMS } from '@/types/network'

interface NetworkState {
  params: NetworkParams
  setParam: <K extends keyof NetworkParams>(key: K, value: NetworkParams[K]) => void
  resetParams: () => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  params: { ...DEFAULT_NETWORK_PARAMS },
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  resetParams: () => set({ params: { ...DEFAULT_NETWORK_PARAMS } }),
}))
