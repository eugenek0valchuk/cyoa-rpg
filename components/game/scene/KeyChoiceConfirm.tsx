'use client'

import { AnimatePresence, motion } from 'framer-motion'

import {
  computeCorruptionAfterChoice,
  computeSanityAfterChoice,
} from '@/lib/game/sanityPacing'
import type { KeyChoiceMeta } from '@/lib/game/keyChoices'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
import { artifacts } from '@/lib/game/artifacts'
import { t } from '@/lib/i18n'
import type { Character, Choice } from '@/lib/types/game'

interface KeyChoiceConfirmProps {
  open: boolean
  choice: Choice | null
  meta: KeyChoiceMeta | null
  character: Character | null
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
  onConfirm: () => void
  onCancel: () => void
}

export function KeyChoiceConfirm({
  open,
  choice,
  meta,
  character,
  raidModifierId,
  roomMarks = [],
  onConfirm,
  onCancel,
}: KeyChoiceConfirmProps) {
  const { game } = t.ui

  if (!choice || !meta || !character) {
    return null
  }

  const sanityAfter = computeSanityAfterChoice(
    character,
    choice,
    artifacts,
    raidModifierId,
    roomMarks,
  )
  const corruptionAfter = computeCorruptionAfterChoice(
    character,
    choice,
    artifacts,
    raidModifierId,
    roomMarks,
  )

  const sanityLine =
    sanityAfter !== character.sanity
      ? game.sanityProjection
          .replace('{before}', String(character.sanity))
          .replace('{after}', String(sanityAfter))
      : null

  const corruptionLine =
    corruptionAfter !== character.corruption
      ? game.corruptionProjection
          .replace('{before}', String(character.corruption))
          .replace('{after}', String(corruptionAfter))
      : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-black/80 px-4 pb-6 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="dialog"
            aria-labelledby="key-choice-title"
            className="w-full max-w-md border border-[#6a5020]/80 bg-[#120e08] shadow-[0_0_40px_rgba(106,80,32,0.15)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#6a5020]/40 px-5 py-4">
              <p
                id="key-choice-title"
                className="text-[10px] uppercase tracking-[0.2em] text-[#a08040]"
              >
                {game.keyChoiceLabel}
              </p>
              <p className="mt-2 font-cinzel text-[17px] uppercase leading-snug tracking-[0.08em] text-[#e7ded7]">
                {choice.text}
              </p>
            </div>

            <div className="space-y-3 px-5 py-4 text-[13px] leading-relaxed text-[#9a8f82]">
              <p>{meta.consequence}</p>
              {(sanityLine || corruptionLine) && (
                <div className="space-y-1 border-t border-[#2b2320] pt-3 text-[11px] uppercase tracking-[0.1em]">
                  {sanityLine && (
                    <p className="text-[#8b9a7a]">{sanityLine}</p>
                  )}
                  {corruptionLine && (
                    <p className="text-[#a07070]">{corruptionLine}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex border-t border-[#2b2320]">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border-r border-[#2b2320] px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#75685f] transition hover:bg-[#0a0808] hover:text-[#a09080]"
              >
                {game.keyChoiceCancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#d4a850] transition hover:bg-[#1a1408]"
              >
                {game.keyChoiceConfirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
