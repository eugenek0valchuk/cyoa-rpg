'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { t } from '@/lib/i18n'

const STORAGE_KEY = 'cyoa_raid_tip_dismissed'

interface Props {
  raidDepth: number
  isEndingScene: boolean
}

export function RaidTipBanner({ raidDepth, isEndingScene }: Props) {
  const { game } = t.ui
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isEndingScene || raidDepth > 2) {
      setOpen(false)
      return
    }

    try {
      setOpen(localStorage.getItem(STORAGE_KEY) !== '1')
    } catch {
      setOpen(true)
    }
  }, [isEndingScene, raidDepth])

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
    <div className="mb-3 border border-[#2b3528]/70 bg-[#0a0d0a]/85 px-3 py-2.5">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-[#8a9a82]">
          {game.raidTipBody}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-[#6d5e55] transition hover:text-[#b4c27d]"
          aria-label={game.raidTipDismiss}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
