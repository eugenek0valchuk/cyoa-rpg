'use client'

import type { HotspotId, HotspotRegion } from '@/lib/hub/roomHotspots'

interface RoomHotspotLayerProps {
  hotspots: HotspotRegion[]
  labels: Record<HotspotId, { label: string; hint: string }>
  activeId: HotspotId | null
  onSelect: (id: HotspotId) => void
}

export function RoomHotspotLayer({
  hotspots,
  labels,
  activeId,
  onSelect,
}: RoomHotspotLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {hotspots.map((spot) => {
        const meta = labels[spot.id]

        return (
          <button
            key={spot.id}
            type="button"
            title={`${meta.label} — ${meta.hint}`}
            onClick={() => onSelect(spot.id)}
            className={`group pointer-events-auto absolute rounded-sm border transition-all duration-300 ${
              activeId === spot.id
                ? 'border-[#d46060]/90 bg-[#8e1f1f]/25 shadow-[0_0_24px_rgba(212,96,96,0.35)]'
                : 'border-[#d46060]/0 bg-[#8e1f1f]/0 hover:border-[#d46060]/50 hover:bg-[#8e1f1f]/15'
            }`}
            style={{
              left: `${spot.left}%`,
              top: `${spot.top}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
            }}
          >
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-[#3b2a2a] bg-[#0d0909]/95 px-2 py-1 text-[11px] text-[#d8c9be] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {meta.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
