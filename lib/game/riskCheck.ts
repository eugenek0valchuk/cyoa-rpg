import { getChoiceBlockReason } from './choiceBlockReason'
import { isChoiceAvailable } from './choiceUtils'
import { isChoiceVisible } from './choiceVisibility'

import type { Character, Choice } from '@/lib/types/game'

export type RiskStat = 'strength' | 'agility' | 'intelligence'

export type RiskOffer = {
  stat: RiskStat
  need: number
  have: number
  bonus: number
  dc: number
  chancePercent: number
}

export type RiskRollResult = {
  roll: number
  total: number
  dc: number
  success: boolean
  criticalSuccess: boolean
  criticalFailure: boolean
}

export const RISK_FAILURE_SANITY = -5
export const RISK_FAILURE_CORRUPTION = 2

export function computeRiskDc(requirement: number): number {
  return requirement * 2 + 3
}

export function computeRiskChance(bonus: number, dc: number): number {
  let successes = 0

  for (let face = 1; face <= 20; face += 1) {
    if (face === 1) {
      continue
    }

    if (face === 20 || face + bonus >= dc) {
      successes += 1
    }
  }

  return Math.round((successes / 20) * 100)
}

export function rollRiskCheck(
  bonus: number,
  dc: number,
  rng: () => number = Math.random,
): RiskRollResult {
  const roll = Math.floor(rng() * 20) + 1
  const criticalSuccess = roll === 20
  const criticalFailure = roll === 1
  const total = roll + bonus
  const success =
    criticalSuccess || (!criticalFailure && total >= dc)

  return {
    roll,
    total,
    dc,
    success,
    criticalSuccess,
    criticalFailure,
  }
}

export function getRiskOffer(
  choice: Choice,
  character: Character,
  journalEntries: string[] = [],
): RiskOffer | null {
  if (!isChoiceVisible(choice, character, journalEntries)) {
    return null
  }

  if (isChoiceAvailable(choice, character, journalEntries)) {
    return null
  }

  const reason = getChoiceBlockReason(choice, character, journalEntries)

  if (
    !reason ||
    (reason.kind !== 'strength' &&
      reason.kind !== 'agility' &&
      reason.kind !== 'intelligence')
  ) {
    return null
  }

  const dc = computeRiskDc(reason.need)

  return {
    stat: reason.kind,
    need: reason.need,
    have: reason.have,
    bonus: reason.have,
    dc,
    chancePercent: computeRiskChance(reason.have, dc),
  }
}

export function applyRiskFailure(character: Character): Character {
  return {
    ...character,
    sanity: Math.max(0, character.sanity + RISK_FAILURE_SANITY),
    corruption: Math.min(100, character.corruption + RISK_FAILURE_CORRUPTION),
  }
}
