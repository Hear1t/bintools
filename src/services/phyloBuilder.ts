import type { PhyloData, PhyloNode, PhyloSequence } from '@/types/phylo'
import { computeDistanceMatrix } from '@/services/distance'
import { detectAlignment } from '@/services/fastaParser'
import { neighborJoin } from '@/services/neighborJoin'
import { assignGroupColors } from '@/services/phyloGroup'
import { toNewick } from '@/services/newickExport'

/**
 * Walk the tree, attaching group + color to leaves and collecting leaves.
 */
function annotateLeaves(
  root: PhyloNode,
  perName: Record<string, string>,
  groupOfName: Record<string, string>,
  leaves: PhyloNode[],
): void {
  if (root.isLeaf) {
    if (root.name) {
      root.group = groupOfName[root.name]
      root.groupColor = perName[root.name]
    }
    leaves.push(root)
    return
  }
  root.children?.forEach((c) => annotateLeaves(c, perName, groupOfName, leaves))
}

export function buildPhyloTree(seqs: PhyloSequence[]): PhyloData {
  if (seqs.length < 3) {
    throw new Error('需要至少 3 条序列才能建树')
  }

  const isAligned = detectAlignment(seqs)
  const method = isAligned ? 'p-distance' : 'k-mer'

  const distances = computeDistanceMatrix(seqs, method)
  const labels = seqs.map((s) => s.name)
  const root = neighborJoin(labels, distances)

  const { perName, perGroup, groupOfName } = assignGroupColors(labels)

  const leaves: PhyloNode[] = []
  annotateLeaves(root, perName, groupOfName, leaves)

  const avgLength =
    seqs.reduce((sum, s) => sum + s.length, 0) / seqs.length

  return {
    root,
    leaves,
    groups: perGroup,
    stats: {
      sequenceCount: seqs.length,
      avgLength,
      isAligned,
      distanceMethod: method,
    },
    newick: toNewick(root),
  }
}
