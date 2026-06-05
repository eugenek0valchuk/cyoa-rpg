'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { ORIGIN_TITLES } from '../constants/origins'
import { GameIcon } from '../ui/GameIcon'
import { StatBar } from '../ui/StatBar'

import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'
import { GothicTooltip } from '@/components/ui/GothicTooltip'

interface CharacterPanelProps {
  character: Character
}

function StatIconWell({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#2b2320] bg-[#0a0707]">
      {children}
    </span>
  )
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  const { game } = t.ui
  const { statTips } = t.hub.ui
  const originIcon =
    character.origin === 'hollow'
      ? 'hollow'
      : character.origin === 'heretic'
        ? 'heretic'
        : 'witness'

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border border-[#2b2320]/90 bg-[#0a0707]/94 backdrop-blur-[2px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(142,31,31,0.08),transparent_60%)]" />

      <div className="relative z-10 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex min-w-0 items-center gap-3 lg:min-w-[190px] lg:max-w-[240px]">
            <StatIconWell>
              <GameIcon type={originIcon} size={36} noBlend />
            </StatIconWell>
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#75685f]">
                {game.vessel}
              </div>
              <h2 className="font-cinzel truncate text-xl uppercase tracking-[0.08em] text-[#efe5dc] sm:text-2xl">
                {character.name}
              </h2>
              <div className="text-[10px] uppercase tracking-[0.1em] text-[#85776a]">
                {ORIGIN_TITLES[character.origin]}
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-2">
            {[
              { label: game.strength, value: character.stats.strength, icon: 'strength' as const, color: '#d46060' },
              { label: game.agility, value: character.stats.agility, icon: 'agility' as const, color: '#b4c27d' },
              { label: game.intelligence, value: character.stats.intelligence, icon: 'intelligence' as const, color: '#92a6dd' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center border border-[#241919] bg-black/30 px-2 py-2.5 text-center"
              >
                <GothicTooltip title={stat.label} body={statTips[stat.icon]}>
                  <StatIconWell>
                    <GameIcon type={stat.icon} size={30} noBlend />
                  </StatIconWell>
                </GothicTooltip>
                <div className="mt-1.5 text-[9px] uppercase tracking-[0.08em] text-[#75685f]">
                  {stat.label}
                </div>
                <div className="font-cinzel text-xl tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <StatBar
            compact
            label={game.sanity}
            value={character.sanity}
            max={100}
            color="#d8d0c8"
            icon={
              <GothicTooltip title={game.sanity} body={statTips.sanity}>
                <StatIconWell>
                  <GameIcon type="sanity" size={26} noBlend />
                </StatIconWell>
              </GothicTooltip>
            }
          />
          <StatBar
            compact
            label={game.corruption}
            value={character.corruption}
            max={100}
            color="#d46060"
            trackColor="#8e1f1f"
            icon={
              <GothicTooltip title={game.corruption} body={statTips.corruption}>
                <StatIconWell>
                  <GameIcon type="corruption" size={26} noBlend />
                </StatIconWell>
              </GothicTooltip>
            }
            bgColor="#1b1414"
          />
        </div>

        {character.inventory.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#241919] pt-3">
            <StatIconWell>
              <GameIcon type="artifact" size={26} noBlend />
            </StatIconWell>
            {character.inventory.map((artifact) => (
              <span
                key={artifact.id}
                className="border border-[#2b2320] bg-black/40 px-2.5 py-1 text-[11px] text-[#d8c9be] sm:text-[12px]"
              >
                {artifact.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  )
}
