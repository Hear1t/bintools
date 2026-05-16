import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  tone: ToastTone
  message: string
}

interface UiState {
  toasts: Toast[]
  showToast: (tone: ToastTone, message: string, durationMs?: number) => void
  dismissToast: (id: number) => void
}

let nextId = 1

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  showToast: (tone, message, durationMs = 3500) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { id, tone, message }] }))
    if (durationMs > 0) {
      setTimeout(() => {
        get().dismissToast(id)
      }, durationMs)
    }
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
