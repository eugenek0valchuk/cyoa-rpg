'use client'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { isChoiceVisible } from '@/lib/game/choiceVisibility'
import { Choice, Character } from '@/lib/types/game'
import { EffectIcon } from '../ui/EffectIcon'
import { motion } from 'framer-motion'

interface ChoiceListProps {
  options: Choice[]

  character: Character

  onSelect: (id: string) => void

  isLoading?: boolean
}

function RequirementBadge({
  type,
  value,
  met,
}: {
  type: 'strength' | 'agility' | 'intelligence'
  value: number
  met: boolean
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] ${
        met
          ? 'bg-[#1a2a1a]/60 text-[#7da87d]'
          : 'bg-[#2a1a1a]/60 text-[#a87d7d]'
      }`}
    >
      <EffectIcon type={type} size={10} />
      {value}
    </div>
  )
}

function EffectBadge({
  type,
  value,
}: {
  type: 'sanity' | 'corruption'
  value: number
}) {
  return (
    <div className="inline-flex items-center gap-1 text-[10px] text-[#75685f]">
      <EffectIcon type={type} size={10} />
      <span className={value < 0 ? 'text-[#a87d7d]' : 'text-[#7da87d]'}>
        {value > 0 ? '+' : ''}
        {value}
      </span>
    </div>
  )
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
        const req = option.requirements

        return (
          <motion.button
            key={option.id}
            type="button"
            disabled={!available || isLoading}
            onClick={() => onSelect(option.id)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className={`
              group relative w-full overflow-hidden border bg-[#0c0909]/90 px-6 py-5 text-left
              transition-all duration-300

              ${
                available
                  ? `
                    border-[#241919]
                    hover:border-[#5c1f1f]
                    hover:bg-[#140d0d]
                    hover:shadow-[0_0_30px_rgba(92,31,31,0.15)]
                  `
                  : `
                    cursor-not-allowed border-[#181212] opacity-40
                  `
              }
            `}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,20,20,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="font-cinzel text-[15px] uppercase tracking-[0.12em] text-[#e7ded7]">
                  {option.text}
                </div>

                {(req?.strength || req?.agility || req?.intelligence) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {req.strength !== undefined && (
                      <RequirementBadge
                        type="strength"
                        value={req.strength}
                        met={character.stats.strength >= req.strength}
                      />
                    )}
                    {req.agility !== undefined && (
                      <RequirementBadge
                        type="agility"
                        value={req.agility}
                        met={character.stats.agility >= req.agility}
                      />
                    )}
                    {req.intelligence !== undefined && (
                      <RequirementBadge
                        type="intelligence"
                        value={req.intelligence}
                        met={character.stats.intelligence >= req.intelligence}
                      />
                    )}
                  </div>
                )}

                {(req?.minCorruption || req?.maxSanity) && (
                  <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#8b5e5e]">
                    {req.minCorruption && (
                      <span>Corruption {req.minCorruption}+ </span>
                    )}
                    {req.maxSanity && <span>Sanity ≤ {req.maxSanity}</span>}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {option.effects?.addArtifact && (
                  <div className="inline-flex items-center gap-1 rounded bg-[#2a2a1a]/60 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#c8b84a]">
                    <EffectIcon type="addArtifact" size={10} />
                    Relic
                  </div>
                )}

                {option.effects?.addFlag && (
                  <div className="inline-flex items-center gap-1 text-[10px] text-[#7da87d]">
                    <EffectIcon type="addFlag" size={10} />
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2">
                  {option.effects?.sanity !== undefined && (
                    <EffectBadge type="sanity" value={option.effects.sanity} />
                  )}
                  {option.effects?.corruption !== undefined && (
                    <EffectBadge
                      type="corruption"
                      value={option.effects.corruption}
                    />
                  )}
                </div>

                <div className="mt-1 h-px w-16 bg-gradient-to-r from-[#5c1f1f] to-transparent opacity-60 transition-all duration-300 group-hover:w-24 group-hover:opacity-100" />
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
