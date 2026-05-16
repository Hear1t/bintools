import { useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { DataPreview } from '@/components/DataPreview'
import { MainLayout } from '@/components/MainLayout'
import { Toaster } from '@/components/Toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/store/appStore'
import type { ParsedFile } from '@/types/sheet'
import type { ValidationResult } from '@/types/data'

type Feature = 'heatmap' | 'network'

type View =
  | { type: 'welcome' }
  | { type: 'preview'; file: ParsedFile; sheetIndex: number; feature: Feature }
  | { type: 'main'; feature: Feature }

export default function App() {
  const [view, setView] = useState<View>({ type: 'welcome' })
  const setDataset = useAppStore((s) => s.setDataset)
  const clearDataset = useAppStore((s) => s.clearDataset)

  const reupload = () => {
    clearDataset()
    setView({ type: 'welcome' })
  }

  let content
  if (view.type === 'welcome') {
    content = (
      <WelcomeScreen
        onLoaded={(file, feature) =>
          setView({ type: 'preview', file, sheetIndex: 0, feature })
        }
      />
    )
  } else if (view.type === 'preview') {
    content = (
      <DataPreview
        file={view.file}
        currentSheet={view.sheetIndex}
        onSheetChange={(i) => setView({ ...view, sheetIndex: i })}
        onConfirm={(result: Extract<ValidationResult, { ok: true }>) => {
          setDataset(result.dataset, view.file.fileName)
          setView({ type: 'main', feature: view.feature })
        }}
        onCancel={() => setView({ type: 'welcome' })}
      />
    )
  } else {
    content = <MainLayout onReupload={reupload} initialTab={view.feature} />
  }

  return (
    <ErrorBoundary>
      {content}
      <Toaster />
    </ErrorBoundary>
  )
}
