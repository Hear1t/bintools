import { HelpCircle } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { parameterHelp } from '@/data/parameterHelp'

interface ParameterTooltipProps {
  helpKey: string
}

export function ParameterTooltip({ helpKey }: ParameterTooltipProps) {
  const content = parameterHelp[helpKey] ?? '暂无说明。'
  return (
    <Tooltip content={content} side="right">
      <button
        type="button"
        aria-label="参数说明"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-ink-subtle hover:text-ink transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </Tooltip>
  )
}
