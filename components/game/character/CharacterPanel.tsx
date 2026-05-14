import { Package } from 'lucide-react'

import { ORIGIN_ICONS, ORIGIN_TITLES } from '../constants/origins'

import type { Character } from '@/lib/types/game'

interface CharacterPanelProps {
  character: Character
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  return (
    <section className="relative overflow-hidden border border-[#2b2320] bg-[linear-gradient(to_bottom,#120c0c,#080505)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,31,31,0.12),transparent_60%)]" />

      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

      <div className="relative z-10 p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#7a6d63]">
              VESSEL
            </div>

            <h2 className="font-cinzel mt-3 text-4xl uppercase tracking-[0.14em] text-[#efe5dc]">
              {character.name}
            </h2>

            <div className="mt-6 inline-flex items-center gap-3 border border-[#3b2a2a] bg-[#140d0d]/90 px-4 py-3 text-[#d8c9be]">
              <div className="text-[#8e1f1f]">
                {ORIGIN_ICONS[character.origin]}
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-[0.35em] text-[#6f6259]">
                  ORIGIN
                </div>

                <div className="font-cinzel mt-1 text-sm uppercase tracking-[0.12em]">
                  {ORIGIN_TITLES[character.origin]}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Strength',
                value: character.stats.strength,
                color: '#d46060',
              },
              {
                label: 'Agility',
                value: character.stats.agility,
                color: '#b4c27d',
              },
              {
                label: 'Intelligence',
                value: character.stats.intelligence,
                color: '#92a6dd',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="min-w-[110px] border border-[#2f2622] bg-[#0c0808]/80 px-4 py-4 text-center"
              >
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#7a6d63]">
                  {stat.label}
                </div>

                <div
                  className="mt-3 font-cinzel text-3xl"
                  style={{
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="border border-[#2b2320] bg-[#0a0707]/90 p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a6d63]">
              SANITY
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-cinzel text-4xl text-[#efe5dc]">
                {character.sanity}
              </span>

              <span className="mb-1 text-sm text-[#7a6d63]">/100</span>
            </div>

            <div className="mt-4 h-[4px] overflow-hidden bg-[#1b1414]">
              <div
                className="h-full bg-[#d8d0c8]"
                style={{
                  width: `${character.sanity}%`,
                }}
              />
            </div>
          </div>

          <div className="border border-[#2b2320] bg-[#0a0707]/90 p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a6d63]">
              CORRUPTION
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-cinzel text-4xl text-[#d46060]">
                {character.corruption}
              </span>

              <span className="mb-1 text-sm text-[#7a6d63]">/100</span>
            </div>

            <div className="mt-4 h-[4px] overflow-hidden bg-[#1b1414]">
              <div
                className="h-full bg-[#8e1f1f]"
                style={{
                  width: `${character.corruption}%`,
                }}
              />
            </div>
          </div>

          <div className="border border-[#2b2320] bg-[#0a0707]/90 p-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#7a6d63]">
              <Package className="h-3.5 w-3.5" />
              Artifacts
            </div>

            <div className="mt-5 space-y-2">
              {character.inventory.length === 0 ? (
                <div className="text-sm text-[#75685f]">Nothing remains.</div>
              ) : (
                character.inventory.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="border border-[#241919] bg-black/30 px-3 py-2 text-sm text-[#d8c9be]"
                  >
                    {artifact.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
