import type { PhyloNode } from '@/types/phylo'

/**
 * Saitou & Nei (1987) Neighbor-Joining.
 * Input: label list + symmetric distance matrix (n × n).
 * Output: rooted binary tree (midpoint-rooted via final join).
 */
export function neighborJoin(
  labels: string[],
  distances: number[][],
): PhyloNode {
  const n0 = labels.length
  if (n0 < 2) {
    throw new Error('Need at least 2 sequences to build a tree')
  }

  if (n0 === 2) {
    const d = distances[0][1]
    return {
      id: 'root',
      isLeaf: false,
      branchLength: 0,
      children: [
        makeLeaf(0, labels[0], d / 2),
        makeLeaf(1, labels[1], d / 2),
      ],
    }
  }

  // Working set: list of current "active" nodes (leaves or merged internals)
  let nodes: PhyloNode[] = labels.map((label, i) => makeLeaf(i, label, 0))
  // Working distance matrix, mutated as we go
  let D = distances.map((row) => row.slice())

  let internalCount = 0

  while (nodes.length > 2) {
    const n = nodes.length

    // Row sums r[i] = Σ D[i][k] for k ≠ i
    const r = new Array<number>(n).fill(0)
    for (let i = 0; i < n; i++) {
      let sum = 0
      for (let k = 0; k < n; k++) {
        if (k !== i) sum += D[i][k]
      }
      r[i] = sum
    }

    // Pick pair (i, j) minimizing Q = (n-2)·D[i][j] − r[i] − r[j]
    let bestI = 0
    let bestJ = 1
    let bestQ = Infinity
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const q = (n - 2) * D[i][j] - r[i] - r[j]
        if (q < bestQ) {
          bestQ = q
          bestI = i
          bestJ = j
        }
      }
    }

    const dij = D[bestI][bestJ]
    const limbI = 0.5 * dij + (r[bestI] - r[bestJ]) / (2 * (n - 2))
    const limbJ = dij - limbI

    internalCount++
    const newNode: PhyloNode = {
      id: `internal-${internalCount}`,
      isLeaf: false,
      branchLength: 0,
      children: [
        cloneWithBranch(nodes[bestI], Math.max(0, limbI)),
        cloneWithBranch(nodes[bestJ], Math.max(0, limbJ)),
      ],
    }

    // Compute distances from new node to remaining nodes
    const newRow: number[] = []
    for (let k = 0; k < n; k++) {
      if (k === bestI || k === bestJ) continue
      const d = (D[bestI][k] + D[bestJ][k] - dij) / 2
      newRow.push(d)
    }

    // Rebuild nodes list (drop i and j, append new)
    const nextNodes: PhyloNode[] = []
    for (let k = 0; k < n; k++) {
      if (k !== bestI && k !== bestJ) nextNodes.push(nodes[k])
    }
    nextNodes.push(newNode)

    // Rebuild D matrix in the same order
    const nextSize = n - 1
    const survivors: number[] = []
    for (let k = 0; k < n; k++) {
      if (k !== bestI && k !== bestJ) survivors.push(k)
    }

    const nextD: number[][] = []
    for (let a = 0; a < nextSize; a++) {
      nextD.push(new Array<number>(nextSize).fill(0))
    }
    for (let a = 0; a < survivors.length; a++) {
      for (let b = 0; b < survivors.length; b++) {
        nextD[a][b] = D[survivors[a]][survivors[b]]
      }
    }
    for (let a = 0; a < newRow.length; a++) {
      nextD[nextSize - 1][a] = newRow[a]
      nextD[a][nextSize - 1] = newRow[a]
    }

    nodes = nextNodes
    D = nextD
  }

  // Final join: two nodes left → connect with midpoint root
  const finalDist = D[0][1]
  return {
    id: 'root',
    isLeaf: false,
    branchLength: 0,
    children: [
      cloneWithBranch(nodes[0], finalDist / 2),
      cloneWithBranch(nodes[1], finalDist / 2),
    ],
  }
}

function makeLeaf(idx: number, name: string, branchLength: number): PhyloNode {
  return { id: `leaf-${idx}`, name, isLeaf: true, branchLength }
}

function cloneWithBranch(node: PhyloNode, branchLength: number): PhyloNode {
  return { ...node, branchLength }
}
