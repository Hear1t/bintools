import type { Theme } from '@/store/themeStore'

interface ThemeColors {
  bg: string
  text: string
  textMuted: string
  textSubtle: string
  border: string
  nodeStroke: string
  accent: string
}

const LIGHT: ThemeColors = {
  bg: '#FAF9F5',
  text: '#2D2A26',
  textMuted: '#6B6660',
  textSubtle: '#8B857D',
  border: '#E4E0D6',
  nodeStroke: '#FFFFFF',
  accent: '#CC785C',
}

const DARK: ThemeColors = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textSubtle: '#71717A',
  border: '#27272A',
  nodeStroke: '#0A0A0A',
  accent: '#F97316',
}

export function getThemeColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? DARK : LIGHT
}
