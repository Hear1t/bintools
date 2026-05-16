import { useAppStore } from '@/store/appStore'
import { RadioGroup } from '@/components/ui/Radio'
import { GroupShell } from './GroupShell'
import type { NormalizationMode } from '@/types/params'

export function NormalizationGroup() {
  const value = useAppStore((s) => s.params.normalization)
  const setParam = useAppStore((s) => s.setParam)

  return (
    <GroupShell label="归一化">
      <RadioGroup<NormalizationMode>
        name="normalization"
        value={value}
        onChange={(v) => setParam('normalization', v)}
        options={[
          { value: 'none', label: '原始数据', helpKey: 'normalization.none' },
          {
            value: 'zscore_row',
            label: 'Z-score（行内）',
            helpKey: 'normalization.zscore_row',
          },
          { value: 'log2', label: 'Log2', helpKey: 'normalization.log2' },
          {
            value: 'mean_center',
            label: '均值居中',
            helpKey: 'normalization.mean_center',
          },
        ]}
      />
    </GroupShell>
  )
}
