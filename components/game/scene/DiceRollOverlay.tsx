'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { RiskRollResult, RiskStat } from '@/lib/game/riskCheck'
import { t } from '@/lib/i18n'

interface DiceRollOverlayProps {
  open: boolean
  result: RiskRollResult
  stat: RiskStat
  bonus: number
  onComplete: () => void
}

export function DiceRollOverlay({
  open,
  result,
  stat,
  bonus,
  onComplete,
}: DiceRollOverlayProps) {
  const { game } = t.ui
  const [phase, setPhase] = useState<'rolling' | 'reveal'>('rolling')

  useEffect(() => {
    if (!open) {
      return
    }

    setPhase('rolling')
    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1300)
    const doneTimer = window.setTimeout(() => onComplete(), 2700)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [open, result.roll, onComplete])

  const outcomeLabel = result.success
    ? result.criticalSuccess
      ? game.diceCriticalSuccess
      : game.diceSuccess
    : result.criticalFailure
      ? game.diceCriticalFailure
      : game.diceFailure

  const statName = game.diceStat[stat]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#75685f]">
              {game.diceRolling}
            </p>
            <p className="mt-2 font-cinzel text-lg uppercase tracking-[0.1em] text-[#d8c9be]">
              d20 + {bonus} ({statName}) vs {result.dc}
            </p>

            <div className="relative mt-10 h-28 w-28 [perspective:600px]">
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={
                  phase === 'rolling'
                    ? {
                        rotateX: [0, 360, 720, 1080],
                        rotateY: [0, -270, -540, -810],
                      }
                    : {
                        rotateX: 12,
                        rotateY: -24,
                      }
                }
                transition={
                  phase === 'rolling'
                    ? { duration: 1.2, ease: 'easeInOut' }
                    : { duration: 0.45, ease: 'easeOut' }
                }
              >
                <div className="absolute inset-0 flex items-center justify-center border-2 border-[#5c1f1f] bg-[#120909] shadow-[0_0_40px_rgba(142,31,31,0.35)] [transform:translateZ(14px)]">
                  <span className="font-cinzel text-5xl tabular-nums text-[#efe5dc]">
                    {phase === 'rolling' ? '·' : result.roll}
                  </span>
                </div>
                <div className="absolute inset-0 border border-[#2b2320] bg-[#0a0707] [transform:rotateY(90deg)_translateZ(14px)]" />
                <div className="absolute inset-0 border border-[#2b2320] bg-[#0a0707] [transform:rotateY(180deg)_translateZ(14px)]" />
                <div className="absolute inset-0 border border-[#2b2320] bg-[#0a0707] [transform:rotateY(-90deg)_translateZ(14px)]" />
                <div className="absolute inset-0 border border-[#2b2320] bg-[#0a0707] [transform:rotateX(90deg)_translateZ(14px)]" />
                <div className="absolute inset-0 border border-[#2b2320] bg-[#0a0707] [transform:rotateX(-90deg)_translateZ(14px)]" />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-2"
                >
                  <div className="font-cinzel text-2xl tabular-nums text-[#d6cdc3]">
                    {result.roll} + {bonus} = {result.total}
                  </div>
                  <div
                    className={`text-[13px] uppercase tracking-[0.16em] ${
                      result.success ? 'text-[#8fbc8f]' : 'text-[#d46060]'
                    }`}
                  >
                    {outcomeLabel}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
