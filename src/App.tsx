import { Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { Divider } from '@/components/ui/Divider'
import { Card } from '@/components/ui/Card'

export default function App() {
  return (
    <div className="min-h-screen bg-cream px-10 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-12">
        {/* 左栏：按钮 */}
        <section className="space-y-8">
          <Divider label="Buttons" />

          <div className="space-y-3">
            <p className="text-xs text-ink-subtle">Primary</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">导出 PNG</Button>
              <Button variant="primary" size="md">导出 PNG</Button>
              <Button variant="primary" size="lg">导出 PNG</Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-ink-subtle">Secondary</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">重新上传</Button>
              <Button variant="secondary" disabled>禁用态</Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-ink-subtle">Ghost</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost">取消</Button>
              <Button variant="ghost" size="sm">取消</Button>
            </div>
          </div>
        </section>

        {/* 右栏：排版、Tooltip、Card */}
        <section className="space-y-8">
          <Divider label="Typography" />

          <div className="space-y-3">
            <h1 className="font-serif text-display text-ink">
              生物分析<br />从未如此简单
            </h1>
            <p className="text-base text-ink-muted leading-relaxed max-w-md">
              上传 Excel，几步导出发表级别的热图。
              所有数据留在你的电脑里，离线运行。
            </p>
          </div>

          <Divider label="Tooltip" />
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span>把鼠标移到右边的 ? 图标上</span>
            <Tooltip content="Z-score：让每个基因的数值落在 -2~+2，方便看相对变化。">
              <button
                aria-label="提示"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-ink-subtle hover:bg-cream-200 hover:text-ink transition-colors"
              >
                <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </Tooltip>
          </div>

          <Divider label="Card" />
          <Card>
            <div className="space-y-1">
              <p className="text-xs text-ink-subtle uppercase tracking-wider">当前数据集</p>
              <p className="font-serif text-xl text-ink">expr_matrix.xlsx</p>
              <p className="text-sm text-ink-muted">200 基因 × 12 样本</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
