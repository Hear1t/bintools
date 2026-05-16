import { useAppStore } from '@/store/appStore'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { NumberInput } from '@/components/ui/NumberInput'
import { RadioGroup } from '@/components/ui/Radio'
import { GroupShell } from './GroupShell'
import { ParameterTooltip } from '@/components/ParameterTooltip'
import type { ColorScheme, CellBorder } from '@/types/params'

const colorSchemeOptions: { value: ColorScheme; label: string }[] = [
  { value: 'red_blue', label: '红-白-蓝' },
  { value: 'white_red', label: '白-红' },
  { value: 'viridis', label: 'Viridis' },
  { value: 'magma', label: 'Magma' },
  { value: 'green_yellow', label: '绿-黄' },
]

const borderOptions: { value: CellBorder; label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'thin', label: '细' },
  { value: 'medium', label: '中' },
]

export function AppearanceGroup() {
  const params = useAppStore((s) => s.params)
  const setParam = useAppStore((s) => s.setParam)

  return (
    <GroupShell label="外观">
      <Select
        label="配色"
        value={params.colorScheme}
        onChange={(v) => setParam('colorScheme', v)}
        options={colorSchemeOptions}
        helpKey="color.scheme"
      />

      <div className="space-y-1.5">
        <span className="flex items-center gap-2 text-sm text-ink">
          <span className="flex-1">颜色范围</span>
          <ParameterTooltip helpKey="color.range" />
        </span>
        <RadioGroup
          name="colorRangeMode"
          value={params.colorRangeMode}
          onChange={(v) => setParam('colorRangeMode', v)}
          options={[
            { value: 'auto', label: '自动' },
            { value: 'manual', label: '手动' },
          ]}
        />
        {params.colorRangeMode === 'manual' && (
          <div className="flex items-center gap-2 pl-6">
            <NumberInput
              value={params.colorRangeMin}
              onChange={(v) => setParam('colorRangeMin', v)}
              step={0.1}
            />
            <span className="text-ink-subtle">~</span>
            <NumberInput
              value={params.colorRangeMax}
              onChange={(v) => setParam('colorRangeMax', v)}
              step={0.1}
            />
          </div>
        )}
      </div>

      <Checkbox
        checked={params.showRowNames}
        onChange={(v) => setParam('showRowNames', v)}
        label="显示行名"
        helpKey="show.rowNames"
      />
      {params.showRowNames && (
        <NumberInput
          label="行名字号"
          value={params.rowFontSize}
          onChange={(v) => setParam('rowFontSize', v)}
          min={4}
          max={24}
          helpKey="font.row"
          className="pl-6"
        />
      )}

      <Checkbox
        checked={params.showColNames}
        onChange={(v) => setParam('showColNames', v)}
        label="显示列名"
        helpKey="show.colNames"
      />
      {params.showColNames && (
        <NumberInput
          label="列名字号"
          value={params.colFontSize}
          onChange={(v) => setParam('colFontSize', v)}
          min={4}
          max={24}
          helpKey="font.col"
          className="pl-6"
        />
      )}

      <Select
        label="单元格边框"
        value={params.cellBorder}
        onChange={(v) => setParam('cellBorder', v)}
        options={borderOptions}
        helpKey="cell.border"
      />
    </GroupShell>
  )
}
