'use client'

import { useState } from 'react'

import { renderNarrativeEmphasis } from '@/components/game/shared/NarrativeText'
import {
  claimAct1StepReward,
  getAct1RewardClaimMessage,
  getPendingRewardSteps,
  rewardIncludesMaterials,
} from '@/lib/game/acts/act1RewardClaims'
import { ACT1_QUEST_STEPS } from '@/lib/game/acts/act1Quests'
import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

interface Act1RewardShelfProps {
  hub: HubState
  character: Character
  onClaim: (hub: HubState, character: Character) => void
  onOpenWorkshop?: () => void
}

export function Act1RewardShelf({
  hub,
  character,
  onClaim,
  onOpenWorkshop,
}: Act1RewardShelfProps) {
  const copy = t.acts.act1
  const pending = getPendingRewardSteps(hub)
  const [acceptedId, setAcceptedId] = useState<string | null>(null)

  if (pending.length === 0) {
    return null
  }

  const handleClaim = (stepId: string, thenWorkshop = false) => {
    const result = claimAct1StepReward(hub, character, stepId)
    if (!result) {
      return
    }

    setAcceptedId(stepId)
    onClaim(result.hub, result.character)

    window.setTimeout(() => {
      setAcceptedId((current) => (current === stepId ? null : current))
      if (thenWorkshop) {
        onOpenWorkshop?.()
      }
    }, 480)
  }

  return (
    <section
      className="border-2 border-[#4a6a4a] bg-[#0a120a]/90 px-4 py-4"
      data-testid="act1-reward-shelf"
    >
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6a8f6a]">
        {copy.rewardsShelfTitle}
      </h4>
      <p className="mt-2 text-[12px] leading-relaxed text-[#85776a]">
        {copy.rewardsShelfHint}
      </p>
      <ul className="mt-4 space-y-3">
        {pending.map((stepId) => {
          const step = ACT1_QUEST_STEPS.find((entry) => entry.id === stepId)
          if (!step) {
            return null
          }

          const preview = getAct1RewardClaimMessage(stepId)
          const hasMaterials = rewardIncludesMaterials(stepId)
          const justAccepted = acceptedId === stepId

          return (
            <li
              key={stepId}
              className={`border px-4 py-3 transition ${
                justAccepted
                  ? 'border-[#4a6a4a] bg-[#0d160d]/90'
                  : 'border-[#2b3528] bg-[#0d120d]/80'
              }`}
            >
              <div className="font-cinzel text-sm uppercase tracking-[0.06em] text-[#efe5dc]">
                {step.titleRevealed}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-[#9d8d82]">
                {justAccepted ? (
                  <span className="text-[#8faa6a]">{copy.claimAccepted}</span>
                ) : (
                  renderNarrativeEmphasis(preview)
                )}
              </p>
              {!justAccepted && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleClaim(stepId)}
                    className="font-cinzel border-2 border-[#5c1f1f] bg-[#160909] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[#d46060] transition hover:bg-[#220d0d]"
                  >
                    {copy.claimReward}
                  </button>
                  {hasMaterials && onOpenWorkshop && (
                    <button
                      type="button"
                      onClick={() => handleClaim(stepId, true)}
                      className="border border-[#3b2f28] bg-[#14100e] px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#9d8d82] transition hover:border-[#4a2323]"
                    >
                      {copy.openWorkshop}
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-[#6f6259]">
        {copy.claimWorkshopHint}
      </p>
    </section>
  )
}
