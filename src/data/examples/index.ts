import type { ParsedFile } from '@/types/sheet'
import { smallDemoExample } from './smallDemo'
import { transcriptomeDemoExample } from './transcriptomeDemo'

export interface ExampleDataset {
  id: string
  title: string
  description: string
  shape: string
  data: ParsedFile
}

export const exampleDatasets: ExampleDataset[] = [
  {
    id: 'small-demo',
    title: '小型示例',
    description: '肿瘤 vs 正常组织对照',
    shape: '10 基因 × 6 样本',
    data: smallDemoExample,
  },
  {
    id: 'transcriptome',
    title: '炎症响应',
    description: 'IFN 通路诱导前后',
    shape: '12 基因 × 7 样本',
    data: transcriptomeDemoExample,
  },
]
