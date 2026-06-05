'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { GothicScreen } from '@/components/ui/GothicScreen'
import { restoreActiveSlot } from '@/hooks/useAutoSave'
import {
  getActiveSlotId,
  listSaveSlots,
  type SaveSlot,
} from '@/lib/persistence/saveStorage'
import { t } from '@/lib/i18n'

function slotHasProgress(slot: SaveSlot): boolean {
  return Boolean(slot.character && (slot.hub || slot.currentScene || slot.raid?.active))
}

export default function HomePage() {
  const { home } = t.ui
  const router = useRouter()
  const [previewSlot, setPreviewSlot] = useState<SaveSlot | null>(null)

  useEffect(() => {
    listSaveSlots().then((slots) => {
      const activeId = getActiveSlotId()
      const preferred = slots[activeId]
      const fallback = slots.find(slotHasProgress)
      setPreviewSlot(
        preferred && slotHasProgress(preferred) ? preferred : fallback ?? null,
      )
    })
  }, [])

  const handleContinuePreview = async () => {
    if (!previewSlot) {
      return
    }

    const result = await restoreActiveSlot(previewSlot.slotId)

    if (result.restored) {
      router.push(result.raidActive ? '/game' : '/hub')
    }
  }

  return (
    <GothicScreen imageClassName="opacity-55">
      <div className="flex h-full flex-col">
        <header className="px-6 pt-10 sm:px-10 sm:pt-14">
          <div className="text-[12px] uppercase tracking-[0.2em] text-[#85776a]">
            {home.footer1}
          </div>
          <h1 className="font-cinzel mt-2 text-5xl uppercase tracking-[0.12em] text-[#efe5dc] sm:text-7xl">
            {home.titleLine1}
          </h1>
          <h1 className="font-cinzel text-6xl uppercase tracking-[0.1em] text-[#8e1f1f] sm:text-8xl">
            {home.titleLine2}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-8 text-[#9d8d82]">
            {home.tagline1} {home.tagline1b}
            <br />
            {home.tagline2} {home.tagline2b}
          </p>
        </header>

        <div className="mt-auto px-6 pb-10 sm:px-10 sm:pb-14">
          <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <Link
                href="/archives"
                className="group flex items-center gap-4 border border-[#3b2a2a] bg-[#0d0909]/88 px-5 py-5 no-underline transition hover:border-[#8e1f1f] hover:bg-[#160909]"
              >
                <GameIcon type="corruption" size={40} />
                <div>
                  <div className="font-cinzel text-2xl uppercase tracking-[0.12em] text-[#d46060] group-hover:text-[#ff7b7b]">
                    {home.begin}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#75685f]">
                    {home.beginSub}
                  </div>
                </div>
              </Link>

              <Link
                href="/archives"
                className="group flex items-center gap-4 border border-[#2b2320] bg-[#0d0909]/70 px-5 py-4 no-underline transition hover:border-[#5c1f1f] hover:bg-[#120909]"
              >
                <GameIcon type="flag" size={36} />
                <div>
                  <div className="font-cinzel text-xl uppercase tracking-[0.12em] text-[#d8c9be]">
                    {home.archives}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#75685f]">
                    {home.archivesSub}
                  </div>
                </div>
              </Link>
            </div>

            <div className="border border-[#3b2a2a]/80 bg-[#0d0909]/85 p-5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#75685f]">
                {home.slotPreview}
              </div>

              {previewSlot?.character ? (
                <>
                  <h2 className="font-cinzel mt-3 text-3xl uppercase tracking-[0.08em] text-[#efe5dc]">
                    {previewSlot.character.name}
                  </h2>
                  <p className="mt-2 text-[13px] text-[#85776a]">
                    {previewSlot.raid?.active
                      ? home.continueRaid
                      : home.continueHub}
                    {' · '}
                    {t.ui.archives.slot} {previewSlot.slotId + 1}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="border border-[#2b2320] bg-black/35 px-3 py-3">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
                        <GameIcon type="sanity" size={24} />
                        {home.slotSanity}
                      </div>
                      <div className="font-cinzel mt-2 text-2xl text-[#d8c9be]">
                        {previewSlot.character.sanity}
                      </div>
                    </div>
                    <div className="border border-[#2b2320] bg-black/35 px-3 py-3">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
                        <GameIcon type="corruption" size={24} />
                        {home.slotDepth}
                      </div>
                      <div className="font-cinzel mt-2 text-2xl text-[#d8c9be]">
                        {previewSlot.raid?.active
                          ? previewSlot.raid.depth
                          : previewSlot.hub?.bestDepth ?? 0}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinuePreview}
                    className="font-cinzel mt-5 w-full border-2 border-[#5c1f1f] bg-[#160909] px-4 py-3 text-sm uppercase tracking-[0.15em] text-[#d46060] transition hover:bg-[#220d0d]"
                  >
                    {home.continueSlot}
                  </button>
                </>
              ) : (
                <p className="mt-4 text-[14px] leading-relaxed text-[#85776a]">
                  {home.slotEmpty}
                </p>
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-[13px] text-[#6f6259]">
              {home.footer1} {home.footer2}
            </p>
            <div className="mt-3 text-[10px] uppercase tracking-[0.35em] text-[#4c433d]">
              {home.version}
            </div>
          </div>
        </div>
      </div>
    </GothicScreen>
  )
}
