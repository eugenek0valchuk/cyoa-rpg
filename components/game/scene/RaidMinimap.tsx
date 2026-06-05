'use client'

import { useId, useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import {
  buildSceneAdjacency,
  getSceneMapNodes,
  type SceneMapNode,
} from '@/lib/game/sceneGraph'
import type { RaidZone } from '@/lib/game/zones'
import { t } from '@/lib/i18n'

const ZONE_COLORS: Record<SceneMapNode['zone'], string> = {
  surface: '#6a8f6a',
  depth: '#7a8a9a',
  fracture: '#9a7a8a',
  collapse: '#c46060',
  event: '#a89060',
}

interface Props {
  currentSceneId: string
  sceneHistoryIds: string[]
  reachableTargets: string[]
  onNavigate: (sceneId: string) => void
  disabled?: boolean
}

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join(':')
}

function buildViewBounds(
  visibleNodes: SceneMapNode[],
  currentSceneId: string,
  allNodes: SceneMapNode[],
): { minX: number; minY: number; width: number; height: number } {
  if (visibleNodes.length === 0) {
    const current = allNodes.find((node) => node.id === currentSceneId)
    if (current) {
      return {
        minX: current.x - 0.9,
        minY: current.y - 0.9,
        width: 1.8,
        height: 1.8,
      }
    }
    return { minX: 0, minY: 0, width: 2, height: 2 }
  }

  const xs = visibleNodes.map((node) => node.x)
  const ys = visibleNodes.map((node) => node.y)
  const padding = 0.7
  const minX = Math.min(...xs) - padding
  const minY = Math.min(...ys) - padding
  const width = Math.max(...xs) - minX + padding * 2
  const height = Math.max(...ys) - minY + padding * 2

  return { minX, minY, width, height }
}

function truncateLabel(label: string, max = 14): string {
  if (label.length <= max) {
    return label
  }

  return `${label.slice(0, max - 1)}…`
}

function diamondPoints(cx: number, cy: number, size: number): string {
  return [
    `${cx},${cy - size}`,
    `${cx + size},${cy}`,
    `${cx},${cy + size}`,
    `${cx - size},${cy}`,
  ].join(' ')
}

