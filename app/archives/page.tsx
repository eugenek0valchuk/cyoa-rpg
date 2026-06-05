'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { restoreActiveSlot } from '@/hooks/useAutoSave'
import { t } from '@/lib/i18n'
import {
  deleteSaveSlot,
  listSaveSlots,
  setActiveSlotId,
  type SaveSlot,
} from '@/lib/persistence/saveStorage'

function formatSavedAt(timestamp: number): string {
  if (!timestamp) {
    return t.ui.archives.noDescent
  }

  return new Date(timestamp).toLocaleString('ru-RU')
}

export default function ArchivesPage() {
  const { archives: a } = t.ui
  const router = useRouter()
  const [slots, setSlots] = useState<SaveSlot[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-zinc-100">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="absolute inset-0 bg-black/70" />

      <section className="relative z-10 mx-auto max-w-[720px]">
        <div className="mb-8 text-center">
          <div className="text-[11px] uppercase tracking-[0.35em] text-[#75685f]">
            {a.eyebrow}
          </div>
          <h1 className="font-cinzel mt-2 text-4xl uppercase tracking-[0.12em] text-[#d6cdc3]">
            {a.title}
          </h1>
          <p className="mt-4 text-[14px] leading-7 text-[#85776a]">
            {a.description}
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="border border-[#3b3028]/80 bg-[#080505]/88 px-6 py-10 text-center text-sm uppercase tracking-[0.3em] text-[#75685f]">
              {a.loading}
            </div>
          ) : (
            slots.map((slot) => {
              const occupied = Boolean(slot.character && slot.currentScene)

              return (
                <article
                  key={slot.slotId}
                  className="border border-[#3b3028]/80 bg-[#080505]/88 px-6 py-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.35em] text-[#75685f]">
                        {a.slot} {slot.slotId + 1}
                      </div>
                      <h2 className="font-cinzel mt-2 text-2xl uppercase tracking-[0.1em] text-[#d6cdc3]">
                        {occupied ? slot.character!.name : a.emptyVessel}
                      </h2>
                      <p className="mt-2 text-[13px] text-[#85776a]">
                        {occupied
                          ? `${slot.currentScene!.title} · ${formatSavedAt(slot.savedAt)}`
                          : a.noDescent}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {occupied ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleContinue(slot.slotId)}
                            className="border border-[#5c1f1f] bg-[#160909] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-[#d46060] transition hover:bg-[#220d0d]"
                          >
                            {a.continue}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(slot.slotId)}
                            className="border border-[#2b2320] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
                          >
                            {a.erase}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleNewDescent(slot.slotId)}
                          className="border border-[#5c1f1f] bg-[#160909] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-[#d46060] transition hover:bg-[#220d0d]"
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

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.3em] text-[#75685f] no-underline hover:text-[#d46060]"
          >
            {a.return}
          </Link>
        </div>
      </section>
    </main>
  )
}
