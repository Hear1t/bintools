import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bintools-theme'

function readInitial(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    // ignore (SSR/private mode)
  }
  return 'dark'
}

interface ThemeState {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readInitial(),
  setTheme: (t) => {
    try { localStorage.setItem(STORAGE_KEY, t) } catch {}
    set({ theme: t })
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    set({ theme: next })
  },
}))
