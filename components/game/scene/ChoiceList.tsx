'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { isChoiceVisible } from '@/lib/game/choiceVisibility'
import {
  getEffectTooltip,
  getFlagTooltip,
  getRelicTooltip,
  getRequirementTooltip,
} from '@/lib/game/choiceTooltips'
import { t } from '@/lib/i18n'
import { Character, Choice } from '@/lib/types/game'
import { GothicTooltip } from '@/components/ui/GothicTooltip'
import { EffectIcon, getEffectColor } from '../ui/EffectIcon'

interface ChoiceListProps {
  options: Choice[]
  character: Character
  onSelect: (id: string) => void
  isLoading?: boolean
}

function IconWell({
  children,
  accent,
  tooltip,
}: {
  children: ReactNode
  accent?: 'met' | 'unmet' | 'default'
  tooltip?: { title: string; body: string }
}) {
  const accentBorder =
    accent === 'met'
      ? 'border-[#3a6a3a]/80'
      : accent === 'unmet'
        ? 'border-[#6a3a3a]/80'
        : 'border-[#2b2320]'

  const well = (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border bg-[#0a0707] shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] ${accentBorder}`}
    >
      {children}
    </span>
  )

  if (!tooltip) {
    return well
  }

  return (
    <GothicTooltip title={tooltip.title} body={tooltip.body}>
      {well}
    </GothicTooltip>
  )
}

function RequirementTag({
  met,
  icon,
  value,
  have,
}: {
  met: boolean
  icon: 'strength' | 'agility' | 'intelligence'
  value: number
  have: number
}) {
  const tooltip = getRequirementTooltip(icon, value, have)

  return (
    <span className="inline-flex items-center gap-2">
      <IconWell accent={met ? 'met' : 'unmet'} tooltip={tooltip}>
        <EffectIcon type={icon} size={28} noBlend />
      </IconWell>
      <span
        className={`font-cinzel text-base tabular-nums ${met ? 'text-[#8fbc8f]' : 'text-[#c09090]'}`}
      >
        {value}
      </span>
    </span>
  )
}

function EffectTag({
  type,
  value,
  label,
}: {
  type: 'sanity' | 'corruption' | 'addArtifact' | 'addFlag'
  value?: number
  label?: string
}) {
  const showValue = value !== undefined

  const tooltip =
    type === 'addArtifact'
      ? getRelicTooltip()
      : type === 'addFlag'
        ? getFlagTooltip()
        : showValue
          ? getEffectTooltip(type, value!)
          : undefined

  return (
    <span className="inline-flex items-center gap-2">
      <IconWell tooltip={tooltip}>
        <EffectIcon type={type} size={28} noBlend />
      </IconWell>
      {label ? (
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#c8b84a]">
          {label}
        </span>
      ) : showValue ? (
        <span
          className="font-cinzel text-base tabular-nums"
          style={{ color: getEffectColor(type) }}
        >
          {value! > 0 ? '+' : ''}
          {value}
        </span>
      ) : null}
    </span>
  )
}

function ChoiceMeta({
  option,
  character,
}: {
  option: Choice
  character: Character
}) {
  const { game } = t.ui
  const req = option.requirements
  const tags: { key: string; node: ReactNode }[] = []

  if (req?.strength !== undefined) {
    tags.push({
      key: 'str',
      node: (
        <RequirementTag
          met={character.stats.strength >= req.strength}
          icon="strength"
          value={req.strength}
          have={character.stats.strength}
        />
      ),
    })
  }

  if (req?.agility !== undefined) {
    tags.push({
      key: 'agi',
      node: (
        <RequirementTag
          met={character.stats.agility >= req.agility}
          icon="agility"
          value={req.agility}
          have={character.stats.agility}
        />
      ),
    })
  }

  if (req?.intelligence !== undefined) {
    tags.push({
      key: 'int',
      node: (
        <RequirementTag
          met={character.stats.intelligence >= req.intelligence}
          icon="intelligence"
          value={req.intelligence}
          have={character.stats.intelligence}
        />
      ),
    })
  }

  if (option.effects?.addArtifact) {
    tags.push({
      key: 'art',
      node: <EffectTag type="addArtifact" label={game.choiceRelic} />,
    })
  }

  if (option.effects?.addFlag) {
    tags.push({
      key: 'flag',
      node: <EffectTag type="addFlag" label={game.choiceFlag} />,
    })
  }

  if (option.effects?.sanity !== undefined) {
    tags.push({
      key: 'san',
      node: <EffectTag type="sanity" value={option.effects.sanity} />,
    })
  }

  if (option.effects?.corruption !== undefined) {
    tags.push({
      key: 'cor',
      node: <EffectTag type="corruption" value={option.effects.corruption} />,
    })
  }

  if (req?.minCorruption || req?.maxSanity) {
    tags.push({
      key: 'cond',
      node: (
        <span className="self-center text-[10px] uppercase tracking-[0.1em] text-[#8b5e5e]">
          {req.minCorruption && `${game.reqCorruption} ${req.minCorruption}+ `}
          {req.maxSanity && `${game.reqSanity} ≤ ${req.maxSanity}`}
        </span>
      ),
    })
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span key={tag.key}>{tag.node}</span>
      ))}
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
    <div className="max-h-[min(42vh,360px)] overflow-y-auto pr-0.5 chronicle-scrollbar scroll-smooth">
      <div className="space-y-2">
        {visibleOptions.map((option, index) => {
          const available = isChoiceAvailable(option, character)

          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={!available || isLoading}
              onClick={() => onSelect(option.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group relative w-full border text-left transition-all duration-300 ${
                available
                  ? 'border-[#2b2320] bg-[#0c0909]/95 hover:border-[#8e1f1f]/70 hover:bg-[#140d0d] hover:shadow-[0_0_24px_rgba(92,31,31,0.12)]'
                  : 'cursor-not-allowed border-[#181212] bg-[#0a0808]/80 opacity-45'
              }`}
            >
              <div className="absolute inset-y-0 left-0 w-[2px] bg-[#8e1f1f] opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-cinzel text-[15px] uppercase leading-snug tracking-[0.08em] text-[#e7ded7] sm:text-[17px]">
                      {option.text}
                    </div>
                    <ChoiceMeta option={option} character={character} />
                  </div>

                  <ChevronRight
                    className={`mt-1 h-5 w-5 shrink-0 transition-transform ${
                      available
                        ? 'text-[#75685f] group-hover:translate-x-0.5 group-hover:text-[#d46060]'
                        : 'text-[#4c433d]'
                    }`}
                  />
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
