'use client'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'

interface VesselStatsProps {
  character: Character
  roomMarks?: string[]
  compact?: boolean
  canChamberRest?: boolean
  chamberRestUsed?: boolean
  onChamberRest?: () => void
}

export function VesselStats({
  character,
  roomMarks = [],
  compact = false,
  canChamberRest = false,
  chamberRestUsed = false,
  onChamberRest,
}: VesselStatsProps) {
  const { game } = t.ui
  const { ui: hubText, roomMarks: roomMarkLabels, roomMarkEffects } = t.hub

  const statBlocks = [
    {
      key: 'strength',
      label: game.strength,
      value: character.stats.strength,
      icon: 'strength' as const,
      color: '#d46060',
      tip: hubText.statTips.strength,
    },
    {
      key: 'agility',
      label: game.agility,
      value: character.stats.agility,
      icon: 'agility' as const,
      color: '#b4c27d',
      tip: hubText.statTips.agility,
    },
    {
      key: 'intelligence',
      label: game.intelligence,
      value: character.stats.intelligence,
      icon: 'intelligence' as const,
      color: '#92a6dd',
      tip: hubText.statTips.intelligence,
    },
  ]

  const vitals = [
    {
      label: game.sanity,
      value: character.sanity,
      max: 100,
      icon: 'sanity' as const,
      color: '#d8d0c8',
      tip: hubText.statTips.sanity,
    },
    {
      label: game.corruption,
      value: character.corruption,
      max: 100,
      icon: 'corruption' as const,
      color: '#d46060',
      tip: hubText.statTips.corruption,
    },
  ]

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div>
        <div className="text-[12px] uppercase tracking-[0.15em] text-[#75685f]">
          {game.origin}
        </div>
        <div className="mt-1 font-cinzel text-lg text-[#d8c9be]">
          {t.originTitles[character.origin]}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statBlocks.map((stat) => (
          <div
            key={stat.key}
            title={stat.tip}
            className="border border-[#2b2320] bg-black/40 px-3 py-3 text-center"
          >
            <div className="flex justify-center py-1">
              <GameIcon type={stat.icon} size={compact ? 56 : 72} />
            </div>
            <div className="mt-2 text-[12px] text-[#85776a]">{stat.label}</div>
            <div
              className="font-cinzel mt-1 text-2xl"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {vitals.map((vital) => (
          <div
            key={vital.label}
            title={vital.tip}
            className="border border-[#2b2320] bg-black/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <GameIcon type={vital.icon} size={compact ? 36 : 44} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-[#85776a]">{vital.label}</div>
                <div className="font-cinzel text-xl" style={{ color: vital.color }}>
                  {vital.value}
                  <span className="text-[14px] text-[#5e544c]"> / {vital.max}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden bg-[#1b1414]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${(vital.value / vital.max) * 100}%`,
                  background: vital.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {(canChamberRest || chamberRestUsed) && onChamberRest && (
        <div className="border border-[#2b3528]/70 bg-[#0d120d]/50 px-4 py-3">
          {canChamberRest ? (
            <>
              <p className="text-[13px] leading-relaxed text-[#9aab92]">
                {hubText.chamberRestHint}
              </p>
              <button
                type="button"
                onClick={onChamberRest}
                className="mt-3 w-full border border-[#4a5c4a]/70 bg-[#0d120d]/90 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#b4c27d] transition hover:border-[#6a8f6a] hover:bg-[#121812]"
              >
                {hubText.chamberRestAction}
              </button>
            </>
          ) : (
            <p className="text-[13px] leading-relaxed text-[#75685f]">
              {hubText.chamberRestDone}
            </p>
          )}
        </div>
      )}

      {roomMarks.length > 0 && (
        <div className="border border-[#4a2323]/60 bg-[#160909]/30 px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#d46060]">
            {hubText.marks}
          </div>
          <ul className="mt-2 space-y-2">
            {roomMarks.map((mark) => (
              <li key={mark} className="text-[13px] text-[#9d8d82]">
                <span className="text-[#d8c9be]">
                  {roomMarkLabels[mark] ?? mark}
                </span>
                {roomMarkEffects[mark] && (
                  <span className="text-[#85776a]"> — {roomMarkEffects[mark]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
