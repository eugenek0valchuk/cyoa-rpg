'use client'

import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { journalCatalog, journalUi } from '@/locales/ru/journal'
import { hubChronicleUi } from '@/locales/ru/hubChronicle'
import { t } from '@/lib/i18n'
import type { HubState } from '@/lib/types/hub'

type TabId = 'chamber' | 'magazine' | 'marks'

interface HubChronicleMagazineProps {
  hub: HubState
  vesselName: string
  evolvedText: string
  roomTitle: string
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#d8c9be]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function HubChronicleMagazine({
  hub,
  vesselName,
  evolvedText,
  roomTitle,
}: HubChronicleMagazineProps) {
  const { ui: hubText, roomMarks: roomMarkLabels, roomMarkEffects } = t.hub
  const worldLore = t.lore
  const copy = hubChronicleUi

  const [tab, setTab] = useState<TabId>('magazine')
  const [pageIndex, setPageIndex] = useState(0)

  const unlockedSet = useMemo(
    () => new Set(hub.journalEntries ?? []),
    [hub.journalEntries],
  )

  const totalPages = journalCatalog.length
  const currentEntry = journalCatalog[pageIndex]
  const currentUnlocked = currentEntry
    ? unlockedSet.has(currentEntry.id)
    : false

  const unlockedCount = hub.journalEntries?.length ?? 0

  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'magazine', label: copy.tabMagazine, badge: `${unlockedCount}/${totalPages}` },
    { id: 'chamber', label: copy.tabChamber },
    {
      id: 'marks',
      label: copy.tabMarks,
      badge: hub.roomMarks.length > 0 ? String(hub.roomMarks.length) : undefined,
    },
  ]

  const goPrev = () => setPageIndex((value) => Math.max(0, value - 1))
  const goNext = () => setPageIndex((value) => Math.min(totalPages - 1, value + 1))

  return (
    <div className="flex min-h-[420px] flex-col">
      <div className="flex flex-wrap gap-2 border-b border-[#241919] pb-4">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
              tab === item.id
                ? 'border-[#5c1f1f] bg-[#160909] text-[#d46060]'
                : 'border-[#2b2320] bg-black/30 text-[#85776a] hover:border-[#4a2323] hover:text-[#b8a99e]'
            }`}
          >
            {item.label}
            {item.badge && (
              <span className="border border-[#3a3a4a]/60 bg-[#101018] px-1.5 py-0.5 text-[9px] text-[#a8a8c8]">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'magazine' && (
        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <aside className="hidden shrink-0 lg:block lg:w-44">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#75685f]">
              {copy.jumpToPage}
            </div>
            <ul className="mt-2 max-h-[340px] space-y-1 overflow-y-auto chronicle-scrollbar">
              {journalCatalog.map((entry, index) => {
                const open = unlockedSet.has(entry.id)

                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setPageIndex(index)}
                      className={`w-full border px-2 py-1.5 text-left text-[11px] transition ${
                        pageIndex === index
                          ? 'border-[#4a5c4a] bg-[#0d120d] text-[#b4c27d]'
                          : 'border-transparent text-[#75685f] hover:border-[#2b2320] hover:text-[#9d8d82]'
                      }`}
                    >
                      <span className="mr-1 text-[#5c4a4a]">{index + 1}.</span>
                      {open ? entry.title : '···'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative flex-1 border border-[#3b2f28] bg-[#14100e] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-[#2b2320]/80 sm:block" />

              <div className="flex h-full min-h-[280px] flex-col px-6 py-6 sm:px-8 sm:py-8">
                {pageIndex === 0 && (
                  <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#6f6259]">
                    {copy.magazineCover}
                  </div>
                )}

                {currentEntry && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-cinzel text-2xl uppercase tracking-[0.08em] text-[#efe5dc] sm:text-3xl">
                        {currentUnlocked ? currentEntry.title : copy.lockedPage}
                      </span>
                      {!currentUnlocked && <Lock className="h-4 w-4 text-[#5c4a4a]" />}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-[#75685f]">
                      <span>{journalUi.categoryLabels[currentEntry.category]}</span>
                      <span>·</span>
                      <span>
                        {copy.pageOf
                          .replace('{page}', String(pageIndex + 1))
                          .replace('{total}', String(totalPages))}
                      </span>
                      <span>·</span>
                      <span>{vesselName}</span>
                    </div>

                    <div className="mt-6 flex-1 overflow-y-auto chronicle-scrollbar pr-1">
                      {pageIndex === 0 ? (
                        <div className="mb-6 space-y-3 border-b border-[#2b2320] pb-5 text-[14px] leading-relaxed text-[#9d8d82]">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#d46060]">
                            {copy.magazineIssue}
                          </p>
                          <p>{evolvedText}</p>
                          <p className="text-[12px] text-[#6f6259]">
                            {copy.progress}: {unlockedCount} / {totalPages}
                          </p>
                        </div>
                      ) : null}

                      <div className="columns-1 gap-8 text-[15px] leading-[1.85] text-[#b8a99e] sm:columns-2">
                        {currentUnlocked ? (
                          <>
                            <p>{renderEmphasis(currentEntry.body)}</p>
                            <p className="mt-4 break-inside-avoid text-[12px] leading-relaxed text-[#6f8570]">
                              {journalUi.interactHint}: {currentEntry.effect}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="italic text-[#85776a]">{currentEntry.teaser}</p>
                            <p className="mt-4 break-inside-avoid text-[13px] text-[#5c4a4a]">
                              {copy.lockedHint}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={pageIndex === 0}
                className="inline-flex items-center gap-1 border border-[#2b2320] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#85776a] transition hover:border-[#4a2323] hover:text-[#d8c9be] disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                {copy.prevPage}
              </button>

              <div className="flex flex-wrap justify-center gap-1">
                {journalCatalog.map((entry, index) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setPageIndex(index)}
                    title={unlockedSet.has(entry.id) ? entry.title : copy.lockedPage}
                    className={`h-2 w-2 rounded-full transition ${
                      pageIndex === index
                        ? 'bg-[#d46060]'
                        : unlockedSet.has(entry.id)
                          ? 'bg-[#4a5c4a]'
                          : 'bg-[#3b2f28]'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={pageIndex >= totalPages - 1}
                className="inline-flex items-center gap-1 border border-[#2b2320] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#85776a] transition hover:border-[#4a2323] hover:text-[#d8c9be] disabled:opacity-30"
              >
                {copy.nextPage}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'chamber' && (
        <div className="mt-5 space-y-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#75685f]">
              {copy.chamberEvolution}
            </div>
            <div className="mt-2 font-cinzel text-xl text-[#efe5dc]">{roomTitle}</div>
            <p className="mt-4 text-[15px] leading-8 text-[#b8a99e]">{evolvedText}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: hubText.raids, value: hub.totalRaids },
              { label: hubText.extractions, value: hub.totalExtractions },
              { label: hubText.bestDepth, value: hub.bestDepth },
              { label: hubText.echo, value: hub.echo ?? 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[#2b2320] bg-black/40 px-3 py-4 text-center"
              >
                <div className="text-[11px] text-[#75685f]">{stat.label}</div>
                <div className="font-cinzel mt-2 text-2xl text-[#d6cdc3]">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
              {copy.roomPerksTitle}
            </div>
            <p className="mt-2 text-[13px] text-[#9d8d82]">
              {hubText.loadoutHint.replace('{count}', String(hub.loadoutSlots))}
              {hub.roomLevel >= 3 && (
                <span className="block mt-1 text-[#85776a]">
                  Ур. 3+: один бесплатный переброс проклятия на Пороге.
                </span>
              )}
            </p>
          </div>

          <div className="border-t border-[#241919] pt-5">
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
              {hubText.worldLore}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6f6259]">
              {worldLore.intro}
            </p>
            <ul className="mt-4 space-y-3">
              {worldLore.factions.map((faction) => (
                <li key={faction.id} className="text-[14px] text-[#9d8d82]">
                  <span className="text-[#c4b5aa]">{faction.name}</span>
                  <span className="text-[#85776a]"> — {faction.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'marks' && (
        <div className="mt-5">
          <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
            {hubText.marks}
          </div>
          {hub.roomMarks.length === 0 ? (
            <p className="mt-4 text-[14px] leading-relaxed text-[#6f6259]">
              {copy.emptyMarks}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {hub.roomMarks.map((mark) => (
                <li
                  key={mark}
                  className="flex items-start gap-3 border border-[#2b2320] bg-[#0a0808]/80 px-4 py-3"
                >
                  <GameIcon type="corruption" size={32} />
                  <div>
                    <div className="text-[15px] text-[#d8c9be]">
                      {roomMarkLabels[mark] ?? mark}
                    </div>
                    <p className="mt-1 text-[12px] text-[#6f6259]">
                      {roomMarkEffects[mark] ?? `${hubText.roomLabel} · ур. ${hub.roomLevel}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
