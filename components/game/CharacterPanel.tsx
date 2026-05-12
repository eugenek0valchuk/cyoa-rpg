import { Eye, Flame, Package, Skull } from 'lucide-react'
import type { Character } from '@/lib/types/game'

interface CharacterPanelProps {
  character: Character
}

const originIcons = {
  hollow: <Skull className="h-4 w-4" />,
  heretic: <Flame className="h-4 w-4" />,
  witness: <Eye className="h-4 w-4" />,
}
const originTitles = {
  hollow: 'THE HOLLOW',
  heretic: 'THE HERETIC',
  witness: 'THE WITNESS',
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  return (
    <section className="relative overflow-hidden border border-[#2b2320] bg-[linear-gradient(to_bottom,#120c0c,#080505)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,31,31,0.12),transparent_60%)]" />

      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

      <div className="relative z-10 p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#7a6d63]">VESSEL</div>

            <h2 className="font-cinzel mt-3 text-4xl uppercase tracking-[0.14em] text-[#efe5dc]">
              {character.name}
            </h2>

            <div className="mt-6 inline-flex items-center gap-3 border border-[#3b2a2a] bg-[#140d0d]/90 px-4 py-3 text-[#d8c9be]">
              <div className="text-[#8e1f1f]">{originIcons[character.origin]}</div>

              <div>
                <div className="text-[9px] uppercase tracking-[0.35em] text-[#6f6259]">ORIGIN</div>

                <div className="font-cinzel mt-1 text-sm uppercase tracking-[0.12em]">
                  {originTitles[character.origin]}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="min-w-[110px] border border-[#2f2622] bg-[#0c0808]/80 px-4 py-4 text-center">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#7a6d63]">Strength</div>

              <div className="mt-3 font-cinzel text-3xl text-[#d46060]">
                {character.stats.strength}
              </div>
            </div>

            <div className="min-w-[110px] border border-[#2f2622] bg-[#0c0808]/80 px-4 py-4 text-center">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#7a6d63]">Agility</div>

              <div className="mt-3 font-cinzel text-3xl text-[#b4c27d]">
                {character.stats.agility}
              </div>
            </div>

            <div className="min-w-[110px] border border-[#2f2622] bg-[#0c0808]/80 px-4 py-4 text-center">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#7a6d63]">
                Intelligence
              </div>

              <div className="mt-3 font-cinzel text-3xl text-[#92a6dd]">
                {character.stats.intelligence}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="border border-[#2b2320] bg-[#0a0707]/90 p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a6d63]">SANITY</div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-cinzel text-4xl text-[#efe5dc]">{character.sanity}</span>

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
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a6d63]">CORRUPTION</div>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-cinzel text-4xl text-[#b94b4b]">{character.corruption}</span>

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
              <Package className="h-3 w-3" />
              INVENTORY
            </div>

            <div className="mt-4 space-y-2 text-[13px] text-[#cbbdb1]">
              {character.inventory.length > 0 ? (
                character.inventory.map((item) => <div key={item}>• {item}</div>)
              ) : (
                <div className="text-[#6f6259]">Empty</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
