'use client'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { GothicModal } from '@/components/ui/GothicModal'
import { getRaidFlagEntry, getRaidFlagIds } from '@/lib/game/raidChronicle'
import {
  getJournalCatalogForOrigin,
  getJournalEntry,
  sortJournalEntries,
} from '@/lib/game/journal'
import { journalUi } from '@/locales/ru/journal'
import { t } from '@/lib/i18n'
import type { Origin } from '@/lib/types/game'

interface RaidChronicleModalProps {
  open: boolean
  onClose: () => void
  flags: string[]
  journalEntries: string[]
  raidDepth: number
  origin?: Origin | null
}

export function RaidChronicleModal({
  open,
  onClose,
  flags,
  journalEntries,
  raidDepth,
  origin,
}: RaidChronicleModalProps) {
  const { ui: runText, flags: flagLabels } = t.raidChronicle
  const flagIds = getRaidFlagIds(flags)
  const unlockedSet = new Set(journalEntries)
  const visibleCatalog = getJournalCatalogForOrigin(origin)
  const sortedUnlocked = sortJournalEntries(journalEntries, origin)

  return (
    <GothicModal
      open={open}
      onClose={onClose}
      icon="flag"
      title={journalUi.title}
      subtitle={journalUi.subtitle}
      maxWidth="lg"
    >
      <p className="text-[15px] leading-8 text-[#b8a99e]">
        {journalEntries.length === 0 ? journalUi.introLocked : journalUi.introPartial}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
            {runText.depthLabel}
          </div>
          <div className="font-cinzel mt-1 text-2xl text-[#efe5dc]">{raidDepth}</div>
        </div>
        <div className="border border-[#2b3528] bg-[#0a0d0a]/50 px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
            {journalUi.persistent}
          </div>
          <div className="font-cinzel mt-1 text-2xl text-[#b4c27d]">
            {sortedUnlocked.length}/{visibleCatalog.length}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#241919] pt-5">
        <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
          {journalUi.persistent}
        </div>
        <ul className="mt-3 space-y-2">
          {visibleCatalog.map((entry) => {
            const unlocked = unlockedSet.has(entry.id)
            const def = getJournalEntry(entry.id) ?? entry

            return (
              <li
                key={entry.id}
                className={`border px-4 py-3 ${
                  unlocked
                    ? 'border-[#2b3528] bg-[#0a0d0a]/80'
                    : 'border-[#241919] bg-black/20 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <GameIcon type={unlocked ? 'flag' : 'corruption'} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-cinzel text-[14px] uppercase tracking-[0.06em] text-[#d8c9be]">
                        {def.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#6f6259]">
                        {journalUi.categoryLabels[def.category]}
                      </span>
                      {!unlocked && (
                        <span className="text-[10px] uppercase tracking-[0.1em] text-[#5c4a4a]">
                          {journalUi.lockedLabel}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#9d8d82]">
                      {unlocked ? def.body : def.teaser}
                    </p>
                    {unlocked && (
                      <p className="mt-2 text-[11px] leading-relaxed text-[#6f8570]">
                        {journalUi.interactHint}: {def.effect}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-6 border-t border-[#241919] pt-5">
        <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
          {journalUi.runMarks}
        </div>
        {flagIds.length === 0 ? (
          <p className="mt-3 text-[14px] leading-relaxed text-[#6f6259]">
            {runText.emptyFlags}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {flagIds.map((flagId) => {
              const entry = flagLabels[flagId] ?? getRaidFlagEntry(flagId)

              return (
                <li
                  key={flagId}
                  className="flex items-start gap-2 border border-[#2b2320] bg-[#0a0808]/60 px-3 py-2 text-[13px] text-[#9d8d82]"
                >
                  <GameIcon type="flag" size={24} />
                  <div>
                    <span className="text-[#c4b5aa]">{entry.label}</span>
                    <span className="text-[#85776a]"> — {entry.blurb}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </GothicModal>
  )
}
