'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { artifacts } from '@/lib/game/artifacts'
import { useCharacterStore } from '@/lib/store/characterStore'
import type { Artifact, Origin } from '@/lib/types/game'

const ORIGIN_ICON_MAP: Record<Origin, 'hollow' | 'heretic' | 'witness'> = {
  hollow: 'hollow',
  heretic: 'heretic',
  witness: 'witness',
}

type OriginCard = {
  value: Origin
  title: string
  subtitle: string
  description: string
  image: string
  inventory: Artifact[]
  stats: {
    strength: number
    agility: number
    intelligence: number
  }
}

const origins = [
  {
    value: 'hollow',
    title: 'THE HOLLOW',
    subtitle: 'Returned from the abyss without a soul.',

    description:
      'No prayers answered when the abyss took him. What returned wore the armor still, but beneath the iron remained only hunger, silence, and the fading memory of a forgotten name.',

    image: '/origins/hollow.png',

    inventory: [artifacts.ashen_faceless_mask],

    stats: {
      strength: 7,
      agility: 4,
      intelligence: 4,
    },
  },

  {
    value: 'heretic',
    title: 'THE HERETIC',
    subtitle: 'Spoke with something beneath the cathedral.',

    description:
      'Within the buried cathedral he heard the voice beneath stone. It offered revelation in ash and blood. Since that night, sacred flame recoils from his presence.',

    image: '/origins/heretic.png',

    inventory: [artifacts.inverted_rosary],

    stats: {
      strength: 3,
      agility: 4,
      intelligence: 8,
    },
  },

  {
    value: 'witness',
    title: 'THE WITNESS',
    subtitle: 'Saw the end and survived the memory.',

    description:
      'He stood before the final procession and survived the sight. The mind endured, though something behind the eyes was forever stripped away forever.',

    image: '/origins/witness.png',

    inventory: [artifacts.drowned_bell_fragment],

    stats: {
      strength: 4,
      agility: 8,
      intelligence: 3,
    },
  },
] satisfies OriginCard[]

