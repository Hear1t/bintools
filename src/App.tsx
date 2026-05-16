import { useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { DataPreview } from '@/components/DataPreview'
import { MainLayout } from '@/components/MainLayout'
import { useAppStore } from '@/store/appStore'
import type { ParsedFile } from '@/types/sheet'
import type { ValidationResult } from '@/types/data'

type View =
  | { type: 'welcome' }
  | { type: 'preview'; file: ParsedFile; sheetIndex: number }
  | { type: 'main' }

export default function App() {
  const [view, setView] = useState<View>({ type: 'welcome' })
  const setDataset = useAppStore((s) => s.setDataset)
  const clearDataset = useAppStore((s) => s.clearDataset)

  const reupload = () => {
    clearDataset()
    setView({ type: 'welcome' })
  }

  if (view.type === 'welcome') {
    return (
      <WelcomeScreen
        onLoaded={(file) =>
          setView({ type: 'preview', file, sheetIndex: 0 })
        }
      />
    )
  }

  if (view.type === 'preview') {
    return (
      <DataPreview
        file={view.file}
        currentSheet={view.sheetIndex}
        onSheetChange={(i) => setView({ ...view, sheetIndex: i })}
        onConfirm={(result: Extract<ValidationResult, { ok: true }>) => {
          setDataset(result.dataset, view.file.fileName)
          setView({ type: 'main' })
        }}
        onCancel={() => setView({ type: 'welcome' })}
      />
    )
  }

  return <MainLayout onReupload={reupload} />
}
