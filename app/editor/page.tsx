'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCharacterStore } from '@/lib/store/characterStore'

export default function EditorPage() {
  const router = useRouter()
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const [name, setName] = useState('')
  const [characterClass, setCharacterClass] = useState<
    'warrior' | 'mage' | 'rogue'
  >('warrior')
  const [stats, setStats] = useState({
    strength: 5,
    agility: 5,
    intelligence: 5,
  })

  const totalPoints = stats.strength + stats.agility + stats.intelligence
  const remainingPoints = 15 - totalPoints

  const adjustStat = (stat: keyof typeof stats, delta: number) => {
    const newValue = stats[stat] + delta
    if (newValue < 1 || newValue > 10) return
    if (remainingPoints - delta < 0) return
    setStats((prev) => ({ ...prev, [stat]: newValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (remainingPoints !== 0) return

    setCharacter({
      name: name.trim(),
      class: characterClass,
      stats,
      inventory:
        characterClass === 'warrior'
          ? ['Iron Sword']
          : characterClass === 'mage'
            ? ['Spellbook']
            : ['Dagger'],
    })
    router.push('/game')
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Create Your Hero
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <div className="flex gap-4">
              {[
                {
                  value: 'warrior',
                  label: 'Warrior',
                  desc: 'Strong melee fighter',
                },
                { value: 'mage', label: 'Mage', desc: 'Powerful spells' },
                { value: 'rogue', label: 'Rogue', desc: 'Stealth and agility' },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCharacterClass(c.value as any)}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    characterClass === c.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold">{c.label}</div>
                  <div className="text-sm text-gray-400">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Stats (осталось очков: {remainingPoints})
            </label>
            <div className="space-y-3">
              {[
                { key: 'strength', label: 'Strength' },
                { key: 'agility', label: 'Agility' },
                { key: 'intelligence', label: 'Intelligence' },
              ].map((stat) => (
                <div key={stat.key} className="flex items-center gap-4">
                  <span className="w-24">{stat.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      adjustStat(stat.key as keyof typeof stats, -1)
                    }
                    className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600"
                    disabled={stats[stat.key as keyof typeof stats] <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">
                    {stats[stat.key as keyof typeof stats]}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      adjustStat(stat.key as keyof typeof stats, 1)
                    }
                    className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600"
                    disabled={remainingPoints === 0}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || remainingPoints !== 0}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Adventure
          </button>
        </form>
      </div>
    </main>
  )
}
