'use client'

import { Brain, Droplets, Flag, Gem, Swords, Wind, Zap } from 'lucide-react'

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

const ICON_MAP = {
  sanity: Brain,
  corruption: Droplets,
  addFlag: Flag,
  addArtifact: Gem,
  strength: Swords,
  agility: Wind,
  intelligence: Zap,
}

const COLOR_MAP = {
  sanity: '#d8d0c8',
  corruption: '#d46060',
  addFlag: '#b4c27d',
  addArtifact: '#facc15',
  strength: '#d46060',
  agility: '#b4c27d',
  intelligence: '#92a6dd',
}

export function EffectIcon({ type, size = 20 }: EffectIconProps) {
  const Icon = ICON_MAP[type]
  const color = COLOR_MAP[type]

  return <Icon size={size} style={{ color }} />
}

export function formatEffectValue(effect: {
  type: string
  value: number
}): string {
  const prefix = effect.value > 0 ? '+' : ''
  return `${prefix}${effect.value}`
}

export function getEffectColor(type: string): string {
  return COLOR_MAP[type as keyof typeof COLOR_MAP] || '#d8cbc0'
}
