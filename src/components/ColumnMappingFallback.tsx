import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { SheetSelector } from '@/components/SheetSelector'
import { validateSheet } from '@/services/dataValidator'
import type { ParsedFile, RawSheet } from '@/types/sheet'
import type { ValidationResult } from '@/types/data'

interface Props {
  sheet: RawSheet
  file: ParsedFile
  currentSheet: number
  onSheetChange: (index: number) => void
  onConfirm: (result: Extract<ValidationResult, { ok: true }>) => void
  onCancel: () => void
}

export function ColumnMappingFallback({
  sheet,
  file,
  currentSheet,
  onSheetChange,
  onConfirm,
  onCancel,
}: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const colCount = sheet.rows[0]?.length ?? 0
  const previewRows = sheet.rows.slice(0, 6)

  const tryConfirm = () => {
    if (picked === null) return
    const result = validateSheet(sheet, picked)
    if (result.ok) onConfirm(result)
  }

  return (
    <div className="min-h-screen bg-cream px-10 py-10">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs text-ink-subtle uppercase tracking-wider">
              需要确认
            </p>
            <h2 className="font-serif text-3xl text-ink mt-1">
              哪一列是基因名？
            </h2>
            <p className="text-sm text-ink-muted mt-1 max-w-lg">
              我自动识别基因名列失败了。请点下方表头中你想作为基因名的那一列。
            </p>
          </div>
          <SheetSelector
            sheetNames={file.sheets.map((s) => s.name)}
            currentIndex={currentSheet}
            onChange={onSheetChange}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-line bg-cream-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-200/60 border-b border-line">
                {Array.from({ length: colCount }, (_, cIdx) => (
                  <th
                    key={cIdx}
                    className="px-2 py-2 text-left font-medium align-middle"
                  >
                    <button
                      onClick={() => setPicked(cIdx)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded px-2 py-1',
                        'transition-colors',
                        picked === cIdx
                          ? 'bg-terracotta text-cream'
                          : 'text-ink hover:bg-cream-300',
                      )}
                    >
                      第 {cIdx + 1} 列
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-line last:border-b-0">
                  {Array.from({ length: colCount }, (_, cIdx) => (
                    <td
                      key={cIdx}
                      className={cn(
                        'px-3 py-2 align-middle whitespace-nowrap text-ink-muted',
                        picked === cIdx && 'border-l-2 border-terracotta text-ink',
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

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel}>
            返回
          </Button>
          <Button onClick={tryConfirm} disabled={picked === null}>
            确认进入
          </Button>
        </div>
      </div>
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
