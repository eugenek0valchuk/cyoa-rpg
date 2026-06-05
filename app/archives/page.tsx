'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { GothicScreen } from '@/components/ui/GothicScreen'
import { restoreActiveSlot } from '@/hooks/useAutoSave'
import { t } from '@/lib/i18n'
import {
  deleteSaveSlot,
  getActiveSlotId,
  listSaveSlots,
  setActiveSlotId,
  type SaveSlot,
} from '@/lib/persistence/saveStorage'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useHubStore } from '@/lib/store/hubStore'
import type { Origin } from '@/lib/types/game'

function formatSavedAt(timestamp: number): string {
  if (!timestamp) {
    return t.ui.archives.noDescent
  }

  return new Date(timestamp).toLocaleString('ru-RU')
}

function slotHasProgress(slot: SaveSlot): boolean {
  return Boolean(slot.character && (slot.hub || slot.currentScene || slot.raid?.active))
}

const ORIGIN_ICON: Record<Origin, 'hollow' | 'heretic' | 'witness'> = {
  hollow: 'hollow',
  heretic: 'heretic',
  witness: 'witness',
}

export default function ArchivesPage() {
  const { archives: a } = t.ui
  const router = useRouter()
  const [slots, setSlots] = useState<SaveSlot[]>([])
  const [loading, setLoading] = useState(true)

  const character = useCharacterStore((state) => state.character)
  const hub = useHubStore((state) => state.hub)

  useEffect(() => {
    listSaveSlots()
      .then(setSlots)
      .finally(() => setLoading(false))
  }, [])

  const refreshSlots = () => {
    listSaveSlots().then(setSlots)
  }

  const handleContinue = async (slotId: number) => {
    const result = await restoreActiveSlot(slotId)

    if (result.restored) {
      router.push(result.raidActive ? '/game' : '/hub')
    }
  }

  const handleDelete = async (slotId: number) => {
    await deleteSaveSlot(slotId)
    refreshSlots()
  }

  const handleNewDescent = (slotId: number) => {
    setActiveSlotId(slotId)
    router.push(`/editor?slot=${slotId}`)
  }

  const handleBack = useCallback(async () => {
    if (character && hub) {
      router.push('/hub')
      return
    }

    const slotId = getActiveSlotId()
    const slot = slots[slotId]

    if (slot && slotHasProgress(slot)) {
      const result = await restoreActiveSlot(slotId)

      if (result.restored) {
        router.push(result.raidActive ? '/game' : '/hub')
        return
      }
    }

    router.push('/')
  }, [character, hub, router, slots])

  return (
    <GothicScreen>
      <div className="flex h-full flex-col overflow-y-auto px-5 py-8 sm:px-8 sm:py-10">
        <header className="mx-auto w-full max-w-3xl">
          <div className="text-[12px] uppercase tracking-[0.15em] text-[#85776a]">
            {a.eyebrow}
          </div>
          <h1 className="font-cinzel mt-1 text-4xl uppercase tracking-[0.1em] text-[#efe5dc] sm:text-5xl">
            {a.title}
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#9d8d82]">
            {a.description}
          </p>
        </header>

        <div className="mx-auto mt-8 w-full max-w-3xl space-y-3">
          {loading ? (
            <div className="border border-[#2b2320] bg-[#0d0909]/85 px-6 py-12 text-center text-sm uppercase tracking-[0.25em] text-[#75685f]">
              {a.loading}
            </div>
          ) : (
            slots.map((slot) => {
              const occupied = slotHasProgress(slot)
              const origin = slot.character?.origin

              return (
                <article
                  key={slot.slotId}
                  className="border border-[#2b2320] bg-[#0d0909]/88 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5">
                    <div className="flex min-w-0 items-start gap-4">
                      {origin && (
                        <GameIcon type={ORIGIN_ICON[origin]} size={44} />
                      )}
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.15em] text-[#75685f]">
                          {a.slot} {slot.slotId + 1}
                        </div>
                        <h2 className="font-cinzel mt-1 text-2xl uppercase tracking-[0.08em] text-[#efe5dc]">
                          {occupied ? slot.character!.name : a.emptyVessel}
                        </h2>
                        <p className="mt-2 text-[13px] text-[#85776a]">
                          {occupied
                            ? slot.raid?.active
                              ? `${a.inRaid} · ${formatSavedAt(slot.savedAt)}`
                              : `${a.inChamber} · ${formatSavedAt(slot.savedAt)}`
                            : a.noDescent}
                        </p>

                        {occupied && slot.character && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 border border-[#241919] bg-black/35 px-2 py-1 text-[11px] text-[#9d8d82]">
                              <GameIcon type="sanity" size={20} />
                              {a.sanity}: {slot.character.sanity}
                            </span>
                            <span className="inline-flex items-center gap-1.5 border border-[#241919] bg-black/35 px-2 py-1 text-[11px] text-[#9d8d82]">
                              <GameIcon type="corruption" size={20} />
                              {a.depth}:{' '}
                              {slot.raid?.active
                                ? slot.raid.depth
                                : slot.hub?.bestDepth ?? 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {occupied ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleContinue(slot.slotId)}
                            className="border border-[#5c1f1f] bg-[#160909] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#d46060] transition hover:bg-[#220d0d]"
                          >
                            {a.continue}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(slot.slotId)}
                            className="border border-[#2b2320] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
                          >
                            {a.erase}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleNewDescent(slot.slotId)}
                          className="border border-[#5c1f1f] bg-[#160909] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#d46060] transition hover:bg-[#220d0d]"
                        >
                          {a.newDescent}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl text-center">
          <button
            type="button"
            onClick={handleBack}
            className="border border-[#2b2320] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
          >
            {a.return}
          </button>
        </div>
      </div>
    </GothicScreen>
  )
}
