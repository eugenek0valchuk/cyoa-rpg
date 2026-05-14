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
      className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[12px] uppercase tracking-[0.2em] ${
        met
          ? 'bg-[#1a2a1a]/60 text-[#7da87d] border border-[#2a4a2a]/40'
          : 'bg-[#2a1a1a]/60 text-[#a87d7d] border border-[#4a2a2a]/40'
      }`}
    >
      <EffectIcon type={type} size={16} />
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
    <div className="inline-flex items-center gap-1.5 text-[14px] text-[#75685f]">
      <EffectIcon type={type} size={16} />
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
    <div className="space-y-3">
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
              group relative w-full border-2 bg-[#0c0909]/95 text-left
              transition-all duration-500

              ${
                available
                  ? `
                    border-[#2b2320] shadow-[inset_0_0_0_1px_rgba(43,35,32,0.3)]
                    hover:border-[#8e1f1f]/80 hover:bg-[#140d0d]
                    hover:shadow-[inset_0_0_0_1px_rgba(142,31,31,0.2),_0_0_40px_rgba(92,31,31,0.15)]
                  `
                  : `
                    cursor-not-allowed border-[#181212] opacity-40 shadow-[inset_0_0_0_1px_rgba(24,18,18,0.2)]
                  `
              }
            `}
          >
            <div className="absolute inset-y-2 left-0 w-[3px] bg-gradient-to-b from-transparent via-[#8e1f1f]/60 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:via-[#8e1f1f]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,20,20,0.08),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="font-cinzel text-[18px] uppercase tracking-[0.12em] text-[#e7ded7]">
                  {option.text}
                </div>

                {(req?.strength || req?.agility || req?.intelligence) && (
                  <div className="mt-2 flex flex-wrap gap-2">
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
                  <div className="mt-2 text-[13px] uppercase tracking-[0.25em] text-[#8b5e5e]">
                    {req.minCorruption && (
                      <span>Corruption {req.minCorruption}+ </span>
                    )}
                    {req.maxSanity && <span>Sanity ≤ {req.maxSanity}</span>}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {option.effects?.addArtifact && (
                  <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#2a2a1a]/60 px-3 py-1 text-[12px] uppercase tracking-[0.2em] text-[#c8b84a] border border-[#4a4a2a]/40">
                    <EffectIcon type="addArtifact" size={16} />
                    Relic
                  </div>
                )}

                {option.effects?.addFlag && (
                  <div className="inline-flex items-center gap-1.5 text-[14px] text-[#7da87d]">
                    <EffectIcon type="addFlag" size={16} />
                    Flag
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
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
