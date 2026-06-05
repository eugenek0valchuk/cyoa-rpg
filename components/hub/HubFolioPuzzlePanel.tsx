'use client'

import {
  canSolveFolioPuzzle,
  countFolioPages,
  getFolioFragments,
  solveFolioPuzzle,
} from '@/lib/game/hubWorkshop'
import { hubWorkshopUi } from '@/locales/ru/hubWorkshop'
import { t } from '@/lib/i18n'
import type { HubState } from '@/lib/types/hub'

interface HubFolioPuzzlePanelProps {
  hub: HubState
  onSolve: (nextHub: HubState, message: string, correct: boolean) => void
}

export function HubFolioPuzzlePanel({ hub, onSolve }: HubFolioPuzzlePanelProps) {
  const copy = t.hubWorkshop
  const pages = countFolioPages(hub)
  const fragments = getFolioFragments(hub)
  const ready = canSolveFolioPuzzle(hub)
  const solved = hub.folioPuzzleSolved

  if (solved) {
    return (
      <p className="text-[14px] leading-relaxed text-[#8faa6a]">
        {copy.puzzleSolved}
      </p>
    )
  }

  return (
    <div className="space-y-5" data-testid="hub-folio-puzzle">
      <div>
        <h3 className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc]">
          {copy.puzzleTitle}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#9d8d82]">
          {copy.puzzleSubtitle}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#75685f]">
          {ready
            ? copy.puzzleReady
            : copy.puzzleNeedPages.replace('{count}', String(pages))}
        </p>
      </div>

      {fragments.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
            {copy.folioCollectedTitle}
          </h4>
          <ul className="space-y-2">
            {fragments.map((fragmentId, index) => (
              <li
                key={fragmentId}
                className="border border-[#3b2f28] bg-[#14100e] px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#a08040]">
                  {copy.folioFragmentTitle} {index + 1}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#d8c9be]">
                  {copy.folioFragments[fragmentId] ?? fragmentId}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {fragments.length === 0 && pages > 0 && (
        <p className="text-[12px] leading-relaxed text-[#75685f]">
          {copy.folioLegacyHint}
        </p>
      )}

      {ready && (
        <ul className="space-y-2">
          {(
            Object.entries(copy.puzzleChoices) as [string, string][]
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  const result = solveFolioPuzzle(hub, id)
                  onSolve(
                    result.hub,
                    result.correct ? copy.puzzleSolved : copy.puzzleWrong,
                    result.correct,
                  )
                }}
                className="w-full border border-[#3b2f28] bg-[#14100e] px-4 py-3 text-left text-[13px] leading-relaxed text-[#d8c9be] transition hover:border-[#5c4040] hover:bg-[#1a1414]"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
