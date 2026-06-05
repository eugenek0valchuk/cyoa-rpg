'use client'

import { GameIcon } from '@/components/game/ui/GameIcon'
import type { Origin } from '@/lib/types/game'
import {
  getHotspotIcon,
  type HotspotId,
  type HotspotRegion,
} from '@/lib/hub/roomHotspots'

export interface HotspotBadges {
  stash?: string
  vessel?: string
  chronicle?: string
  threshold?: string
}

interface RoomHotspotLayerProps {
  hotspots: HotspotRegion[]
  labels: Record<HotspotId, { label: string; hint: string }>
  badges?: HotspotBadges
  origin: Origin
  activeId: HotspotId | null
  onSelect: (id: HotspotId) => void
}

export function RoomHotspotLayer({
  hotspots,
  labels,
  badges,
  origin,
  activeId,
  onSelect,
}: RoomHotspotLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {hotspots.map((spot) => {
        const meta = labels[spot.id]
        const icon = getHotspotIcon(spot.id, origin)
        const badge = badges?.[spot.id]
        const isActive = activeId === spot.id

        return (
          <button
            key={spot.id}
            type="button"
            aria-label={`${meta.label}. ${meta.hint}`}
            onClick={() => onSelect(spot.id)}
            className="group pointer-events-auto absolute border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#d46060]/60"
            style={{
              left: `${spot.left}%`,
              top: `${spot.top}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
            }}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{
                background:
                  'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(212,96,96,0.14) 0%, rgba(142,31,31,0.06) 45%, transparent 72%)',
              }}
            />

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div
                className={`hub-hotspot-marker relative flex items-center justify-center transition-transform duration-300 ${
                  isActive
                    ? 'scale-110'
                    : 'scale-100 group-hover:scale-105'
                }`}
              >
                <span
                  className={`absolute inset-[-10px] rounded-full border transition-all duration-500 ${
                    isActive
                      ? 'hub-hotspot-ring-active border-[#d46060]/50'
                      : 'border-[#d46060]/0 group-hover:border-[#d46060]/35'
                  }`}
                />

                <span
                  className={`absolute inset-[-4px] rounded-full bg-[#8e1f1f]/0 transition-all duration-500 ${
                    isActive
                      ? 'hub-hotspot-glow-active bg-[#8e1f1f]/25'
                      : 'group-hover:bg-[#8e1f1f]/15'
                  }`}
                />

                <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#3b2a2a]/80 bg-[#0d0909]/85 shadow-[0_0_20px_rgba(0,0,0,0.65)] backdrop-blur-[2px] sm:h-[58px] sm:w-[58px]">
                  <GameIcon type={icon} size={34} />
                </span>

                {badge && (
                  <span className="font-cinzel absolute -right-1 -top-1 min-w-[22px] rounded-full border border-[#5c1f1f] bg-[#160909] px-1.5 py-0.5 text-center text-[10px] leading-none text-[#d46060] shadow-[0_0_12px_rgba(212,96,96,0.35)]">
                    {badge}
                  </span>
                )}
              </div>

              <div
                className={`mt-3 max-w-[min(220px,28vw)] text-center transition-all duration-300 ${
                  isActive
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'
                }`}
              >
                <div className="rounded border border-[#3b2a2a]/90 bg-[#0d0909]/92 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-sm">
                  <div className="font-cinzel text-[11px] uppercase tracking-[0.14em] text-[#efe5dc] sm:text-[12px]">
                    {meta.label}
                  </div>
                  <div className="mt-1 text-[10px] leading-relaxed text-[#9d8d82] sm:text-[11px]">
                    {meta.hint}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