function MapDiamond({
  cx,
  cy,
  size,
  fill,
  stroke,
  strokeWidth = 0.04,
  opacity = 1,
  className,
  onClick,
  title,
}: {
  cx: number
  cy: number
  size: number
  fill: string
  stroke: string
  strokeWidth?: number
  opacity?: number
  className?: string
  onClick?: () => void
  title?: string
}) {
  return (
    <polygon
      points={diamondPoints(cx, cy, size)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      opacity={opacity}
      className={className}
      onClick={onClick}
    >
      {title ? <title>{title}</title> : null}
    </polygon>
  )
}

export function RaidMinimap({
  currentSceneId,
  sceneHistoryIds,
  reachableTargets,
  onNavigate,
  disabled = false,
}: Props) {
  const { ui: raidText } = t.raid
  const glowId = useId().replace(/:/g, '')
  const nodes = useMemo(() => getSceneMapNodes(), [])
  const adjacency = useMemo(() => buildSceneAdjacency(), [])

  const nodeById = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  )

  const visited = useMemo(
    () => new Set([...sceneHistoryIds, currentSceneId]),
    [sceneHistoryIds, currentSceneId],
  )

  const reachable = useMemo(() => new Set(reachableTargets), [reachableTargets])

  const visibleNodes = useMemo(
    () => nodes.filter((node) => visited.has(node.id)),
    [nodes, visited],
  )

  const viewBounds = useMemo(
    () => buildViewBounds(visibleNodes, currentSceneId, nodes),
    [visibleNodes, currentSceneId, nodes],
  )

  const viewBox = `${viewBounds.minX} ${viewBounds.minY} ${viewBounds.width} ${viewBounds.height}`

  const historyPathEdges = useMemo(() => {
    const path = new Set<string>()
    const ordered = [...sceneHistoryIds]

    for (let index = 1; index < ordered.length; index += 1) {
      path.add(edgeKey(ordered[index - 1]!, ordered[index]!))
    }

    if (ordered.length > 0 && ordered[ordered.length - 1] !== currentSceneId) {
      const last = ordered[ordered.length - 1]!
      const neighbors = adjacency.get(last) ?? new Set()
      if (neighbors.has(currentSceneId)) {
        path.add(edgeKey(last, currentSceneId))
      }
    }

    return path
  }, [adjacency, currentSceneId, sceneHistoryIds])

  const edges = useMemo(() => {
    const lines: Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      key: string
      onPath: boolean
      touchesCurrent: boolean
    }> = []
    const byId = new Map(nodes.map((node) => [node.id, node]))

    for (const node of nodes) {
      const neighbors = adjacency.get(node.id) ?? new Set()

      for (const neighborId of neighbors) {
        if (node.id > neighborId) {
          continue
        }

        if (!visited.has(node.id) || !visited.has(neighborId)) {
          continue
        }

        const other = byId.get(neighborId)
        if (!other) {
          continue
        }

        const key = edgeKey(node.id, neighborId)
        lines.push({
          x1: node.x,
          y1: node.y,
          x2: other.x,
          y2: other.y,
          key,
          onPath: historyPathEdges.has(key),
          touchesCurrent:
            node.id === currentSceneId || neighborId === currentSceneId,
        })
      }
    }

    return lines
  }, [adjacency, currentSceneId, historyPathEdges, nodes, visited])

  const backtrackTargets = useMemo(
    () =>
      reachableTargets
        .filter((id) => id !== currentSceneId)
        .map((id) => nodeById.get(id))
        .filter((node): node is SceneMapNode => node != null),
    [reachableTargets, currentSceneId, nodeById],
  )

  const currentNode = nodeById.get(currentSceneId)
  const visitedZones = useMemo(() => {
    const zones = new Set<RaidZone>()
    for (const node of visibleNodes) {
      if (node.zone !== 'event') {
        zones.add(node.zone as RaidZone)
      }
    }
    return [...zones]
  }, [visibleNodes])

  return (
    <section
      className="relative w-[14rem] overflow-hidden border border-[#2b2320]/90 bg-[#0a0707]/94 shadow-[inset_0_0_40px_rgba(0,0,0,0.55)] backdrop-blur-[2px] sm:w-[15.5rem]"
      data-testid="raid-minimap"
      title={raidText.mapHint}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(142,31,31,0.08),transparent_62%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l border-t border-[#8e1f1f]/25" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 border-b border-r border-[#8e1f1f]/25" />

      <header className="relative border-b border-[#241919] px-3 py-2.5">
        <div className="text-[9px] uppercase tracking-[0.28em] text-[#6d5e55]">
          {raidText.mapTitle}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[#2b2320] bg-[#0a0707]">
              <GameIcon type="flag" size={18} noBlend />
            </span>
            <span className="font-cinzel truncate text-[13px] uppercase tracking-[0.08em] text-[#efe5dc]">
              {truncateLabel(currentNode?.label ?? '—', 16)}
            </span>
          </div>
          <span className="shrink-0 border border-[#2b2320] bg-[#0d0909]/90 px-2 py-0.5 font-cinzel text-[11px] tabular-nums text-[#85776a]">
            {visited.size}
          </span>
        </div>
      </header>

      <div className="relative px-2.5 pb-2 pt-2">
        <div className="relative border border-[#241919] bg-[#080606]/90 p-1.5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

          <svg
            viewBox={viewBox}
            className="relative aspect-square h-44 w-full sm:h-[11.5rem]"
            role="img"
            aria-label={raidText.mapTitle}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id={`${glowId}-depth`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#141a14" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#0d0d12" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#160d0d" stopOpacity="1" />
              </linearGradient>
              <filter
                id={`${glowId}-pulse`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="0.06" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x={viewBounds.minX}
              y={viewBounds.minY}
              width={viewBounds.width}
              height={viewBounds.height}
              fill={`url(#${glowId}-depth)`}
            />

            <line
              x1={viewBounds.minX + viewBounds.width / 2}
              y1={viewBounds.minY}
              x2={viewBounds.minX + viewBounds.width / 2}
              y2={viewBounds.minY + viewBounds.height}
              stroke="#3a2828"
              strokeWidth={0.03}
              strokeOpacity={0.35}
            />

            {edges.map((edge) => {
              const cx1 = edge.x1 + 0.5
              const cy1 = edge.y1 + 0.5
              const cx2 = edge.x2 + 0.5
              const cy2 = edge.y2 + 0.5

              return (
                <g key={edge.key}>
                  <line
                    x1={cx1}
                    y1={cy1}
                    x2={cx2}
                    y2={cy2}
                    stroke={
                      edge.touchesCurrent
                        ? '#8e1f1f'
                        : edge.onPath
                          ? '#5c3030'
                          : '#2e2220'
                    }
                    strokeWidth={edge.onPath ? 0.1 : 0.06}
                    strokeOpacity={edge.onPath ? 0.95 : 0.45}
                    strokeDasharray={edge.onPath ? undefined : '0.14 0.1'}
                    strokeLinecap="square"
                  />
                </g>
              )
            })}

            {nodes.map((node) => {
              const isCurrent = node.id === currentSceneId
              const isVisited = visited.has(node.id)
              const canGo = reachable.has(node.id)

              if (!isVisited) {
                return null
              }

              const cx = node.x + 0.5
              const cy = node.y + 0.5
              const fill = isCurrent
                ? '#8e1f1f'
                : canGo
                  ? '#120d0d'
                  : '#1a1410'
              const stroke = isCurrent
                ? '#d46060'
                : canGo
                  ? ZONE_COLORS[node.zone]
                  : node.isExit
                    ? '#c9a060'
                    : '#3a3028'

              return (
                <g key={node.id}>
                  {isCurrent && (
                    <>
                      <MapDiamond
                        cx={cx}
                        cy={cy}
                        size={0.34}
                        fill="none"
                        stroke="#d46060"
                        strokeWidth={0.04}
                        opacity={0.45}
                      />
                      <MapDiamond
                        cx={cx}
                        cy={cy}
                        size={0.26}
                        fill="none"
                        stroke="#d46060"
                        strokeWidth={0.03}
                        opacity={0.25}
                      />
                    </>
                  )}
                  {canGo && !isCurrent && (
                    <MapDiamond
                      cx={cx}
                      cy={cy}
                      size={0.28}
                      fill="none"
                      stroke={ZONE_COLORS[node.zone]}
                      strokeWidth={0.035}
                      opacity={0.65}
                    />
                  )}
                  <MapDiamond
                    cx={cx}
                    cy={cy}
                    size={isCurrent ? 0.2 : 0.15}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={node.isExit ? 0.055 : 0.04}
                    className={canGo && !disabled ? 'cursor-pointer' : undefined}
                    onClick={() => {
                      if (canGo && !disabled) {
                        onNavigate(node.id)
                      }
                    }}
                    title={node.label}
                  />
                  {isCurrent && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={0.06}
                      fill="#efe5dc"
                      filter={`url(#${glowId}-pulse)`}
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {visitedZones.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visitedZones.map((zone) => (
              <span
                key={zone}
                className="border border-[#2b2320] bg-[#0d0909]/80 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.1em]"
                style={{ color: ZONE_COLORS[zone] }}
              >
                {raidText.zones[zone]}
              </span>
            ))}
          </div>
        )}
      </div>

      {backtrackTargets.length > 0 && (
        <footer className="relative border-t border-[#241919] px-2.5 py-2.5">
          <div className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#6d5e55]">
            {raidText.mapBack}
          </div>

          <div className="flex flex-col gap-1.5">
            {backtrackTargets.map((node) => (
              <button
                key={node.id}
                type="button"
                disabled={disabled}
                title={node.label}
                onClick={() => onNavigate(node.id)}
                className={`group relative w-full border text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  node.isExit
                    ? 'border-[#4a3a1a]/70 bg-[#120e08]/90 hover:border-[#6a5020] hover:bg-[#161009]'
                    : 'border-[#2b2320] bg-[#0c0909]/95 hover:border-[#8e1f1f]/70 hover:bg-[#140d0d]'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 w-[2px] opacity-70 transition-opacity group-hover:opacity-100"
                  style={{
                    backgroundColor: node.isExit
                      ? '#c9a060'
                      : ZONE_COLORS[node.zone],
                  }}
                />
                <div className="flex items-center gap-1.5 px-2.5 py-2">
                  <ChevronLeft className="h-3 w-3 shrink-0 text-[#75685f] group-hover:text-[#d46060]" />
                  <span
                    className={`min-w-0 truncate text-[10px] uppercase tracking-[0.08em] ${
                      node.isExit ? 'text-[#c9a060]' : 'text-[#9d8d82]'
                    }`}
                  >
                    {truncateLabel(node.label)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </footer>
      )}
    </section>
  )
}
