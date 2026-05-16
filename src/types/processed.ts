export interface ProcessedDataset {
  geneIds: string[]
  sampleIds: string[]
  matrix: number[][]
  rowOrder: number[]
  colOrder: number[]
  rowDendrogram: DendrogramNode | null
  colDendrogram: DendrogramNode | null
  warning: string | null
}

export interface DendrogramNode {
  height: number
  isLeaf: boolean
  index: number
  children: DendrogramNode[]
}
