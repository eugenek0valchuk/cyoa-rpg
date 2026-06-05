import type { Character, Scene, SceneHistoryEntry } from '@/lib/types/game'
import type { HubState, RaidState } from '@/lib/types/hub'

export const SAVE_SLOT_COUNT = 3
export const ACTIVE_SLOT_KEY = 'cyoa-active-slot'

export interface SaveSlot {
  slotId: number
  character: Character | null
  currentScene: Scene | null
  history: string[]
  sceneHistory: SceneHistoryEntry[]
  hub: HubState | null
  raid: RaidState | null
  savedAt: number
}

const DB_NAME = 'cyoa-rpg-saves'
const DB_VERSION = 2
const STORE_NAME = 'slots'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'slotId' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode)
        const store = transaction.objectStore(STORE_NAME)
        const request = handler(store)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => db.close()
        transaction.onerror = () => reject(transaction.error)
      }),
  )
}

function normalizeSlot(slot: Partial<SaveSlot> & { slotId: number }): SaveSlot {
  const hub = slot.hub
    ? {
        ...slot.hub,
        journalEntries: slot.hub.journalEntries ?? [],
      }
    : null

  return {
    slotId: slot.slotId,
    character: slot.character ?? null,
    currentScene: slot.currentScene ?? null,
    history: slot.history ?? [],
    sceneHistory: slot.sceneHistory ?? [],
    hub,
    raid: slot.raid ?? null,
    savedAt: slot.savedAt ?? 0,
  }
}

export async function listSaveSlots(): Promise<SaveSlot[]> {
  const slots = await runTransaction<SaveSlot[]>('readonly', (store) =>
    store.getAll(),
  )

  const slotMap = new Map(slots.map((slot) => [slot.slotId, normalizeSlot(slot)]))

  return Array.from({ length: SAVE_SLOT_COUNT }, (_, slotId) => {
    return (
      slotMap.get(slotId) ?? {
        slotId,
        character: null,
        currentScene: null,
        history: [],
        sceneHistory: [],
        hub: null,
        raid: null,
        savedAt: 0,
      }
    )
  })
}

export async function loadSaveSlot(slotId: number): Promise<SaveSlot | null> {
  const slot = await runTransaction<SaveSlot | undefined>('readonly', (store) =>
    store.get(slotId),
  )

  return slot ? normalizeSlot(slot) : null
}

export async function writeSaveSlot(slot: SaveSlot): Promise<void> {
  await runTransaction('readwrite', (store) => store.put(normalizeSlot(slot)))
}

export async function deleteSaveSlot(slotId: number): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(slotId))
}

export function getActiveSlotId(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const raw = window.sessionStorage.getItem(ACTIVE_SLOT_KEY)
  const parsed = raw ? Number.parseInt(raw, 10) : 0

  if (!Number.isFinite(parsed) || parsed < 0 || parsed >= SAVE_SLOT_COUNT) {
    return 0
  }

  return parsed
}

export function setActiveSlotId(slotId: number): void {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(ACTIVE_SLOT_KEY, String(slotId))
}

export async function saveCurrentGameState(
  slotId: number,
  data: Omit<SaveSlot, 'slotId' | 'savedAt'>,
): Promise<void> {
  await writeSaveSlot({
    slotId,
    ...data,
    savedAt: Date.now(),
  })
}