export default function EditorPage() {
  const router = useRouter()

  const setCharacter = useCharacterStore((s) => s.setCharacter)

  const [name, setName] = useState('')
  const [index, setIndex] = useState(0)

  const selected = origins[index]!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    setCharacter({
      name: name.trim(),

      origin: selected.value,

      stats: {
        ...selected.stats,
      },

      inventory: [...selected.inventory],

      sanity: 100,

      corruption: 0,

      flags: [],
    })

    router.push('/game')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 text-[#e7e2dc]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_250px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(80,10,10,0.1)]" />

      <section className="relative z-10 mx-auto max-w-[1100px] pt-[6vh] pb-12">
        <div className="border-2 border-[#2b2320] bg-[#0d0909]/95 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="border-b-2 border-[#241919] bg-[#120d0d] px-6 py-4">
            <div>
              <div className="text-[12px] uppercase tracking-[0.35em] text-[#75685f]">
                CHOOSE YOUR ORIGIN
              </div>
              <h1 className="font-cinzel mt-1 text-3xl uppercase tracking-[0.08em] text-[#ece2d9]">
                DESCENT
              </h1>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-b border-[#241919]/60 px-8 py-5">
            <div
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              className="cursor-pointer p-3 -m-3"
            >
              <img
                src="/ui/gothic-arrow-left.png"
                alt="Previous"
                className="h-[80px] w-[80px] object-contain opacity-60 transition-all duration-500 hover:opacity-100 hover:drop-shadow-[0_0_30px_rgba(200,180,160,0.45)]"
              />
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-[13px] uppercase tracking-[0.4em] text-[#6d5d53]">
                {index + 1}
              </div>
              <div className="mt-1 h-px w-8 bg-[#3b3028]/50" />
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#4c433d]">
                {origins.length}
              </div>
            </div>

            <div
              onClick={() =>
                setIndex((i) => Math.min(i + 1, origins.length - 1))
              }
              className="cursor-pointer p-3 -m-3"
            >
              <img
                src="/ui/gothic-arrow-right.png"
                alt="Next"
                className="h-[80px] w-[80px] object-contain opacity-60 transition-all duration-500 hover:opacity-100 hover:drop-shadow-[0_0_30px_rgba(200,180,160,0.45)]"
              />
            </div>
          </div>

          <div className="border-t-2 border-[#241919]/60">
            {origins.map((origin, i) => (
              <div
                key={origin.value}
                className={i === index ? 'block' : 'hidden'}
              >
                <div className="min-w-0 grid grid-cols-1 md:grid-cols-[minmax(300px,35%)_1fr]">
                  <div className="relative min-h-[360px] overflow-hidden md:min-h-full">
                    <img
                      src={origin.image}
                      alt={origin.title}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between p-6">
                    <div className="min-w-0 space-y-4">
                      <div>
                        <div className="text-[12px] uppercase tracking-[0.3em] text-[#6f6259]">
                          ORIGIN
                        </div>
                        <h2 className="font-cinzel mt-2 break-words text-3xl uppercase tracking-[0.14em] text-[#e4d8cf]">
                          {origin.title}
                        </h2>
                        <p className="mt-1 break-words text-[14px] text-[#9d8d82]">
                          {origin.subtitle}
                        </p>

                        <div className="mt-5 break-words text-[14px] leading-7 text-[#b8a99e]">
                          {origin.description}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: 'STR',
                            value: origin.stats.strength,
                            icon: 'strength',
                          },
                          {
                            label: 'AGI',
                            value: origin.stats.agility,
                            icon: 'agility',
                          },
                          {
                            label: 'INT',
                            value: origin.stats.intelligence,
                            icon: 'intelligence',
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="flex min-w-0 items-center gap-2 border border-[#2b2320] bg-black/40 px-3 py-3"
                          >
                            <GameIcon
                              type={
                                s.icon as
                                  | 'strength'
                                  | 'agility'
                                  | 'intelligence'
                              }
                              size={36}
                            />
                            <div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                                {s.label}
                              </div>
                              <div className="font-cinzel text-lg text-[#d8c9be]">
                                {s.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex min-w-0 items-center gap-2 text-[13px] text-[#8e1f1f]">
                        <GameIcon type="artifact" size={36} />
                        <span className="min-w-0 truncate">{origin.inventory.map((a) => a.name).join(', ')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`mt-auto w-full border-2 py-3 text-sm uppercase tracking-[0.25em] transition-all duration-300 ${
                        i === index
                          ? 'border-[#8e1f1f] bg-[#160909] text-[#d46060]'
                          : 'border-[#2b2320] text-[#6d5d53] hover:border-[#5c1f1f] hover:text-[#d46060]'
                      }`}
                    >
                      {i === index ? 'SELECTED' : 'SELECT'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="border-2 border-[#2b2320] bg-[#0d0909]/95 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b-2 border-[#241919] bg-[#120d0d] px-6 py-4">
              <div className="text-[12px] uppercase tracking-[0.35em] text-[#75685f]">
                VESSEL NAME
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#6d5d53]">
                <GameIcon type={ORIGIN_ICON_MAP[selected.value]} size={36} />
                {selected.title}
              </div>
            </div>

            <div className="flex items-center gap-6 px-6 py-5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="enter name..."
                maxLength={24}
                className="font-cinzel flex-1 border-0 border-b-2 border-[#4a3a32] bg-transparent py-2 text-2xl uppercase tracking-[0.14em] text-[#f1e6dc] outline-none placeholder:text-[#5e544c] transition-colors duration-300 focus:border-[#8e1f1f]"
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="font-cinzel shrink-0 border-2 border-[#5c1f1f] bg-[#160909] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[#d46060] transition-all duration-300 hover:bg-[#220d0d] hover:text-[#ff7b7b] hover:shadow-[0_0_30px_rgba(92,31,31,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Begin Descent
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
