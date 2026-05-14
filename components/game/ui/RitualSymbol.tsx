'use client'

export interface RitualSymbolProps {
  type:
    | 'sanity'
    | 'corruption'
    | 'strength'
    | 'agility'
    | 'intelligence'
    | 'artifact'
    | 'flag'
  size?: number
  className?: string
}

function Sigil({
  path,
  viewBox = '0 0 24 24',
  color,
  size,
}: {
  path: string
  viewBox?: string
  color: string
  size: number
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
      className="shrink-0"
    >
      {path.split('|').map((d, i) => (
        <path key={i} d={d.trim()} />
      ))}
    </svg>
  )
}

const SYMBOLS: Record<
  string,
  { path: string; viewBox?: string; color: string }
> = {
  sanity: {
    color: '#d8d0c8',
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  corruption: {
    color: '#d46060',
    path: 'M12 2C6.48 2 3 6.48 3 12c0 4.42 2.65 8.25 6.38 9.85.28.1.54-.15.46-.45l-.76-2.85c.66.37 1.42.6 2.22.6s1.56-.23 2.22-.6l-.76 2.85c-.08.3.18.55.46.45C18.35 20.25 21 16.42 21 12c0-5.52-3.48-10-9-10zm-1 13l-4-4 1.41-1.41L11 12.17l4.59-4.59L17 9l-6 6z',
  },
  strength: {
    color: '#d46060',
    path: 'M14.12 14.12L12 16.24l-2.12-2.12M10.59 9.41L12 8l1.41 1.41M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6v6H6v-6z',
  },
  agility: {
    color: '#b4c27d',
    path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  intelligence: {
    color: '#92a6dd',
    path: 'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.37 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z',
  },
  artifact: {
    color: '#facc15',
    path: 'M12 2l1.5 4.5L18 6l-3.5 3.5L16 14l-4-2.5L8 14l1.5-4.5L6 6l4.5.5L12 2z',
  },
  flag: {
    color: '#7da87d',
    path: 'M4 21V3h14l-2 6l2 6H4',
  },
}

export function RitualSymbol({
  type,
  size = 20,
  className,
}: RitualSymbolProps) {
  const symbol = SYMBOLS[type]
  if (!symbol) return null

  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'inline-flex' }}
    >
      <Sigil
        path={symbol.path}
        viewBox={symbol.viewBox}
        color={symbol.color}
        size={size}
      />
    </span>
  )
}
