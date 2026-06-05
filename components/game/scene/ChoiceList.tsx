'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { artifacts } from '@/lib/game/artifacts'
import { getChoiceBlockReason } from '@/lib/game/choiceBlockReason'
import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { isChoiceVisible } from '@/lib/game/choiceVisibility'
import type { ChoiceBlockReason } from '@/lib/game/choiceBlockReason'
import { inferChoiceIntent } from '@/lib/game/choiceIntent'
import {
  computeCorruptionAfterChoice,
  computeSanityAfterChoice,
  isDangerousSanityChoice,
} from '@/lib/game/sanityPacing'
import {
  getRiskOffer,
  RISK_FAILURE_CORRUPTION,
  RISK_FAILURE_SANITY,
} from '@/lib/game/riskCheck'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
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
  journalEntries?: string[]
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
  onSelect: (optionIndex: number) => void
  onRiskSelect?: (optionIndex: number) => void
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

const INTENT_STYLES = {
  deeper: 'border-[#4a2323]/80 text-[#d46060] bg-[#160909]/80',
  retreat: 'border-[#2b3528]/80 text-[#8a9a82] bg-[#0a0d0a]/80',
  risk: 'border-[#6a2020]/80 text-[#e07070] bg-[#1a0808]/80',
  lore: 'border-[#2a2a4a]/80 text-[#92a6dd] bg-[#0a0a14]/80',
  rest: 'border-[#2a3d2a]/80 text-[#8fbc8f] bg-[#0a120a]/80',
  neutral: 'border-[#2b2320] text-[#75685f] bg-[#0a0808]/80',
} as const

function ChoiceIntentBadge({ option }: { option: Choice }) {
  const intent = inferChoiceIntent(option)
  const { game } = t.ui

  if (intent === 'neutral') {
    return null
  }

  return (
    <span
      className={`inline-flex shrink-0 border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${INTENT_STYLES[intent]}`}
    >
      {game.choiceIntent[intent]}
    </span>
  )
}

function formatBlockReason(reason: ChoiceBlockReason): string {
  const { game } = t.ui

  switch (reason.kind) {
    case 'strength':
      return game.choiceBlockedStrength
        .replace('{need}', String(reason.need))
        .replace('{have}', String(reason.have))
    case 'agility':
      return game.choiceBlockedAgility
        .replace('{need}', String(reason.need))
        .replace('{have}', String(reason.have))
    case 'intelligence':
      return game.choiceBlockedIntelligence
        .replace('{need}', String(reason.need))
        .replace('{have}', String(reason.have))
    case 'origin':
      return game.choiceBlockedOrigin
    case 'corruption':
      return game.choiceBlockedCorruption
        .replace('{need}', String(reason.need))
        .replace('{have}', String(reason.have))
    case 'sanity':
      return game.choiceBlockedSanity
        .replace('{max}', String(reason.max))
        .replace('{have}', String(reason.have))
    case 'flag':
      return game.choiceBlockedFlag
    case 'artifact':
      return game.choiceBlockedArtifact
    case 'journal':
      return game.choiceBlockedJournal
  }
}

function CorruptionProjection({
  option,
  character,
  raidModifierId,
  roomMarks,
}: {
  option: Choice
  character: Character
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
}) {
  const { game } = t.ui
  const projected = computeCorruptionAfterChoice(
    character,
    option,
    artifacts,
    raidModifierId,
    roomMarks,
  )

  if (projected === character.corruption) {
    return null
  }

  const label = game.corruptionProjection
    .replace('{before}', String(character.corruption))
    .replace('{after}', String(projected))

  return (
    <div className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#a07070]">
      {label}
    </div>
  )
}

