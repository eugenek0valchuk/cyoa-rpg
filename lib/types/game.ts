import { WorldState } from './world'

export type Origin = 'hollow' | 'heretic' | 'witness'

export interface CharacterStats {
  strength: number
  agility: number
  intelligence: number
}
export type ArtifactRarity = 'common' | 'rare' | 'forbidden' | 'mythic'

export interface ArtifactEffect {
  sanity?: number
  corruption?: number
  strength?: number
  agility?: number
  intelligence?: number
}

export interface GameState {
  character: Character
  world?: WorldState
}

export interface Artifact {
  id: string
  name: string
  description: string
  lore?: string
  rarity: ArtifactRarity
  icon?: string
  whisper?: string[]
  effects?: ArtifactEffect
  hidden?: boolean
}
export interface Character {
  name: string
  origin: Origin
  stats: CharacterStats
  inventory: Artifact[]
  sanity: number
  corruption: number
  flags: string[]
}

export interface ChoiceRequirements {
  strength?: number
  agility?: number
  intelligence?: number
  minCorruption?: number
  maxSanity?: number
  requiredFlag?: string
  requiredArtifact?: string
  forbiddenArtifact?: string
  requiredOrigin?: Origin
  forbiddenOrigin?: Origin
  /** Запись дневника из прошлых спусков */
  requiredJournal?: string
}

export interface Choice {
  id: string
  text: string
  /** Куда ведёт выбор, если id не совпадает с id сцены (например, два пути в catacombs). */
  targetSceneId?: string
  effects?: {
    sanity?: number
    corruption?: number
    addFlag?: string
    addArtifact?: string
  } | null
  requirements?: ChoiceRequirements | null
}
export type SceneHistoryEntry = {
  id: string
  title: string
  description: string
}

export interface Scene {
  id: string
  title: string
  description: string
  options: Choice[]
}
