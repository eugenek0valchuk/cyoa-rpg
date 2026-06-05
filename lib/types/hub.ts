import type { Act1Progress } from '@/lib/game/acts/types'
import type { Artifact } from './game'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
import type { RaidOutcome } from './raidSummary'

export type HubRaidLogEntry = {
  raidNumber: number
  outcome: RaidOutcome
  depth: number
  echoGain?: number
}

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
  /** Покупки у Бездыханного в текущей витрине */
  merchantPurchases?: string[]
  /** id офферов в текущей витрине телеги */
  merchantStockIds?: string[]
  /** Номер обновления витрины (длина raidLog при смене товара) */
  merchantStockCycle?: number
  /** Приоритет встречи на следующий спуск (награда обета) */
  pendingEncounterBoost?: string | null
  /** Обет выполнен — награда ждёт сдачи у Писца */
  pendingContractClaim?: PendingContractClaim | null
  stash: Artifact[]
  totalRaids: number
  totalExtractions: number
  bestDepth: number
  loadoutSlots: number
  /** Последние исходы спусков — для хроники камеры */
  raidLog?: HubRaidLogEntry[]
  /** Отдых в камере уже использован до следующего возвращения из спуска */
  chamberRestUsed?: boolean
  /** Прогресс Акта I — главная линия и опциональные задачи */
  act1?: Act1Progress
  /** Детали из спусков для мастерской */
  materials?: Record<string, number>
  /** Уровни построек в камере */
  buildings?: Record<string, number>
  /** Бонус рассудка от лампы мастерской */
  workshopSanityBonus?: number
  /** Головоломка фолианта решена */
  folioPuzzleSolved?: boolean
  /** Собранные страницы фолианта — folio_a, folio_b, folio_c */
  folioFragments?: string[]
  /** Прочитанные карточки лора во вкладке «Лор» */
  loreReadIds?: string[]
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
  /** Аварийное извлечение уже использовано в этом спуске */
  emergencyExtractUsed?: boolean
  /** Встречи NPC в этом спуске — не повторять из пула */
  encountersSeen?: string[]
  /** Метки NPC-взаимодействий в этом спуске (synod_mark, wax_offered…) */
  npcFlags?: string[]
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
