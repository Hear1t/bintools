export interface PhyloSequence {
  name: string
  sequence: string
  length: number
}

export interface PhyloNode {
  id: string
  name?: string
  isLeaf: boolean
  branchLength: number      // length from parent
  group?: string            // leaf only
  groupColor?: string       // leaf only
  children?: PhyloNode[]
  parent?: PhyloNode | null

  // Layout fields (set by canvas layout pass)
  x?: number
  y?: number
  angle?: number            // for circular
  radius?: number           // for circular
  cumulativeLength?: number // root-to-this branch length sum
  leafCoord?: number        // 0..nLeaves-1, average for internal nodes
}

export interface PhyloStats {
  sequenceCount: number
  avgLength: number
  isAligned: boolean
  distanceMethod: 'p-distance' | 'k-mer'
}

export interface PhyloData {
  root: PhyloNode
  leaves: PhyloNode[]
  groups: Record<string, string>  // group name → hex color
  stats: PhyloStats
  newick: string
}

export type LayoutMode = 'rectangular' | 'circular'
export type BranchMode = 'proportional' | 'cladogram'
export type NodeOrdering = 'ascending' | 'descending' | 'none'

export interface PhyloParams {
  layout: LayoutMode
  branchMode: BranchMode
  leafFontSize: number
  showBranchLength: boolean
  nodeOrdering: NodeOrdering
}

export const DEFAULT_PHYLO_PARAMS: PhyloParams = {
  layout: 'rectangular',
  branchMode: 'proportional',
  leafFontSize: 11,
  showBranchLength: false,
  nodeOrdering: 'ascending',
}
