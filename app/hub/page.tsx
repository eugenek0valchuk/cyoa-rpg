'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { saveCurrentGameState, getActiveSlotId } from '@/lib/persistence/saveStorage'
import { getRaidStartScene, startRaidFromHub } from '@/lib/game/raid'
import { useAutoSave } from '@/hooks/useAutoSave'
import { t } from '@/lib/i18n'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useHubStore } from '@/lib/store/hubStore'
import type { Artifact } from '@/lib/types/game'

export default function HubPage() {
  const router = useRouter()
  useAutoSave()
  const { ui: hubText, rooms, roomMarks } = t.hub

  const character = useCharacterStore((state) => state.character)
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const hub = useHubStore((state) => state.hub)
  const raid = useHubStore((state) => state.raid)
  const setHub = useHubStore((state) => state.setHub)
  const setRaid = useHubStore((state) => state.setRaid)

  const resetGame = useGameStore((state) => state.resetGame)
  const setCurrentScene = useGameStore((state) => state.setCurrentScene)

  const [selectedLoadout, setSelectedLoadout] = useState<string[]>([])

  const room = character ? rooms[character.origin] : null

  useEffect(() => {
    if (!character) {
      router.push('/editor')
      return
    }

    if (!hub) {
      router.push('/editor')
    }
  }, [character, hub, router])

  useEffect(() => {
    if (raid?.active) {
      router.push('/game')
    }
  }, [raid, router])

  const toggleLoadout = (artifactId: string) => {
    if (!hub) {
      return
    }

    setSelectedLoadout((current) => {
      if (current.includes(artifactId)) {
        return current.filter((id) => id !== artifactId)
      }

      if (current.length >= hub.loadoutSlots) {
        return current
      }

      return [...current, artifactId]
    })
  }

  const loadoutItems = useMemo(() => {
    if (!hub) {
      return [] as Artifact[]
    }

    return hub.stash.filter((item) => selectedLoadout.includes(item.id))
  }, [hub, selectedLoadout])

  const handleBeginRaid = async () => {
    if (!character || !hub) {
      return
    }

    const started = startRaidFromHub(character, hub, loadoutItems)

    setCharacter(started.character)
    setHub(started.hub)
    setRaid(started.raid)

    resetGame()
    setCurrentScene(getRaidStartScene())

    await saveCurrentGameState(getActiveSlotId(), {
      character: started.character,
      currentScene: getRaidStartScene(),
      history: [],
      sceneHistory: [],
      hub: started.hub,
      raid: started.raid,
    })

    router.push('/game')
  }

  if (!character || !hub || !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-sm uppercase tracking-[0.3em] text-[#75685f]">
        {hubText.eyebrow}
      </main>
    )
  }

  const evolvedText = room.evolved[hub.roomLevel] ?? room.description

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-[#e7e2dc]">
      <img
        src={room.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-[1100px] flex-col px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-[#75685f]">
              {hubText.eyebrow}
            </div>
            <h1 className="font-cinzel mt-2 text-4xl uppercase tracking-[0.12em] text-[#d6cdc3]">
              {room.title}
            </h1>
            <p className="mt-2 text-[14px] text-[#9d8d82]">{room.subtitle}</p>
          </div>

          <Link
            href="/archives"
            className="border border-[#2b2320] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#75685f] no-underline hover:border-[#5c1f1f] hover:text-[#d46060]"
          >
            {hubText.archives}
          </Link>
        </div>

        <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-2 border-[#2b2320] bg-[#0d0909]/90 p-6">
            <p className="text-[15px] leading-8 text-[#b8a99e]">{evolvedText}</p>

            {hub.roomMarks.length > 0 && (
              <div className="mt-6 border-t border-[#241919] pt-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#75685f]">
                  {hubText.marks}
                </div>
                <ul className="mt-3 space-y-2 text-[13px] text-[#85776a]">
                  {hub.roomMarks.map((mark) => (
                    <li key={mark}>◆ {roomMarks[mark] ?? mark}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="border border-[#2b2320] bg-black/40 px-3 py-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                  {hubText.raids}
                </div>
                <div className="font-cinzel mt-2 text-2xl text-[#d6cdc3]">
                  {hub.totalRaids}
                </div>
              </div>
              <div className="border border-[#2b2320] bg-black/40 px-3 py-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                  {hubText.extractions}
                </div>
                <div className="font-cinzel mt-2 text-2xl text-[#d6cdc3]">
                  {hub.totalExtractions}
                </div>
              </div>
              <div className="border border-[#2b2320] bg-black/40 px-3 py-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                  {hubText.bestDepth}
                </div>
                <div className="font-cinzel mt-2 text-2xl text-[#d6cdc3]">
                  {hub.bestDepth}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-[#2b2320] bg-[#0d0909]/90 p-6">
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#75685f]">
                {hubText.stats}
              </div>
              <h2 className="font-cinzel mt-2 text-3xl uppercase tracking-[0.1em] text-[#efe5dc]">
                {character.name}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] text-[#85776a]">
                <div>
                  {t.ui.game.sanity}: {character.sanity}
                </div>
                <div>
                  {t.ui.game.corruption}: {character.corruption}
                </div>
              </div>
            </div>

            <div className="border-2 border-[#2b2320] bg-[#0d0909]/90 p-6">
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#75685f]">
                {hubText.stash}
              </div>

              {hub.stash.length === 0 ? (
                <p className="mt-4 text-[14px] text-[#75685f]">
                  {hubText.emptyStash}
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {hub.stash.map((artifact) => {
                    const selected = selectedLoadout.includes(artifact.id)

                    return (
                      <button
                        key={artifact.id}
                        type="button"
                        onClick={() => toggleLoadout(artifact.id)}
                        className={`flex w-full items-center gap-3 border px-3 py-3 text-left transition ${
                          selected
                            ? 'border-[#8e1f1f] bg-[#160909]'
                            : 'border-[#2b2320] bg-black/30 hover:border-[#5c1f1f]'
                        }`}
                      >
                        <GameIcon type="artifact" size={36} />
                        <span className="text-[14px] text-[#d8c9be]">
                          {artifact.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              <p className="mt-4 text-[12px] uppercase tracking-[0.2em] text-[#6f6259]">
                {hubText.loadoutHint.replace('{count}', String(hub.loadoutSlots))}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBeginRaid}
              className="w-full border-2 border-[#5c1f1f] bg-[#160909] px-6 py-4 font-cinzel text-lg uppercase tracking-[0.18em] text-[#d46060] transition hover:bg-[#220d0d]"
            >
              {hubText.beginRaid}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
