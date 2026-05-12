export type Origin = 'hollow' | 'heretic' | 'witness'

export interface CharacterStats {
  strength: number
  agility: number
  intelligence: number
}

export interface Character {
  name: string

  origin: Origin

  stats: CharacterStats

  inventory: string[]

  sanity: number

  corruption: number

  flags: string[]
}

export interface Choice {
  id: string

  text: string

  requirements?: {
    strength?: number
    agility?: number
    intelligence?: number

    sanityBelow?: number

    corruptionAbove?: number

    hasItem?: string
  }

  effects?: {
    sanity?: number

    corruption?: number

    addItem?: string

    removeItem?: string

    addFlag?: string
  }
}

export interface Scene {
  id: string

  title: string

  description: string

  options: Choice[]
}

export type SceneHistoryEntry = {
  id: string

  title: string

  description: string
}
