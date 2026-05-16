import { useEffect, useRef, useState, type RefObject } from 'react'
import * as d3 from 'd3'
import { usePhyloStore } from '@/store/phyloStore'
import { useThemeStore } from '@/store/themeStore'
import { getThemeColors } from '@/lib/themeColors'
import { usePhyloTreeBuild } from '@/hooks/usePhyloTree'
import type { PhyloData, PhyloNode, PhyloParams } from '@/types/phylo'

interface TooltipState {
  x: number
  y: number
  node: PhyloNode
}

interface PhyloCanvasProps {
  svgRef: RefObject<SVGSVGElement | null>
}

export function PhyloCanvas({ svgRef }: PhyloCanvasProps) {
  usePhyloTreeBuild()
  const innerSvgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const data = usePhyloStore((s) => s.data)
  const params = usePhyloStore((s) => s.params)
  const theme = useThemeStore((s) => s.theme)
  const colors = getThemeColors(theme)

  // Sync external ref for export
  useEffect(() => {
    if (svgRef && 'current' in svgRef) {
      ;(svgRef as React.MutableRefObject<SVGSVGElement | null>).current =
        innerSvgRef.current
    }
  }, [svgRef])

  useEffect(() => {
    const svgEl = innerSvgRef.current
    const containerEl = containerRef.current
    if (!svgEl || !containerEl) return
    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    setTooltip(null)
    if (!data) return

    const { width, height } = containerEl.getBoundingClientRect()
    drawTree(svg, data, params, width, height, colors, setTooltip)
  }, [data, params, theme, colors])

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-cream"
    >
      <svg ref={innerSvgRef} className="w-full h-full" />

      {!data && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="font-mono text-sm text-ink-subtle">等待数据…</p>
        </div>
      )}

      {tooltip && (
        <div
          className="fixed z-50 bg-cream-50 border border-line rounded-md px-3 py-2 shadow-md text-xs pointer-events-none font-mono"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="text-ink font-medium mb-1">{tooltip.node.name}</div>
          <div className="text-ink-muted">分组：{tooltip.node.group}</div>
          <div className="text-ink-muted">
            分支：{tooltip.node.branchLength.toFixed(4)}
          </div>
        </div>
      )}

      {/* Stats */}
      {data && (
        <div className="absolute bottom-4 left-4 font-mono text-[11px] text-ink-subtle space-y-0.5">
          <div>
            序列 {data.stats.sequenceCount} · 平均 {data.stats.avgLength.toFixed(0)} bp
          </div>
          <div>
            [{data.stats.isAligned ? 'ALIGNED' : 'UNALIGNED'}] · {data.stats.distanceMethod}
          </div>
        </div>
      )}

      {/* Legend */}
      {data && Object.keys(data.groups).length > 1 && (
        <div className="absolute bottom-4 right-4 bg-cream/90 backdrop-blur-sm border border-line rounded-lg p-3 text-xs max-h-72 overflow-y-auto">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle mb-2">
            [ GROUPS ]
          </div>
          <div className="space-y-1">
            {Object.entries(data.groups).map(([group, color]) => (
              <div key={group} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-ink-muted truncate max-w-[140px]">
                  {group}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Layout + rendering ─────────────────────────────────────────────── */

interface ThemeColors {
  bg: string
  text: string
  textMuted: string
  textSubtle: string
  border: string
  nodeStroke: string
  accent: string
}

function drawTree(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: PhyloData,
  params: PhyloParams,
  width: number,
  height: number,
  colors: ThemeColors,
  setTooltip: (t: TooltipState | null) => void,
): void {
  // Compute layout state on each node
  if (params.nodeOrdering !== 'none') {
    // sort leaf coords by subtree size; use d3 hierarchy for that
    reorderLeavesBySubtreeSize(data.root, params.nodeOrdering === 'descending')
  }
  // After reordering children, re-collect leaves in DFS order
  const orderedLeaves: PhyloNode[] = []
  ;(function dfs(n: PhyloNode) {
    if (n.isLeaf) orderedLeaves.push(n)
    else n.children?.forEach(dfs)
  })(data.root)
  // Assign leaf coordinates
  orderedLeaves.forEach((leaf, i) => {
    leaf.leafCoord = i
  })

  // Compute cumulative branch length + internal node leafCoord
  function annotate(node: PhyloNode, parentCum: number): number {
    node.cumulativeLength = parentCum + node.branchLength
    if (node.isLeaf) return node.leafCoord!
    const childCoords =
      node.children?.map((c) => annotate(c, node.cumulativeLength!)) ?? []
    node.leafCoord =
      childCoords.length > 0
        ? childCoords.reduce((a, b) => a + b, 0) / childCoords.length
        : 0
    return node.leafCoord
  }
  annotate(data.root, 0)

  const maxCum =
    d3.max(allNodes(data.root), (n) => n.cumulativeLength ?? 0) ?? 1
  const maxLeafCoord = orderedLeaves.length - 1

  // Optional: cladogram mode → ignore branch lengths, use tree depth
  if (params.branchMode === 'cladogram') {
    ;(function depthWalk(n: PhyloNode, d: number) {
      n.cumulativeLength = d
      n.children?.forEach((c) => depthWalk(c, d + 1))
    })(data.root, 0)
  }
  const maxX =
    params.branchMode === 'cladogram'
      ? d3.max(allNodes(data.root), (n) => n.cumulativeLength ?? 0) ?? 1
      : maxCum

  // Set pixel coords
  if (params.layout === 'rectangular') {
    const marginLeft = 30
    const marginRight = 200  // reserve room for labels
    const marginTop = 30
    const marginBottom = 30
    const drawW = Math.max(100, width - marginLeft - marginRight)
    const drawH = Math.max(100, height - marginTop - marginBottom)
    for (const n of allNodes(data.root)) {
      n.x = marginLeft + ((n.cumulativeLength ?? 0) / maxX) * drawW
      n.y = marginTop + (n.leafCoord! / Math.max(1, maxLeafCoord)) * drawH
    }
  } else {
    // circular
    const cx = width / 2
    const cy = height / 2
    const maxR = Math.min(width, height) / 2 - 80
    const nLeaves = orderedLeaves.length
    for (const n of allNodes(data.root)) {
      const angle = (n.leafCoord! / nLeaves) * 2 * Math.PI - Math.PI / 2
      const r = ((n.cumulativeLength ?? 0) / maxX) * maxR
      n.angle = angle
      n.radius = r
      n.x = cx + r * Math.cos(angle)
      n.y = cy + r * Math.sin(angle)
    }
  }

  // Root group with zoom
  const g = svg.append('g')
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 10])
    .on('zoom', (event) => g.attr('transform', event.transform))
  svg.call(zoom)

  // Draw edges
  const edgeColor = colors.textSubtle
  if (params.layout === 'rectangular') {
    drawRectEdges(g, data.root, edgeColor)
  } else {
    drawCircularEdges(g, data.root, edgeColor)
  }

  // Draw leaf nodes + labels
  drawLeaves(g, orderedLeaves, params, colors, setTooltip)
}

function drawRectEdges(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  root: PhyloNode,
  color: string,
): void {
  const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = []
  function walk(node: PhyloNode) {
    if (!node.children) return
    for (const child of node.children) {
      // L-shape: parent.x → child.x at child.y; vertical at parent.x
      lines.push({ x1: node.x!, y1: node.y!, x2: node.x!, y2: child.y!, color })
      lines.push({ x1: node.x!, y1: child.y!, x2: child.x!, y2: child.y!, color })
      walk(child)
    }
  }
  walk(root)
  g.selectAll('line.edge')
    .data(lines)
    .join('line')
    .attr('class', 'edge')
    .attr('x1', (d) => d.x1)
    .attr('y1', (d) => d.y1)
    .attr('x2', (d) => d.x2)
    .attr('y2', (d) => d.y2)
    .attr('stroke', (d) => d.color)
    .attr('stroke-width', 1.2)
    .attr('stroke-linecap', 'round')
}

function drawCircularEdges(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  root: PhyloNode,
  color: string,
): void {
  // For each parent → child: radial line at child's angle from parent.radius to child.radius,
  // plus an arc at parent.radius between parent.angle and child.angle.
  const paths: string[] = []
  // Need cx, cy. Recover from any node with radius=0? Easier: pass them in. Use root.x/y.
  const cx = root.x ?? 0
  const cy = root.y ?? 0

  function walk(node: PhyloNode) {
    if (!node.children) return
    for (const child of node.children) {
      const parentR = node.radius ?? 0
      const childR = child.radius ?? 0
      const parentA = node.angle ?? 0
      const childA = child.angle ?? 0

      // Arc start point (at parent radius, child's angle)
      const arcStartX = cx + parentR * Math.cos(childA)
      const arcStartY = cy + parentR * Math.sin(childA)

      // Arc end point = parent.x/y (at parent radius, parent angle)
      const arcEndX = node.x!
      const arcEndY = node.y!

      // Determine sweep
      const deltaA = childA - parentA
      const sweep = deltaA > 0 ? 0 : 1
      const largeArc = Math.abs(deltaA) > Math.PI ? 1 : 0

      // Radial line from child outward to arc start
      const radialStartX = cx + childR * Math.cos(childA)
      const radialStartY = cy + childR * Math.sin(childA)

      const path =
        `M ${radialStartX} ${radialStartY} ` +
        `L ${arcStartX} ${arcStartY} ` +
        `A ${parentR} ${parentR} 0 ${largeArc} ${sweep} ${arcEndX} ${arcEndY}`
      paths.push(path)
      walk(child)
    }
  }
  walk(root)
  g.selectAll('path.edge')
    .data(paths)
    .join('path')
    .attr('class', 'edge')
    .attr('d', (d) => d)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1.2)
    .attr('stroke-linecap', 'round')
}

function drawLeaves(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  leaves: PhyloNode[],
  params: PhyloParams,
  colors: ThemeColors,
  setTooltip: (t: TooltipState | null) => void,
): void {
  const dot = g
    .selectAll<SVGCircleElement, PhyloNode>('circle.leaf')
    .data(leaves)
    .join('circle')
    .attr('class', 'leaf')
    .attr('cx', (d) => d.x!)
    .attr('cy', (d) => d.y!)
    .attr('r', 3.5)
    .attr('fill', (d) => d.groupColor ?? colors.accent)
    .attr('stroke', colors.nodeStroke)
    .attr('stroke-width', 1)
    .style('cursor', 'pointer')

  dot
    .on('mouseover', (event: MouseEvent, d) => {
      setTooltip({ x: event.clientX, y: event.clientY, node: d })
    })
    .on('mousemove', (event: MouseEvent) => {
      setTooltip(((prev: TooltipState | null) =>
        prev ? { ...prev, x: event.clientX, y: event.clientY } : null) as any)
    })
    .on('mouseout', () => setTooltip(null))

  const labels = g
    .selectAll<SVGTextElement, PhyloNode>('text.leaf-label')
    .data(leaves)
    .join('text')
    .attr('class', 'leaf-label')
    .text((d) => d.name ?? '')
    .attr('font-family', 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace')
    .attr('font-size', params.leafFontSize)
    .attr('fill', (d) => d.groupColor ?? colors.text)
    .style('pointer-events', 'none')

  if (params.layout === 'rectangular') {
    labels
      .attr('x', (d) => d.x! + 8)
      .attr('y', (d) => d.y!)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'start')
  } else {
    // Rotate labels along radial direction; flip the ones on the left half
    labels
      .attr('transform', (d) => {
        const a = d.angle ?? 0
        const flip = a > Math.PI / 2 || a < -Math.PI / 2
        const deg = (a * 180) / Math.PI
        const offset = 8
        if (flip) {
          return `translate(${d.x!}, ${d.y!}) rotate(${deg + 180}) translate(${-offset}, 0)`
        }
        return `translate(${d.x!}, ${d.y!}) rotate(${deg}) translate(${offset}, 0)`
      })
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', (d) => {
        const a = d.angle ?? 0
        const flip = a > Math.PI / 2 || a < -Math.PI / 2
        return flip ? 'end' : 'start'
      })
  }
}

function allNodes(root: PhyloNode): PhyloNode[] {
  const out: PhyloNode[] = []
  ;(function walk(n: PhyloNode) {
    out.push(n)
    n.children?.forEach(walk)
  })(root)
  return out
}

function reorderLeavesBySubtreeSize(root: PhyloNode, descending: boolean): void {
  function size(n: PhyloNode): number {
    if (n.isLeaf) return 1
    return (n.children ?? []).reduce((sum, c) => sum + size(c), 0)
  }
  function walk(n: PhyloNode) {
    if (!n.children) return
    n.children.sort((a, b) => (descending ? size(b) - size(a) : size(a) - size(b)))
    n.children.forEach(walk)
  }
  walk(root)
}
