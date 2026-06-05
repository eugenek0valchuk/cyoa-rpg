'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { renderNarrativeEmphasis } from '@/components/game/shared/NarrativeText'

export type HubToastItem = {
  id: string
  title: string
  body: string
  tone?: 'quest' | 'material' | 'building' | 'puzzle'
}

interface HubToastStackProps {
  items: HubToastItem[]
  onDismiss: (id: string) => void
}

const toneStyles: Record<NonNullable<HubToastItem['tone']>, string> = {
  quest: 'border-[#5c4040] bg-[#140e0e]/95',
  material: 'border-[#4a5c4a] bg-[#0d120d]/95',
  building: 'border-[#5c4a30] bg-[#121008]/95',
  puzzle: 'border-[#4a3a5c] bg-[#100d14]/95',
}

export function HubToastStack({ items, onDismiss }: HubToastStackProps) {
  useEffect(() => {
    if (items.length === 0) {
      return
    }

    const timers = items.map((item) =>
      window.setTimeout(() => onDismiss(item.id), 5200),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [items, onDismiss])

  if (items.length === 0 || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      aria-live="polite"
    >
      {items.slice(-3).map((item) => (
        <div
          key={item.id}
          data-testid="hub-toast"
          className={`pointer-events-auto w-full max-w-md border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-sm ${toneStyles[item.tone ?? 'quest']}`}
        >
          <p className="font-cinzel text-[11px] uppercase tracking-[0.14em] text-[#d46060]">
            {item.title}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#d8c9be]">
            {renderNarrativeEmphasis(item.body)}
          </p>
        </div>
      ))}
    </div>,
    document.body,
  )
}
