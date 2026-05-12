'use client'

import { motion } from 'framer-motion'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { isChoiceVisible } from '@/lib/game/choiceVisibility'

import type { Character, Choice } from '@/lib/types/game'

interface ChoiceListProps {
  options: Choice[]

  character: Character

  onSelect: (id: string) => void

  isLoading?: boolean
}

export function ChoiceList({
  options,
  character,
  onSelect,
  isLoading,
}: ChoiceListProps) {
  const visibleOptions = options.filter((option) =>
    isChoiceVisible(option, character),
  )

  return (
    <div className="space-y-4">
      {visibleOptions.map((option, index) => {
        const available = isChoiceAvailable(option, character)

        return (
          <motion.button
            key={option.id}
            type="button"
            disabled={!available || isLoading}
            onClick={() => onSelect(option.id)}
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.06,
            }}
            className={`
              group
              relative
              w-full
              overflow-hidden
              border
              bg-[#0c0909]/90
              px-6
              py-5
              text-left
              transition-all
              duration-300

              ${
                available
                  ? `
                    border-[#241919]
                    hover:border-[#5c1f1f]
                    hover:bg-[#140d0d]
                  `
                  : `
                    cursor-not-allowed
                    border-[#181212]
                    opacity-40
                  `
              }
            `}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,20,20,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between gap-6">
              <div>
                <div className="font-cinzel text-[15px] uppercase tracking-[0.12em] text-[#e7ded7]">
                  {option.text}
                </div>

                {option.requirements?.minCorruption && (
                  <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#8b5e5e]">
                    Requires corruption {option.requirements.minCorruption}
                  </div>
                )}

                {option.requirements?.maxSanity && (
                  <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#8b5e5e]">
                    Requires sanity below {option.requirements.maxSanity}
                  </div>
                )}
              </div>

              <div className="mt-1 h-px w-16 bg-gradient-to-r from-[#5c1f1f] to-transparent opacity-60 transition-all duration-300 group-hover:w-24 group-hover:opacity-100" />
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
