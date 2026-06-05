import type { Artifact } from './game'
import type { RaidModifierId } from '@/lib/game/raidModifiers'

export type PendingContractClaim = {
  contractId: string
  title: string
  vow: string
  rewardSummary: string
}

export interface HubState {
  roomLevel: number
  roomMarks: string[]
  /** Постоянные записи дневника — сохраняются между спусками */
  journalEntries: string[]
  /** Валюта камеры — за успешные извлечения */
  echo: number
  /** Бонус рассудка на старт следующего спуска (лавка) */
  nextRaidSanityBonus?: number
  /** Одноразовые покупки у Бездыханного */
  merchantPurchases?: string[]
  /** Приоритет встречи на следующий спуск (награда обета) */
  pendingEncounterBoost?: string | null
  /** Обет выполнен — награда ждёт сдачи у Писца */
  pendingContractClaim?: PendingContractClaim | null
  stash: Artifact[]
  totalRaids: number
  totalExtractions: number
  bestDepth: number
  loadoutSlots: number
}

export interface RaidState {
  active: boolean
  depth: number
  inventoryAtStart: string[]
  modifierId?: RaidModifierId | null
  /** Обет, принятый у Писца перед спуском */
  contractId?: string | null
  /** Пролог спуска уже показан — не повторять при выходе в меню */
  prologueSeen?: boolean
}

export const MIN_EXTRACT_DEPTH = 2
export const DEFAULT_LOADOUT_SLOTS = 2

export function createInitialHubState(
  starterInventory: Artifact[] = [],
): HubState {
  return {
    roomLevel: 0,
    roomMarks: [],
    journalEntries: [],
    echo: 0,
    pendingEncounterBoost: null,
    pendingContractClaim: null,
    stash: [...starterInventory],
    totalRaids: 0,
    totalExtractions: 0,
    bestDepth: 0,
    loadoutSlots: DEFAULT_LOADOUT_SLOTS,
  }
}
