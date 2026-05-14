'use client'

import { GameIcon } from './GameIcon'

interface EffectIconProps {
  type:
    | 'sanity'
    | 'corruption'
    | 'addFlag'
    | 'addArtifact'
    | 'strength'
    | 'agility'
    | 'intelligence'
  size?: number
}

const TYPE_MAP: Record<string, GameIconProps['type']> = {
  sanity: 'sanity',
  corruption: 'corruption',
  addFlag: 'flag',
  addArtifact: 'artifact',
  strength: 'strength',
  agility: 'agility',
  intelligence: 'intelligence',
}

import type { GameIconProps } from './GameIcon'

export function EffectIcon({ type, size = 28 }: EffectIconProps) {
  const iconType = TYPE_MAP[type]
  if (!iconType) return null

  return <GameIcon type={iconType} size={size} />
}

export function formatEffectValue(effect: {
  type: string
  value: number
}): string {
  const prefix = effect.value > 0 ? '+' : ''
  return `${prefix}${effect.value}`
}

export function getEffectColor(type: string): string {
  const colors: Record<string, string> = {
    sanity: '#d8d0c8',
    corruption: '#d46060',
    addFlag: '#b4c27d',
    addArtifact: '#facc15',
    strength: '#d46060',
    agility: '#b4c27d',
    intelligence: '#92a6dd',
  }
  return colors[type] || '#d8cbc0'
}
