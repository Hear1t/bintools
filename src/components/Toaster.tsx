import { Check, AlertCircle, Info, X } from 'lucide-react'
import { useUiStore, type ToastTone } from '@/store/uiStore'
import { cn } from '@/lib/cn'

const toneStyles: Record<ToastTone, string> = {
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  info: 'bg-cream-50 text-ink border-line',
}

const toneIcon = {
  success: Check,
  error: AlertCircle,
  info: Info,
} as const

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = toneIcon[t.tone]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-2 max-w-md rounded-md border px-3 py-2 text-sm shadow-md',
              toneStyles[t.tone],
            )}
          >
            <Icon className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span className="flex-1 break-words">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="关闭"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
