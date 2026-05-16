import { useAppStore } from '@/store/appStore'
import { Checkbox } from '@/components/ui/Checkbox'
import { NumberInput } from '@/components/ui/NumberInput'
import { GroupShell } from './GroupShell'

export function SizeGroup() {
  const params = useAppStore((s) => s.params)
  const setParam = useAppStore((s) => s.setParam)
  const fitWindow = params.fitWindow

  return (
    <GroupShell label="尺寸">
      <Checkbox
        checked={fitWindow}
        onChange={(v) => setParam('fitWindow', v)}
        label="适应窗口"
        helpKey="size.fit"
      />
      <NumberInput
        label="宽度"
        value={params.width}
        onChange={(v) => setParam('width', v)}
        min={200}
        max={4000}
        step={50}
        disabled={fitWindow}
        helpKey="size.width"
      />
      <NumberInput
        label="高度"
        value={params.height}
        onChange={(v) => setParam('height', v)}
        min={200}
        max={4000}
        step={50}
        disabled={fitWindow}
        helpKey="size.height"
      />
    </GroupShell>
  )
}
