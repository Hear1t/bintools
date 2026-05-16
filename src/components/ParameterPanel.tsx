import { DataGroup } from '@/components/parameter-groups/DataGroup'
import { NormalizationGroup } from '@/components/parameter-groups/NormalizationGroup'
import { ClusteringGroup } from '@/components/parameter-groups/ClusteringGroup'
import { AppearanceGroup } from '@/components/parameter-groups/AppearanceGroup'
import { SizeGroup } from '@/components/parameter-groups/SizeGroup'

interface ParameterPanelProps {
  onReupload: () => void
}

export function ParameterPanel({ onReupload }: ParameterPanelProps) {
  return (
    <aside className="w-[320px] shrink-0 border-r border-line bg-cream overflow-y-auto">
      <div className="px-5 py-6 space-y-6">
        <DataGroup onReupload={onReupload} />
        <NormalizationGroup />
        <ClusteringGroup />
        <AppearanceGroup />
        <SizeGroup />
      </div>
    </aside>
  )
}
