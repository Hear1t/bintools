import type { PhyloNode } from '@/types/phylo'

/** Escape a name for Newick: quote if it contains special chars. */
function escapeName(name: string): string {
  if (/[\s(),:;'"\[\]]/.test(name)) {
    return `'${name.replace(/'/g, "''")}'`
  }
  return name
}

function nodeToNewick(node: PhyloNode): string {
  if (node.isLeaf) {
    const name = escapeName(node.name ?? node.id)
    return `${name}:${node.branchLength.toFixed(6)}`
  }
  const children = (node.children ?? []).map(nodeToNewick).join(',')
  const len = node.branchLength
  // Internal nodes typically have no label
  return `(${children}):${len.toFixed(6)}`
}

/** Serialize a rooted binary tree to a Newick string. */
export function toNewick(root: PhyloNode): string {
  if (root.isLeaf) {
    return `${escapeName(root.name ?? root.id)};`
  }
  const children = (root.children ?? []).map(nodeToNewick).join(',')
  return `(${children});`
}
