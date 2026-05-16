import { useEffect, useRef, useState, type RefObject } from 'react'
import * as d3 from 'd3'
import { useNetworkData } from '@/hooks/useNetworkData'
import { useNetworkStore } from '@/store/networkStore'
import { useThemeStore } from '@/store/themeStore'
import { getThemeColors } from '@/lib/themeColors'
import { getPhylumColor } from '@/services/networkBuilder'
import type { NetworkNode } from '@/types/network'

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  phylum: string
  phylumColor: string
  degree: number
  isHub: boolean
}

interface SimEdge extends d3.SimulationLinkDatum<SimNode> {
  r: number
}

interface TooltipState {
  x: number
  y: number
  node: SimNode
}

interface NetworkCanvasProps {
  networkSvgRef: RefObject<SVGSVGElement | null>
}

export function NetworkCanvas({ networkSvgRef }: NetworkCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const networkData = useNetworkData()
  const params = useNetworkStore((s) => s.params)
  const theme = useThemeStore((s) => s.theme)
  const themeColors = getThemeColors(theme)

  // Sync external ref so parent can access for export
  useEffect(() => {
    if (networkSvgRef && 'current' in networkSvgRef) {
      ;(networkSvgRef as React.MutableRefObject<SVGSVGElement | null>).current =
        svgRef.current
    }
  }, [networkSvgRef])

  useEffect(() => {
    const svgEl = svgRef.current
    const containerEl = containerRef.current
    if (!svgEl || !containerEl) return

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    setTooltip(null)

    if (!networkData || networkData.nodes.length === 0) return

    const { width, height } = containerEl.getBoundingClientRect()

    // Deep-copy nodes/edges so D3 mutation doesn't affect store data
    const nodes: SimNode[] = networkData.nodes.map(n => ({ ...n }))
    const edges: SimEdge[] = networkData.edges.map(e => ({
      source: (e.source as NetworkNode).id ?? (e.source as string),
      target: (e.target as NetworkNode).id ?? (e.target as string),
      r: e.r,
    }))

    const maxDegree = Math.max(...nodes.map(n => n.degree), 1)
    const nodeRadius = (d: SimNode) => 3 + (d.degree / maxDegree) * 7
    const edgeWidth = (absR: number) => 0.6 + absR * 1.4

    // Scale charge with node count so dense graphs still spread out
    const chargeStrength = -Math.max(700, 2200 / Math.sqrt(nodes.length))
    const linkDistance = 150

    // Root group for zoom transforms
    const g = svg.append('g')

    // Zoom + pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    // Force simulation — use weak X/Y centering instead of forceCenter
    // which would actively pull all nodes toward center and crowd them
    const simulation = d3
      .forceSimulation<SimNode, SimEdge>(nodes)
      .force(
        'link',
        d3.forceLink<SimNode, SimEdge>(edges)
          .id(d => d.id)
          .distance(linkDistance)
          .strength(0.15),
      )
      .force('charge', d3.forceManyBody<SimNode>().strength(chargeStrength).distanceMax(700))
      .force('x', d3.forceX<SimNode>(width / 2).strength(0.02))
      .force('y', d3.forceY<SimNode>(height / 2).strength(0.02))
      .force('collide', d3.forceCollide<SimNode>().radius(d => nodeRadius(d) + 22).strength(0.95))

    // Edges
    const linkG = g.append('g').attr('class', 'links')
    const link = linkG
      .selectAll<SVGLineElement, SimEdge>('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => (d.r > 0 ? params.positiveColor : params.negativeColor))
      .attr('stroke-width', d => edgeWidth(Math.abs(d.r)))
      .attr('stroke-opacity', 0.65)

    // Hub rings (drawn under nodes)
    const hubG = g.append('g').attr('class', 'hubs')
    const hubRing = hubG
      .selectAll<SVGCircleElement, SimNode>('circle')
      .data(nodes.filter(n => n.isHub))
      .join('circle')
      .attr('fill', 'none')
      .attr('stroke', '#E05252')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,3')

    // Nodes
    const nodeG = g.append('g').attr('class', 'nodes')
    const node = nodeG
      .selectAll<SVGCircleElement, SimNode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => d.phylumColor)
      .attr('stroke', themeColors.nodeStroke)
      .attr('stroke-width', 1.5)
      .style('cursor', 'grab')
      .on('mouseover', (event: MouseEvent, d) => {
        setTooltip({ x: event.clientX, y: event.clientY, node: d })
      })
      .on('mousemove', (event: MouseEvent) => {
        setTooltip(t => (t ? { ...t, x: event.clientX, y: event.clientY } : null))
      })
      .on('mouseout', () => setTooltip(null))
      .call(
        d3
          .drag<SVGCircleElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          }),
      )

    // Labels
    const labelG = g.append('g').attr('class', 'labels').style('pointer-events', 'none')
    const label = params.showLabels
      ? labelG
          .selectAll<SVGTextElement, SimNode>('text')
          .data(nodes)
          .join('text')
          .text(d => (d.label.length > 18 ? d.label.slice(0, 18) + '…' : d.label))
          .attr('font-size', 9)
          .attr('font-family', 'Inter, sans-serif')
          .attr('fill', themeColors.textMuted)
          .attr('text-anchor', 'middle')
          .attr('dy', d => nodeRadius(d) + 11)
      : null

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x ?? 0)
        .attr('y1', d => (d.source as SimNode).y ?? 0)
        .attr('x2', d => (d.target as SimNode).x ?? 0)
        .attr('y2', d => (d.target as SimNode).y ?? 0)

      hubRing
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0)
        .attr('r', d => nodeRadius(d) + 7)

      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0)

      label
        ?.attr('x', d => d.x ?? 0)
        .attr('y', d => d.y ?? 0)
    })

    return () => { simulation.stop() }
  }, [networkData, params, theme])

  const data = networkData
  const uniquePhyla = data
    ? Array.from(new Set(data.nodes.map(n => n.phylum))).sort()
    : []

  const posPercent =
    data && data.stats.edgeCount > 0
      ? ((data.stats.positiveCount / data.stats.edgeCount) * 100).toFixed(1)
      : '0'
  const negPercent =
    data && data.stats.edgeCount > 0
      ? ((data.stats.negativeCount / data.stats.edgeCount) * 100).toFixed(1)
      : '0'

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{ background: themeColors.bg }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: themeColors.bg }}
      />

      {/* Empty state */}
      {(!data || data.nodes.length === 0) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <p className="text-sm text-ink-muted">无符合阈值的相关关系</p>
          <p className="text-xs text-ink-subtle">尝试降低 |r| 或 p 值阈值</p>
        </div>
      )}

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-cream-50 border border-line rounded-md px-3 py-2 shadow-md text-xs pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="font-medium text-ink mb-1">{tooltip.node.label}</div>
          <div className="text-ink-muted">门：{tooltip.node.phylum}</div>
          <div className="text-ink-muted">度数：{tooltip.node.degree}</div>
          {tooltip.node.isHub && (
            <div className="text-terracotta font-medium mt-0.5">Hub OTU</div>
          )}
        </div>
      )}

      {/* Stats — bottom left */}
      {data && data.nodes.length > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-ink-muted space-y-0.5">
          <div>节点 {data.stats.nodeCount} · 边 {data.stats.edgeCount}</div>
          <div>
            <span style={{ color: params.positiveColor }}>正相关 {posPercent}%</span>
            {' · '}
            <span style={{ color: params.negativeColor }}>负相关 {negPercent}%</span>
          </div>
        </div>
      )}

      {/* Legend — bottom right */}
      {data && data.nodes.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-cream/90 backdrop-blur-sm border border-line rounded-lg p-3 text-xs max-h-72 overflow-y-auto">
          <div className="font-medium text-ink mb-2">图例</div>
          <div className="space-y-1 mb-3">
            {uniquePhyla.map(phylum => (
              <div key={phylum} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: getPhylumColor(phylum) }}
                />
                <span className="text-ink-muted truncate max-w-[140px]">{phylum}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 shrink-0" style={{ backgroundColor: params.positiveColor }} />
              <span className="text-ink-muted">正相关</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 shrink-0" style={{ backgroundColor: params.negativeColor }} />
              <span className="text-ink-muted">负相关</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-terracotta shrink-0" />
              <span className="text-ink-muted">Hub OTU</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
