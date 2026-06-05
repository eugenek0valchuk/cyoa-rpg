import { t } from '@/lib/i18n'

type StatKey = 'strength' | 'agility' | 'intelligence'
type EffectKey = 'sanity' | 'corruption'

const STAT_LABEL: Record<StatKey, string> = {
  strength: t.ui.game.strength,
  agility: t.ui.game.agility,
  intelligence: t.ui.game.intelligence,
}

const EFFECT_LABEL: Record<EffectKey, string> = {
  sanity: t.ui.game.sanity,
  corruption: t.ui.game.corruption,
}

function statTip(key: StatKey | EffectKey): string {
  return t.hub.ui.statTips[key]
}

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

export function getRequirementTooltip(
  stat: StatKey,
  need: number,
  have: number,
): { title: string; body: string } {
  const { tooltips } = t.ui.game
  const met = have >= need

  return {
    title: STAT_LABEL[stat],
    body: [
      (met ? tooltips.reqMet : tooltips.reqUnmet)
        .replace('{need}', String(need))
        .replace('{have}', String(have)),
      statTip(stat),
    ].join(' '),
  }
}

export function getEffectTooltip(
  stat: EffectKey,
  delta: number,
): { title: string; body: string } {
  const { tooltips } = t.ui.game

  return {
    title: EFFECT_LABEL[stat],
    body: [
      tooltips.effectAfter
        .replace('{stat}', EFFECT_LABEL[stat])
        .replace('{delta}', formatDelta(delta)),
      statTip(stat),
    ].join(' '),
  }
}

export function getRelicTooltip(): { title: string; body: string } {
  return {
    title: t.ui.game.choiceRelic,
    body: t.ui.game.tooltips.relicGain,
  }
}

export function getFlagTooltip(): { title: string; body: string } {
  return {
    title: t.ui.game.choiceFlag,
    body: t.ui.game.tooltips.flagGain,
  }
}
