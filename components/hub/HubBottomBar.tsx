'use client'

import { GameIcon, type GameIconProps } from '@/components/game/ui/GameIcon'
import type { Origin } from '@/lib/types/game'
import type { HotspotId } from '@/lib/hub/roomHotspots'

type HubBottomModalId = HotspotId | 'merchant'

interface HubBottomBarProps {
  labels: {
    stash: string
    vessel: string
    chronicle: string
    scribe?: string
    merchant?: string
    descend: string
    archives: string
  }
  origin: Origin
  activeId: HubBottomModalId | null
  modalOpen: boolean
  showScribe?: boolean
  showMerchant?: boolean
  onSelect: (id: HubBottomModalId | null) => void
  onArchives: () => void
}

const CORE_ITEMS: {
  id: HotspotId
  key: keyof HubBottomBarProps['labels']
  icon: GameIconProps['type']
}[] = [
  { id: 'stash', key: 'stash', icon: 'artifact' },
  { id: 'vessel', key: 'vessel', icon: 'sanity' },
  { id: 'chronicle', key: 'chronicle', icon: 'flag' },
]

const ORIGIN_ICON: Record<Origin, GameIconProps['type']> = {
  hollow: 'hollow',
  heretic: 'heretic',
  witness: 'witness',
}

export function HubBottomBar({
  labels,
  origin,
  activeId,
  modalOpen,
  showScribe = false,
  showMerchant = false,
  onSelect,
  onArchives,
}: HubBottomBarProps) {
  const handleSelect = (id: HubBottomModalId) => {
    onSelect(activeId === id ? null : id)
  }

  const barItems: {
    id: HubBottomModalId
    key: keyof HubBottomBarProps['labels']
    icon: GameIconProps['type']
  }[] = [
    ...CORE_ITEMS.map((item) =>
      item.id === 'vessel'
        ? { ...item, icon: ORIGIN_ICON[origin] }
        : item,
    ),
    ...(showScribe && labels.scribe
      ? [{ id: 'scribe' as const, key: 'scribe' as const, icon: 'intelligence' as const }]
      : []),
      ...(showMerchant && labels.merchant
      ? [{ id: 'merchant' as const, key: 'merchant' as const, icon: 'merchant' as const }]
      : []),
    { id: 'threshold' as const, key: 'descend' as const, icon: 'flag' as const },
  ]

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-40 border-t border-[#2b2320]/90 bg-gradient-to-t from-black via-black/95 to-black/70 px-3 py-3 transition-opacity sm:px-6 sm:py-4 ${
        modalOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-stretch justify-center gap-2 sm:gap-3">
        {barItems.map(({ id, key, icon }) => {
          const isActive = activeId === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 border px-2 py-2.5 transition sm:gap-2 sm:px-3 sm:py-3 ${
                isActive
                  ? 'border-[#8e1f1f] bg-[#160909] text-[#d46060]'
                  : 'border-[#2b2320] bg-[#0d0909]/80 text-[#9d8d82] hover:border-[#5c1f1f] hover:text-[#d8c9be]'
              }`}
            >
              <GameIcon type={icon} size={40} />
              <span className="text-[10px] uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.12em]">
                {labels[key] ?? id}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onArchives}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 border border-[#2b2320] bg-[#0d0909]/80 px-3 py-2.5 text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060] sm:gap-2 sm:px-4 sm:py-3"
        >
          <GameIcon type="witness" size={36} />
          <span className="text-[10px] uppercase tracking-[0.1em] sm:text-[11px]">
            {labels.archives}
          </span>
        </button>
      </div>
    </div>
  )
}