function SanityProjection({
  option,
  character,
  raidModifierId,
  roomMarks,
}: {
  option: Choice
  character: Character
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
}) {
  const { game } = t.ui
  const projected = computeSanityAfterChoice(
    character,
    option,
    artifacts,
    raidModifierId,
    roomMarks,
  )

  if (projected === character.sanity) {
    return null
  }

  const dangerous = isDangerousSanityChoice(
    character,
    option,
    artifacts,
    raidModifierId,
    roomMarks,
  )

  const label = game.sanityProjection
    .replace('{before}', String(character.sanity))
    .replace('{after}', String(projected))

  return (
    <div
      className={`mt-2 text-[11px] uppercase tracking-[0.1em] ${
        dangerous ? 'text-[#c06060]' : 'text-[#8b9a7a]'
      }`}
    >
      {label}
      {raidModifierId ? ` (${game.modifierSanityNote})` : ''}
      {dangerous ? ` — ${game.sanityDanger}` : ''}
    </div>
  )
}

export function ChoiceList({
  options,
  character,
  journalEntries = [],
  raidModifierId,
  roomMarks = [],
  onSelect,
  onRiskSelect,
  isLoading,
}: ChoiceListProps) {
  const visibleOptions = options.filter((option) =>
    isChoiceVisible(option, character, journalEntries),
  )

  if (visibleOptions.length === 0) {
    return (
      <p className="border border-[#241919] bg-[#0a0808]/80 px-4 py-3 text-[13px] leading-relaxed text-[#85776a]">
        {t.ui.game.noChoicesVisible}
      </p>
    )
  }

  return (
    <div className="max-h-[min(42vh,360px)] overflow-y-auto pr-0.5 chronicle-scrollbar scroll-smooth">
      <div className="space-y-2">
        {options.map((option, index) => {
          if (!isChoiceVisible(option, character, journalEntries)) {
            return null
          }

          const available = isChoiceAvailable(option, character, journalEntries)
          const blockReason = getChoiceBlockReason(
            option,
            character,
            journalEntries,
          )
          const riskOffer = getRiskOffer(option, character, journalEntries)

          return (
            <div key={`${option.id}-${index}`} className="space-y-1.5">
            <motion.button
              type="button"
              disabled={!available || isLoading}
              onClick={() => onSelect(index)}
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
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-cinzel text-[15px] uppercase leading-snug tracking-[0.08em] text-[#e7ded7] sm:text-[17px]">
                        {option.text}
                      </div>
                      <ChoiceIntentBadge option={option} />
                    </div>
                    <ChoiceMeta option={option} character={character} />
                    <SanityProjection
                      option={option}
                      character={character}
                      raidModifierId={raidModifierId}
                      roomMarks={roomMarks}
                    />
                    <CorruptionProjection
                      option={option}
                      character={character}
                      raidModifierId={raidModifierId}
                      roomMarks={roomMarks}
                    />
                    {!available && blockReason && (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#8b5e5e]">
                        {formatBlockReason(blockReason)}
                      </p>
                    )}
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

            {riskOffer && onRiskSelect && (
              <motion.button
                type="button"
                disabled={isLoading}
                onClick={() => onRiskSelect(index)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 + 0.08 }}
                className="group relative w-full border border-[#6a2020]/80 bg-[#1a0808]/90 text-left transition hover:border-[#8e1f1f] hover:bg-[#220d0d] disabled:opacity-40"
              >
                <div className="relative px-4 py-2.5 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex border border-[#6a2020]/80 bg-[#160909] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#e07070]">
                      {t.ui.game.choiceIntent.risk}
                    </span>
                    <span className="font-cinzel text-[13px] uppercase tracking-[0.08em] text-[#d8a0a0]">
                      {t.ui.game.riskAttemptLabel}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.1em] text-[#9d8d82]">
                    {t.ui.game.riskAttemptHint
                      .replace('{bonus}', String(riskOffer.bonus))
                      .replace('{dc}', String(riskOffer.dc))
                      .replace('{chance}', String(riskOffer.chancePercent))}
                  </p>
                  <p className="mt-1 text-[10px] text-[#75685f]">
                    {t.ui.game.riskFailureNote
                      .replace('{sanity}', String(RISK_FAILURE_SANITY))
                      .replace('{corruption}', String(RISK_FAILURE_CORRUPTION))}
                  </p>
                </div>
              </motion.button>
            )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
