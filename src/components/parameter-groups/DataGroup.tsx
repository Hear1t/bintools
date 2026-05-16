import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/Button'
import { GroupShell } from './GroupShell'

interface DataGroupProps {
  onReupload: () => void
}

export function DataGroup({ onReupload }: DataGroupProps) {
  const fileName = useAppStore((s) => s.fileName)
  const dataset = useAppStore((s) => s.dataset)

  return (
    <GroupShell label="数据">
      {fileName && (
        <div className="space-y-0.5">
          <p className="font-serif text-base text-ink truncate" title={fileName}>
            {fileName}
          </p>
          {dataset && (
            <p className="text-xs text-ink-muted">
              {dataset.geneIds.length} 基因 × {dataset.sampleIds.length} 样本
            </p>
          )}
        </div>
      )}
      <Button variant="secondary" size="sm" onClick={onReupload} className="w-full">
        重新上传
      </Button>
    </GroupShell>
  )
}
