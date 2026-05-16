import type { ParsedFile } from '@/types/sheet'
import { smallDemoExample } from './smallDemo'
import { transcriptomeDemoExample } from './transcriptomeDemo'
import { soilMicrobiomeDemoExample } from './soilMicrobiomeDemo'
import { gutMicrobiomeDemoExample } from './gutMicrobiomeDemo'

export interface ExampleDataset {
  id: string
  title: string
  description: string
  shape: string
  feature: 'heatmap' | 'network'
  data: ParsedFile
}

export const exampleDatasets: ExampleDataset[] = [
  {
    id: 'small-demo',
    title: '小型示例',
    description: '肿瘤 vs 正常组织对照',
    shape: '10 基因 × 6 样本',
    feature: 'heatmap',
    data: smallDemoExample,
  },
  {
    id: 'transcriptome',
    title: '炎症响应',
    description: 'IFN 通路诱导前后',
    shape: '12 基因 × 7 样本',
    feature: 'heatmap',
    data: transcriptomeDemoExample,
  },
  {
    id: 'soil-microbiome',
    title: '土壤微生物',
    description: '湿季 / 干季群落变化',
    shape: '18 OTU × 12 样本 · 含分类',
    feature: 'network',
    data: soilMicrobiomeDemoExample,
  },
  {
    id: 'gut-microbiome',
    title: '肠道微生物',
    description: '健康 vs 菌群紊乱',
    shape: '12 OTU × 10 样本 · 含分类',
    feature: 'network',
    data: gutMicrobiomeDemoExample,
  },
]
