'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { t } from '@/lib/i18n'

const STORAGE_KEY = 'cyoa_hub_onboarding_dismissed'

export function HubOnboardingBanner() {
  const { game } = t.ui
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(STORAGE_KEY) !== '1')
    } catch {
      setOpen(true)
    }
  }, [])

  if (!open) {
    return null
  }

  const dismiss = () => {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="pointer-events-auto mb-3 max-w-xl border border-[#2b3528]/80 bg-[#0a0d0a]/95 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-cinzel text-sm uppercase tracking-[0.12em] text-[#b4c27d]">
            {game.hubOnboardingTitle}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[#8a9a82]">
            {game.hubOnboardingBody}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[#6a8f6a] transition hover:text-[#b4c27d]"
          >
            {game.hubOnboardingDismiss}
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-[#6d5e55] transition hover:text-[#b4c27d]"
          aria-label={game.hubOnboardingDismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
