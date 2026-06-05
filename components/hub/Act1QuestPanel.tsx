'use client'

import { Check, Circle, Lock } from 'lucide-react'
import { useMemo } from 'react'

import { renderNarrativeEmphasis } from '@/components/game/shared/NarrativeText'
import { getAct1StepViews } from '@/lib/game/acts/questEngine'
import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

interface Act1QuestPanelProps {
  hub: HubState
  character: Character
}

function StepRow({
  title,
  hint,
  doneText,
  revealed,
  completed,
}: {
  title: string
  hint: string
  doneText?: string
  revealed: boolean
  completed: boolean
}) {
  const copy = t.acts.act1

  return (
    <li
      className={`border px-4 py-3 ${
        completed
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
          {completed && (
            <p className="mt-1 text-[12px] leading-relaxed text-[#9d8d82]">
              {renderNarrativeEmphasis(doneText ?? copy.completed)}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

export function Act1QuestPanel({ hub, character }: Act1QuestPanelProps) {
  const copy = t.acts.act1
  const steps = useMemo(() => getAct1StepViews(hub, character), [hub, character])

  const mainSteps = steps.filter((step) => step.type === 'main')
  const optionalSteps = steps.filter((step) => step.type === 'optional')
  const mainDone = mainSteps.filter((step) => step.completed).length
  const actComplete = hub.act1?.actComplete ?? false

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
      </div>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d46060]">
          {copy.mainLine}
        </h4>
        <ul className="mt-3 space-y-2">
          {mainSteps.map((step) => (
            <StepRow
              key={step.id}
              title={step.titleRevealed}
              hint={step.hint}
              doneText={step.completeMessage}
              revealed={step.revealed}
              completed={step.completed}
            />
          ))}
        </ul>
      </section>

      {optionalSteps.length > 0 && (
        <section>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
            {copy.optional}
          </h4>
          <ul className="mt-3 space-y-2">
            {optionalSteps.map((step) => (
              <StepRow
                key={step.id}
                title={step.titleRevealed}
                hint={step.hint}
                doneText={step.completeMessage}
                revealed={step.revealed}
                completed={step.completed}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
