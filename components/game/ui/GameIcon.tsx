'use client'

export interface GameIconProps {
  type:
    | 'sanity'
    | 'corruption'
    | 'strength'
    | 'agility'
    | 'intelligence'
    | 'artifact'
    | 'flag'
    | 'hollow'
    | 'heretic'
    | 'witness'
  size?: number
  className?: string
}

const ICON_MAP: Record<string, string> = {
  sanity: '/ui/gothic-sanity-eye.png',
  corruption: '/ui/gothic-corruption-blood.png',
  strength: '/ui/gothic-strength.png',
  agility: '/ui/gothic-agility.png',
  intelligence: '/ui/gothic-blessed-star.png',
  artifact: '/ui/gothic-cursed-rosary.png',
  flag: '/ui/gothic-skull-sigil.png',
  hollow: '/ui/gothic-ashen-mask.png',
  heretic: '/ui/gothic-corruption-cross.png',
  witness: '/ui/gothic-sanity-eye.png',
}

export function GameIcon({ type, size = 20, className }: GameIconProps) {
  const src = ICON_MAP[type]
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
