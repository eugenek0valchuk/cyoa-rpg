'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCharacterStore } from '@/lib/store/characterStore'
import type { Origin } from '@/lib/types/game'

type OriginCard = {
  value: Origin
  title: string
  subtitle: string
  description: string
  image: string

  inventory: string[]

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

    inventory: ['Rust Blade', 'Broken Sigil'],

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

    inventory: ['Black Scripture', 'Wax Seal'],

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

    inventory: ['Silver Knife', 'Shattered Rosary'],

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

    if (!name.trim()) return

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
      <img src="/main-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.95)]" />

      <section className="relative z-10 mx-auto max-w-[1250px] pt-28 pb-16">
        <div className="mb-16 text-center">
          <div className="text-[11px] uppercase tracking-[0.6em] text-[#7a6d63]">
            CHOOSE YOUR ORIGIN
          </div>

          <h1 className="font-cinzel mt-6 text-6xl uppercase tracking-[0.16em] text-[#e6ddd4]">
            DESCENT
          </h1>

          <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#8e1f1f] to-transparent" />
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            className="border-0 bg-transparent p-0"
          >
            <img
              src="/ui/gothic-arrow-left.png"
              alt="Previous"
              className="h-[100px] w-[100px] object-contain transition duration-300 hover:drop-shadow-[0_0_10px_rgba(142,31,31,0.8)]"
            />
          </button>

          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(i + 1, origins.length - 1))}
            className="border-0 bg-transparent p-0"
          >
            <img
              src="/ui/gothic-arrow-right.png"
              alt="Next"
              className="h-[100px] w-[100px] object-contain transition duration-300 hover:drop-shadow-[0_0_10px_rgba(142,31,31,0.8)]"
            />
          </button>
        </div>

        <div className="relative mx-auto mt-10 max-w-[620px] overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${index * 100}%)`,
            }}
          >
            {origins.map((origin, i) => (
              <div key={origin.value} className="min-w-full shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="relative w-full overflow-hidden rounded-sm border border-[#2b2320] bg-[#0b0b0b] text-left transition-all duration-500"
                >
                  <div className="relative h-[540px] overflow-hidden">
                    <img
                      src={origin.image}
                      alt={origin.title}
                      className="h-full w-full object-cover object-top transition duration-700"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-[10px] uppercase tracking-[0.5em] text-[#7a6d63]">
                      ORIGIN
                    </div>

                    <h2 className="font-cinzel mt-3 text-3xl uppercase tracking-[0.14em] text-[#e4d8cf]">
                      {origin.title}
                    </h2>

                    <p className="mt-2 text-[13px] text-[#9d8d82]">{origin.subtitle}</p>

                    <div className="mt-6 grid grid-cols-3 gap-3 text-[12px] text-[#d8c9be]">
                      <div className="border border-[#2b2320] px-2 py-1 text-center">
                        STR {origin.stats.strength}
                      </div>

                      <div className="border border-[#2b2320] px-2 py-1 text-center">
                        AGI {origin.stats.agility}
                      </div>

                      <div className="border border-[#2b2320] px-2 py-1 text-center">
                        INT {origin.stats.intelligence}
                      </div>
                    </div>

                    <div className="mt-5 space-y-1 text-[12px] text-[#8e1f1f]">
                      {origin.inventory.map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-24 max-w-[620px]">
          <div className="border border-[#2f2622] bg-[linear-gradient(to_bottom,#120c0c,#080505)] p-10 text-center">
            <div className="text-[11px] uppercase tracking-[0.5em] text-[#7a6d63]">VESSEL NAME</div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              maxLength={24}
              className="font-cinzel mt-6 w-full border-b border-[#4a3a32] bg-transparent py-5 text-center text-4xl uppercase tracking-[0.14em] text-[#f1e6dc] outline-none placeholder:text-[#5e544c] focus:border-[#8e1f1f]"
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="font-cinzel mt-12 w-full border border-[#5c1f1f] bg-[#160909] px-8 py-6 text-xl uppercase tracking-[0.2em] text-[#d46060] transition hover:bg-[#220d0d] hover:text-[#ff7b7b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Begin Descent
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
