'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { restoreActiveSlot } from '@/hooks/useAutoSave'
import { completeRaidExtraction, startRaidFromHub } from '@/lib/game/raid'
import { isHubMerchantUnlocked } from '@/lib/game/merchant'
import {
  saveCurrentGameState,
  setActiveSlotId,
} from '@/lib/persistence/saveStorage'
import { createInitialHubState } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

const SLOT_ID = 0

const seedCharacter: Character = {
  name: 'Альян',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 100,
  corruption: 0,
  flags: [],
}

function runFourExtractionLoop() {
  let hub = createInitialHubState()
  let character: Character = { ...seedCharacter, flags: [] }

  for (let run = 1; run <= 4; run += 1) {
    const started = startRaidFromHub(character, hub, [])
    character = started.character
    hub = started.hub

    const depth = 2 + run
    const extracted = completeRaidExtraction(
      character,
      hub,
      started.raid,
      depth,
    )

    character = extracted.character
    hub = extracted.hub
  }

  return { character, hub }
}

export default function SeedFourExtractionsPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Готовим четыре извлечения…')

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.replace('/')
      return
    }

    let cancelled = false

    async function seed() {
      try {
        setActiveSlotId(SLOT_ID)

        const { character, hub } = runFourExtractionLoop()

        if (cancelled) {
          return
        }

        await saveCurrentGameState(SLOT_ID, {
          character,
          currentScene: null,
          history: [],
          sceneHistory: [],
          hub,
          raid: null,
        })

        const restored = await restoreActiveSlot(SLOT_ID)

        if (!restored.restored) {
          setStatus('Не удалось восстановить слот')
          return
        }

        setStatus(
          `Готово: ${hub.totalRaids} спусков, ${hub.totalExtractions} извлечений, эхо ${hub.echo ?? 0}. Телега: ${isHubMerchantUnlocked(hub) ? 'открыта' : 'закрыта'}.`,
        )

        router.replace('/hub?chronicle=chamber')
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Ошибка сида')
      }
    }

    void seed()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-[#d7c8bc]">
      <p className="text-sm uppercase tracking-[0.35em] text-[#75685f]">
        Dev seed
      </p>
      <p className="max-w-md text-[15px] leading-relaxed text-[#9d8d82]">
        {status}
      </p>
    </main>
  )
}
