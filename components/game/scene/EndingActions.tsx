'use client'

import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { t } from '@/lib/i18n'

interface EndingActionsProps {
  isLoading: boolean
  onReturnToChamber: () => void
}

export function EndingActions({
  isLoading,
  onReturnToChamber,
}: EndingActionsProps) {
  const { game } = t.ui
  const { endingReturn } = t.hub.ui

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="space-y-3 border border-[#4a2323] bg-[#160909]/80 px-4 py-5 sm:px-6"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d46060]">
        <GameIcon type="corruption" size={24} noBlend />
        {game.endingEyebrow}
      </div>

      <p className="text-[14px] leading-relaxed text-[#9d8d82]">
        {game.endingReturnBody}
      </p>

      <button
        type="button"
        onClick={onReturnToChamber}
        disabled={isLoading}
        className="group relative w-full border-2 border-[#5c1f1f] bg-[#160909] text-left transition hover:bg-[#220d0d] hover:shadow-[0_0_24px_rgba(92,31,31,0.2)] disabled:opacity-40"
      >
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <GameIcon type="flag" size={36} noBlend />
          <div className="min-w-0 flex-1">
            <div className="font-cinzel text-[16px] uppercase tracking-[0.1em] text-[#d46060] sm:text-[18px]">
              {endingReturn}
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[#85776a]">
              {game.endingReturnHint}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-[#75685f] transition-transform group-hover:translate-x-0.5 group-hover:text-[#d46060]" />
        </div>
      </button>
    </motion.div>
  )
}
