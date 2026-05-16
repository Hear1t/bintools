import { type ReactNode } from 'react'
import { Divider } from '@/components/ui/Divider'

interface GroupShellProps {
  label: string
  children: ReactNode
}

export function GroupShell({ label, children }: GroupShellProps) {
  return (
    <div className="space-y-3">
      <Divider label={label} />
      <div className="space-y-3 pl-1">{children}</div>
    </div>
  )
}
