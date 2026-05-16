import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { SheetSelector } from '@/components/SheetSelector'
import { validateSheet } from '@/services/dataValidator'
import type { ParsedFile } from '@/types/sheet'
import type { ValidationResult, ValidationWarning } from '@/types/data'
import { ColumnMappingFallback } from '@/components/ColumnMappingFallback'

interface DataPreviewProps {
  file: ParsedFile
  currentSheet: number
  onSheetChange: (index: number) => void
  onConfirm: (result: Extract<ValidationResult, { ok: true }>) => void
  onCancel: () => void
}

const PREVIEW_ROWS = 10

export function DataPreview({
  file,
  currentSheet,
  onSheetChange,
  onConfirm,
  onCancel,
}: DataPreviewProps) {
  const sheet = file.sheets[currentSheet]
  const result = useMemo(() => validateSheet(sheet), [sheet])

  if (!result.ok && result.issue === 'no_string_first_col') {
    return (
      <ColumnMappingFallback
        sheet={sheet}
        file={file}
        currentSheet={currentSheet}
        onSheetChange={onSheetChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )
  }

  if (!result.ok) {
    return (
      <FailureView
        file={file}
        currentSheet={currentSheet}
        onSheetChange={onSheetChange}
        onCancel={onCancel}
        message={
          result.issue === 'empty_sheet'
            ? '这个 sheet 是空的，请换一个或重新上传。'
            : '没找到数值数据，请检查表格。'
        }
      />
    )
  }

  const previewRows = sheet.rows.slice(0, PREVIEW_ROWS + 1)
  const geneCol = result.geneColumnIndex
  const colCount = sheet.rows[0]?.length ?? 0

  return (
    <div className="min-h-screen bg-cream px-10 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs text-ink-subtle uppercase tracking-wider">
              数据预览
            </p>
            <h2 className="font-serif text-3xl text-ink mt-1">
              {file.fileName}
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              {result.dataset.geneIds.length} 基因 × {result.dataset.sampleIds.length} 样本
              {result.dataset.skippedRows > 0 &&
                `（跳过 ${result.dataset.skippedRows} 行空/全零）`}
            </p>
          </div>
          <SheetSelector
            sheetNames={file.sheets.map((s) => s.name)}
            currentIndex={currentSheet}
            onChange={onSheetChange}
          />
        </div>

        {result.warnings.length > 0 && (
          <WarningBanners warnings={result.warnings} />
        )}

        <Divider label="前 10 行" />

        <PreviewTable rows={previewRows} colCount={colCount} geneCol={geneCol} />

        <p className="text-xs text-ink-subtle">
          高亮列被识别为基因名。若不对，
          <button
            className="underline underline-offset-2 hover:text-ink"
            onClick={() => onSheetChange(currentSheet)}
          >
            重新选择数据
          </button>
          。
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onCancel}>
            返回
          </Button>
          <Button onClick={() => onConfirm(result)}>确认进入</Button>
        </div>
      </div>
    </div>
  )
}

function PreviewTable({
  rows,
  colCount,
  geneCol,
}: {
  rows: unknown[][]
  colCount: number
  geneCol: number
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-cream-50">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={cn(
                'border-b border-line last:border-b-0',
                rIdx === 0 && 'bg-cream-200/60',
              )}
            >
              {Array.from({ length: colCount }, (_, cIdx) => (
                <td
                  key={cIdx}
                  className={cn(
                    'px-3 py-2 align-middle whitespace-nowrap',
                    cIdx === geneCol && 'border-l-2 border-terracotta',
                    cIdx === geneCol && 'text-ink font-medium',
                    cIdx !== geneCol && 'text-ink-muted',
                    rIdx === 0 && 'text-ink font-medium',
                  )}
                >
                  {formatCell(row[cIdx])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '—'
  if (typeof cell === 'number') {
    return Number.isInteger(cell) ? String(cell) : cell.toFixed(2)
  }
  return String(cell)
}

function WarningBanners({ warnings }: { warnings: ValidationWarning[] }) {
  return (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div
          key={i}
          className="rounded-md bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-900"
        >
          {warningMessage(w)}
        </div>
      ))}
    </div>
  )
}

function warningMessage(w: ValidationWarning): string {
  if (w.type === 'duplicate_genes') {
    return `检测到 ${w.count} 个重复基因名（如 ${w.sample.join('、')}），已自动加 _2、_3 后缀区分。`
  }
  if (w.type === 'missing_values') {
    return `表格含 ${w.count} 个缺失值（约 ${w.percent.toFixed(1)}%），将在归一化时跳过。`
  }
  return `跳过了 ${w.count} 行空白或全零数据。`
}

function FailureView({
  file,
  currentSheet,
  onSheetChange,
  onCancel,
  message,
}: {
  file: ParsedFile
  currentSheet: number
  onSheetChange: (index: number) => void
  onCancel: () => void
  message: string
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-10 py-16">
      <div className="w-full max-w-md space-y-5 text-center">
        <p className="font-serif text-2xl text-ink">无法读取数据</p>
        <p className="text-sm text-ink-muted">{message}</p>
        <SheetSelector
          sheetNames={file.sheets.map((s) => s.name)}
          currentIndex={currentSheet}
          onChange={onSheetChange}
          className="justify-center"
        />
        <div className="flex justify-center pt-2">
          <Button variant="ghost" onClick={onCancel}>
            返回欢迎页
          </Button>
        </div>
      </div>
    </div>
  )
}
