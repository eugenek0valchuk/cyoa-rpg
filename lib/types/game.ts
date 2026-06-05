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
  /** PNG в каталоге /artifacts/ */
  imageSrc?: string
  whisper?: string[]
  /** Постоянное влияние, пока реликвия в инвентаре */
  effects?: ArtifactEffect
  /** Разовый удар при первом подборе в спуске */
  onAcquire?: ArtifactEffect
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
  /** Сцена после провала риск-проверки (d20) по требованию стата */
  riskFailSceneId?: string
  effects?: {
    sanity?: number
    corruption?: number
    addFlag?: string
    /** Additional flags applied with addFlag in one choice */
    addFlags?: string[]
    addArtifact?: string
    /** Материалы в камеру (мастерская) */
    addMaterials?: Partial<
      Record<'iron_shard' | 'wax_seal' | 'choir_splinter' | 'folio_page', number>
    >
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
