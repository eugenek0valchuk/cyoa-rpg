export type Stats = {
  strength: number
  agility: number
  intelligence: number
}

export type Character = {
  name: string
  class: 'warrior' | 'mage' | 'rogue'
  stats: Stats
  inventory: string[]
}

export type Choice = {
  id: string
  text: string
  effects?: Partial<Stats>
  requires?: (char: Character) => boolean
}

export type Scene = {
  id: string
  title: string
  description: string
  options: Choice[]
}
