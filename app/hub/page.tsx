'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { HubBottomBar } from '@/components/hub/HubBottomBar'
import { RoomHotspotLayer } from '@/components/hub/RoomHotspotLayer'
import { VesselStats } from '@/components/hub/VesselStats'
import { GameIcon } from '@/components/game/ui/GameIcon'
import { GothicModal } from '@/components/ui/GothicModal'
import { saveCurrentGameState, getActiveSlotId } from '@/lib/persistence/saveStorage'
import { getRaidStartScene, startRaidFromHub } from '@/lib/game/raid'
import { exitToMainMenu, useAutoSave } from '@/hooks/useAutoSave'
import { roomHotspotLayouts, type HotspotId } from '@/lib/hub/roomHotspots'
import { t } from '@/lib/i18n'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useHubStore } from '@/lib/store/hubStore'
import type { Artifact } from '@/lib/types/game'

export default function HubPage() {
  const router = useRouter()
  useAutoSave()

  const { ui: hubText, rooms, roomMarks } = t.hub
  const hotspots = hubText.hotspots

  const character = useCharacterStore((state) => state.character)
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const hub = useHubStore((state) => state.hub)
  const raid = useHubStore((state) => state.raid)
  const pendingSummary = useHubStore((state) => state.pendingSummary)
  const setHub = useHubStore((state) => state.setHub)
  const setRaid = useHubStore((state) => state.setRaid)

  const resetGame = useGameStore((state) => state.resetGame)
  const setCurrentScene = useGameStore((state) => state.setCurrentScene)

  const [activeModal, setActiveModal] = useState<HotspotId | null>(null)
  const [selectedLoadout, setSelectedLoadout] = useState<string[]>([])

  const room = character ? rooms[character.origin] : null
  const hotspotRegions = character
    ? roomHotspotLayouts[character.origin]
    : []

  useEffect(() => {
    if (!character || !hub) {
      router.push('/')
      return
    }

    if (pendingSummary) {
      router.push('/raid-summary')
      return
    }

    if (raid?.active) {
      router.push('/game')
    }
  }, [character, hub, pendingSummary, raid, router])

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

  const handleExitToMenu = async () => {
    await exitToMainMenu()
    router.push('/')
  }

  const handleBeginRaid = async () => {
    if (!character || !hub) {
      return
    }

    const started = startRaidFromHub(character, hub, loadoutItems)

    setCharacter(started.character)
    setHub(started.hub)
    setRaid(started.raid)
    setActiveModal(null)

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
      <main className="flex min-h-screen items-center justify-center bg-black text-[14px] text-[#75685f]">
        {hubText.eyebrow}
      </main>
    )
  }

  const evolvedText = room.evolved[hub.roomLevel] ?? room.description

  const closeModal = () => setActiveModal(null)

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-[#e7e2dc]">
      <img
        src={room.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

      <RoomHotspotLayer
        hotspots={hotspotRegions}
        labels={hotspots}
        activeId={activeModal}
        onSelect={(id) =>
          setActiveModal((current) => (current === id ? null : id))
        }
      />

      <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/85 to-transparent px-5 pb-8 pt-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-[0.15em] text-[#85776a]">
              {hubText.eyebrow}
            </div>
            <h1 className="font-cinzel mt-1 text-2xl uppercase tracking-[0.1em] text-[#efe5dc] sm:text-4xl">
              {room.title}
            </h1>
            <p className="mt-1 max-w-lg text-[14px] leading-relaxed text-[#b8a99e] sm:text-[15px]">
              {room.subtitle}
            </p>
            <p className="mt-2 text-[12px] text-[#6f6259]">{hubText.hotspotHint}</p>
          </div>

          <button
            type="button"
            onClick={handleExitToMenu}
            title={hubText.exitToMenuHint}
            className="shrink-0 border border-[#2b2320] px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060] sm:px-4 sm:text-[11px]"
          >
            {hubText.exitToMenu}
          </button>
        </div>
      </header>

      <HubBottomBar
        origin={character.origin}
        labels={{
          stash: hubText.bottomStash,
          vessel: hubText.bottomVessel,
          chronicle: hubText.bottomChronicle,
          descend: hubText.bottomDescend,
          archives: hubText.bottomArchives,
        }}
        activeId={activeModal}
        onSelect={(id) => setActiveModal(id)}
        modalOpen={activeModal !== null}
        onArchives={() => router.push('/archives')}
      />

      <GothicModal
        open={activeModal === 'vessel'}
        onClose={closeModal}
        icon={
          character.origin === 'hollow'
            ? 'hollow'
            : character.origin === 'heretic'
              ? 'heretic'
              : 'witness'
        }
        title={hotspots.vessel.label}
        subtitle={hotspots.vessel.hint}
        footer={
          <p className="text-[13px] leading-relaxed text-[#75685f]">
            {character.name} · {hubText.statTips.strength.split('—')[0]?.trim()}
          </p>
        }
      >
        <VesselStats character={character} />
      </GothicModal>

      <GothicModal
        open={activeModal === 'stash'}
        onClose={closeModal}
        icon="artifact"
        title={hotspots.stash.label}
        subtitle={hotspots.stash.hint}
        maxWidth="lg"
      >
        {hub.stash.length === 0 ? (
          <p className="text-[15px] text-[#75685f]">{hubText.emptyStash}</p>
        ) : (
          <ul className="space-y-2">
            {hub.stash.map((artifact) => (
              <li
                key={artifact.id}
                className="flex items-start gap-3 border border-[#2b2320] bg-black/30 px-4 py-3"
                title={artifact.description}
              >
                <GameIcon type="artifact" size={44} />
                <div className="min-w-0">
                  <div className="text-[15px] text-[#d8c9be]">{artifact.name}</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-[#85776a]">
                    {artifact.description}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.1em] text-[#6f6259]">
                    {artifact.rarity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GothicModal>

      <GothicModal
        open={activeModal === 'chronicle'}
        onClose={closeModal}
        icon="flag"
        title={hotspots.chronicle.label}
        subtitle={hotspots.chronicle.hint}
        maxWidth="lg"
      >
        <p className="text-[15px] leading-8 text-[#b8a99e]">{evolvedText}</p>

        {hub.roomMarks.length > 0 && (
          <div className="mt-6 border-t border-[#241919] pt-5">
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
              {hubText.marks}
            </div>
            <ul className="mt-3 space-y-2">
              {hub.roomMarks.map((mark) => (
                <li
                  key={mark}
                  className="flex items-center gap-2 text-[14px] text-[#9d8d82]"
                >
                  <GameIcon type="flag" size={28} />
                  {roomMarks[mark] ?? mark}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: hubText.raids, value: hub.totalRaids },
            { label: hubText.extractions, value: hub.totalExtractions },
            { label: hubText.bestDepth, value: hub.bestDepth },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[#2b2320] bg-black/40 px-3 py-4 text-center"
            >
              <div className="text-[12px] text-[#75685f]">{stat.label}</div>
              <div className="font-cinzel mt-2 text-2xl text-[#d6cdc3]">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </GothicModal>

      <GothicModal
        open={activeModal === 'threshold'}
        onClose={closeModal}
        icon="corruption"
        title={hotspots.threshold.label}
        subtitle={hotspots.threshold.hint}
        maxWidth="lg"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#85776a]">
              {hubText.loadoutHint.replace('{count}', String(hub.loadoutSlots))}
            </p>
            <button
              type="button"
              onClick={handleBeginRaid}
              className="font-cinzel shrink-0 border-2 border-[#5c1f1f] bg-[#160909] px-8 py-3 text-sm uppercase tracking-[0.15em] text-[#d46060] transition hover:bg-[#220d0d]"
            >
              {hubText.beginRaid}
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-[#9d8d82]">
          {hubText.extractionBody}
        </p>

        <div className="mt-5">
          <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
            {hubText.loadout}
          </div>

          {hub.stash.length === 0 ? (
            <p className="mt-3 text-[15px] text-[#75685f]">{hubText.emptyStash}</p>
          ) : (
            <div className="mt-3 space-y-2">
              {hub.stash.map((artifact) => {
                const selected = selectedLoadout.includes(artifact.id)
                const slotsFull =
                  !selected && selectedLoadout.length >= hub.loadoutSlots

                return (
                  <button
                    key={artifact.id}
                    type="button"
                    disabled={slotsFull}
                    onClick={() => toggleLoadout(artifact.id)}
                    title={artifact.description}
                    className={`flex w-full items-center gap-3 border px-4 py-3 text-left transition disabled:opacity-40 ${
                      selected
                        ? 'border-[#8e1f1f] bg-[#160909]'
                        : 'border-[#2b2320] bg-black/30 hover:border-[#5c1f1f]'
                    }`}
                  >
                    <GameIcon type="artifact" size={40} />
                    <span className="text-[15px] text-[#d8c9be]">{artifact.name}</span>
                    {selected && (
                      <span className="ml-auto text-[11px] uppercase text-[#d46060]">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </GothicModal>
    </main>
  )
}
