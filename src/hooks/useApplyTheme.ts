import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

/** Syncs the current theme to the <html data-theme="…"> attribute. */
export function useApplyTheme() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
}
