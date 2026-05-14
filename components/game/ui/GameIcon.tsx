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

const GLOW_MAP: Record<string, string> = {
  sanity: 'drop-shadow(0 0 6px rgba(216,208,200,0.5))',
  corruption: 'drop-shadow(0 0 8px rgba(212,96,96,0.6))',
  strength: 'drop-shadow(0 0 8px rgba(212,96,96,0.6))',
  agility: 'drop-shadow(0 0 8px rgba(180,194,125,0.5))',
  intelligence: 'drop-shadow(0 0 8px rgba(146,166,221,0.5))',
  artifact: 'drop-shadow(0 0 10px rgba(250,204,21,0.5))',
  flag: 'drop-shadow(0 0 6px rgba(125,168,125,0.4))',
  hollow: 'drop-shadow(0 0 6px rgba(150,130,120,0.4))',
  heretic: 'drop-shadow(0 0 8px rgba(212,96,96,0.5))',
  witness: 'drop-shadow(0 0 8px rgba(216,208,200,0.4))',
}

export function GameIcon({ type, size = 20, className }: GameIconProps) {
  const src = ICON_MAP[type]
  const glow = GLOW_MAP[type]
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: glow,
      }}
    />
  )
}
