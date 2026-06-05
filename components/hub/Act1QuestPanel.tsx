'use client'

import { Check, ChevronDown, ChevronUp, Circle, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { renderNarrativeEmphasis } from '@/components/game/shared/NarrativeText'
import { Act1RewardShelf } from '@/components/hub/Act1RewardShelf'
import { isStepRewardPending } from '@/lib/game/acts/act1RewardClaims'
import { getVisibleKeeperLines } from '@/lib/game/acts/act1Keeper'
import { getAct1StepViews } from '@/lib/game/acts/questEngine'
import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

interface Act1QuestPanelProps {
  hub: HubState
  character: Character
  onClaimReward?: (hub: HubState, character: Character) => void
  onOpenWorkshop?: () => void
}

function StepRow({
  title,
  hint,
  doneText,
  onShelf,
  active,
  revealed,
  completed,
}: {
  title: string
  hint: string
  doneText?: string
  onShelf?: boolean
  active?: boolean
  revealed: boolean
  completed: boolean
}) {
  const copy = t.acts.act1

  return (
    <li
      className={`border px-4 py-3 ${
        active
          ? 'border-[#5c1f1f]/70 bg-[#160909]/50 shadow-[inset_0_0_0_1px_rgba(212,96,96,0.15)]'
          : completed
            ? 'border-[#3a4a3a] bg-[#0d120d]/80'
            : revealed
              ? 'border-[#3b2f28] bg-[#14100e]'
              : 'border-[#2b2320]/80 bg-black/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-[#75685f]">
          {completed ? (
            <Check className="h-4 w-4 text-[#8faa6a]" />
          ) : revealed ? (
            <Circle className="h-4 w-4 text-[#d46060]" />
          ) : (
            <Lock className="h-4 w-4 text-[#5c4a4a]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-cinzel text-sm uppercase tracking-[0.06em] text-[#efe5dc]">
            {revealed ? title : copy.hidden}
          </div>
          {revealed && !completed && (
            <p className="mt-1 text-[12px] leading-relaxed text-[#9d8d82]">
              {renderNarrativeEmphasis(hint)}
            </p>
          )}
          {completed && onShelf && (
            <p className="mt-1 text-[12px] leading-relaxed text-[#a08040]">
              {copy.onShelf}
            </p>
          )}
          {completed && !onShelf && (
            <p className="mt-1 text-[12px] leading-relaxed text-[#9d8d82]">
              {renderNarrativeEmphasis(doneText ?? copy.completed)}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

export function Act1QuestPanel({
  hub,
  character,
  onClaimReward,
  onOpenWorkshop,
}: Act1QuestPanelProps) {
  const copy = t.acts.act1
  const [keeperLineId, setKeeperLineId] = useState<string | null>(null)
  const [optionalOpen, setOptionalOpen] = useState(false)
  const steps = useMemo(() => getAct1StepViews(hub, character), [hub, character])
  const keeperLines = useMemo(
    () => getVisibleKeeperLines(hub, character),
    [hub, character],
  )
  const activeKeeperLine = keeperLines.find((line) => line.id === keeperLineId)

  const mainSteps = steps.filter((step) => step.type === 'main')
  const optionalSteps = steps.filter((step) => step.type === 'optional')
  const mainDone = mainSteps.filter((step) => step.completed).length
  const optDone = optionalSteps.filter((step) => step.completed).length
  const activeMainStepId = mainSteps.find(
    (step) => step.revealed && !step.completed,
  )?.id
  const actComplete = hub.act1?.actComplete ?? false
  const mainPct =
    mainSteps.length > 0 ? Math.round((mainDone / mainSteps.length) * 100) : 0

  if (!character.origin) {
    return (
      <p className="text-[14px] leading-relaxed text-[#9d8d82]">{copy.noOrigin}</p>
    )
  }

  const intro =
    character.origin && copy.originIntro[character.origin]
      ? copy.originIntro[character.origin]
      : null

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5" data-testid="act1-quest-panel">
      <div>
        <h3 className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc]">
          {copy.title}
        </h3>
        {intro && (
          <p className="mt-3 border-l-2 border-[#8e1f1f]/60 pl-3 text-[13px] leading-relaxed text-[#b8a99e]">
            {intro}
          </p>
        )}
        <p className="mt-2 text-[13px] leading-relaxed text-[#9d8d82]">{copy.subtitle}</p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#75685f]">
          {copy.progress
            .replace('{done}', String(mainDone))
            .replace('{total}', String(mainSteps.length))}
          {actComplete ? ` · ${copy.actComplete}` : ` · ${copy.actIncomplete}`}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden border border-[#2b2320] bg-black/40">
          <div
            className="h-full bg-gradient-to-r from-[#5c1f1f] to-[#d46060] transition-all duration-500"
            style={{ width: `${mainPct}%` }}
          />
        </div>
      </div>

      {onClaimReward && (
        <Act1RewardShelf
          hub={hub}
          character={character}
          onClaim={onClaimReward}
          onOpenWorkshop={onOpenWorkshop}
        />
      )}

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d46060]">
          {copy.mainLine}
          {activeMainStepId && (
            <span className="ml-2 text-[#85776a]">· {copy.nextStep}</span>
          )}
        </h4>
        <ul className="mt-3 space-y-2">
          {mainSteps.map((step) => (
            <StepRow
              key={step.id}
              title={step.titleRevealed}
              hint={step.hint}
              doneText={step.completeMessage}
              onShelf={isStepRewardPending(hub, step.id)}
              active={step.id === activeMainStepId}
              revealed={step.revealed}
              completed={step.completed}
            />
          ))}
        </ul>
      </section>

      <section className="border border-[#2b2320] bg-[#0a0808]/60 px-4 py-4">
        <h4 className="font-cinzel text-sm uppercase tracking-[0.08em] text-[#c4b5aa]">
          {copy.keeperTitle}
        </h4>
        <p className="mt-2 text-[12px] leading-relaxed text-[#85776a]">
          {copy.keeperHint}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {keeperLines.map((line) => (
            <li key={line.id}>
              <button
                type="button"
                onClick={() =>
                  setKeeperLineId((current) =>
                    current === line.id ? null : line.id,
                  )
                }
                className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] transition ${
                  keeperLineId === line.id
                    ? 'border-[#5c1f1f] bg-[#160909] text-[#d46060]'
                    : 'border-[#3b2f28] bg-[#14100e] text-[#9d8d82] hover:border-[#4a2323]'
                }`}
              >
                {line.prompt}
              </button>
            </li>
          ))}
        </ul>
        {activeKeeperLine && (
          <p className="mt-3 border-l-2 border-[#4a5c4a]/60 pl-3 text-[13px] leading-relaxed text-[#b8a99e]">
            {renderNarrativeEmphasis(activeKeeperLine.response)}
          </p>
        )}
      </section>

      {optionalSteps.length > 0 && (
        <section className="border border-[#2b2320]/80 bg-black/15 px-4 py-3">
          <button
            type="button"
            onClick={() => setOptionalOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                {copy.optional}
              </h4>
              <p className="mt-1 text-[11px] text-[#6f6259]">
                {copy.optionalProgress
                  .replace('{done}', String(optDone))
                  .replace('{total}', String(optionalSteps.length))}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-[#85776a]">
              {optionalOpen ? copy.optionalCollapse : copy.optionalExpand}
              {optionalOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </button>
          {optionalOpen && (
            <ul className="mt-3 space-y-2 border-t border-[#241919] pt-3">
              {optionalSteps.map((step) => (
                <StepRow
                  key={step.id}
                  title={step.titleRevealed}
                  hint={step.hint}
                  doneText={step.completeMessage}
                  onShelf={isStepRewardPending(hub, step.id)}
                  revealed={step.revealed}
                  completed={step.completed}
                />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
