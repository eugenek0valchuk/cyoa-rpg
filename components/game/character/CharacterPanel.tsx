'use client'

import { Brain, Package, Swords, Wind, Zap, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'

import { ORIGIN_ICONS, ORIGIN_TITLES } from '../constants/origins'
import { StatBar } from '../ui/StatBar'

import type { Character } from '@/lib/types/game'

interface CharacterPanelProps {
  character: Character
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border-2 border-[#2b2320] bg-[linear-gradient(to_bottom,#120c0c,#080505)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,31,31,0.12),transparent_60%)]" />

      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.4em] text-[#7a6d63]">
              VESSEL
            </div>

            <h2 className="font-cinzel mt-3 text-4xl uppercase tracking-[0.14em] text-[#efe5dc]">
              {character.name}
            </h2>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 inline-flex items-center gap-4 border-2 border-[#3b2a2a] bg-[#140d0d]/90 px-6 py-4 text-[#d8c9be]"
            >
              <div className="text-lg text-[#8e1f1f]">
                {ORIGIN_ICONS[character.origin]}
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#6f6259]">
                  ORIGIN
                </div>

                <div className="font-cinzel mt-1 text-sm uppercase tracking-[0.12em]">
                  {ORIGIN_TITLES[character.origin]}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Strength',
                value: character.stats.strength,
                max: 20,
                color: '#d46060',
                icon: <Swords size={14} />,
              },
              {
                label: 'Agility',
                value: character.stats.agility,
                max: 20,
                color: '#b4c27d',
                icon: <Wind size={14} />,
              },
              {
                label: 'Intelligence',
                value: character.stats.intelligence,
                max: 20,
                color: '#92a6dd',
                icon: <Zap size={14} />,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="min-w-[130px] border-2 border-[#2f2622] bg-[#0c0808]/85 px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.25em] text-[#7a6d63]">
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  {stat.label}
                </div>

                <div
                  className="mt-3 font-cinzel text-4xl"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>

                <div className="mx-auto mt-4 h-[3px] max-w-[80px] overflow-hidden bg-[#1b1414]">
                  <motion.div
                    className="h-full"
                    style={{ background: stat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + 0.1 * i }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <StatBar
            label="Sanity"
            value={character.sanity}
            max={100}
            color="#d8d0c8"
            icon={<Brain size={14} />}
          />

          <StatBar
            label="Corruption"
            value={character.corruption}
            max={100}
            color="#d46060"
            trackColor="#8e1f1f"
            icon={<Droplets size={14} />}
            bgColor="#1b1414"
          />

          <div className="border border-[#2b2320] bg-[#0a0707]/90 p-5">
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.3em] text-[#7a6d63]">
              <Package className="h-4 w-4" />
              Artifacts
            </div>

            <div className="mt-4 space-y-2">
              {character.inventory.length === 0 ? (
                <div className="text-sm text-[#75685f]">Nothing remains.</div>
              ) : (
                character.inventory.map((artifact, i) => (
                  <motion.div
                    key={artifact.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-2 border border-[#241919] bg-black/30 px-3 py-2 text-sm text-[#d8c9be]"
                  >
                    <span className="shrink-0 text-[10px] text-[#8b5e5e]">
                      ◆
                    </span>
                    {artifact.name}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
