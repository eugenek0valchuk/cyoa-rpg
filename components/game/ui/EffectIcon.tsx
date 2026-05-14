'use client'

import { RitualSymbol } from './RitualSymbol'

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

const TYPE_MAP: Record<string, RitualSymbolProps['type']> = {
  sanity: 'sanity',
  corruption: 'corruption',
  addFlag: 'flag',
  addArtifact: 'artifact',
  strength: 'strength',
  agility: 'agility',
  intelligence: 'intelligence',
}

import type { RitualSymbolProps } from './RitualSymbol'

export function EffectIcon({ type, size = 20 }: EffectIconProps) {
  const symbolType = TYPE_MAP[type]
  if (!symbolType) return null

  return <RitualSymbol type={symbolType} size={size} />
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
