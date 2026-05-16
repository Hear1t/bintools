import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/cn'

interface ThemeToggleProps {
  size?: 'sm' | 'md'
  className?: string
}

export function ThemeToggle({ size = 'md', className }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon

  const sizeClasses =
    size === 'sm'
      ? 'h-7 w-7'
      : 'h-9 w-9'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      title={isDark ? '亮色模式' : '暗色模式'}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'text-ink-muted hover:text-terracotta',
        'border border-line hover:border-terracotta/50',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
        sizeClasses,
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={1.75} />
    </button>
  )
}
