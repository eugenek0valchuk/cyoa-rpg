import { describe, it, expect, vi, beforeEach } from 'vitest'

const saveMock = vi.fn()

vi.mock('@/lib/persistence/saveStorage', () => ({
  getActiveSlotId: () => 0,
  saveCurrentGameState: (...args: unknown[]) => saveMock(...args),
  deleteSaveSlot: vi.fn(),
}))

vi.mock('@/lib/store/characterStore', () => ({
  useCharacterStore: {
    getState: () => ({
      character: { name: 'Test', origin: 'hollow' },
      resetCharacter: vi.fn(),
    }),
  },
}))

vi.mock('@/lib/store/gameStore', () => ({
  useGameStore: {
    getState: () => ({
      currentScene: null,
      history: [],
      sceneHistory: [],
      resetGame: vi.fn(),
    }),
  },
}))

vi.mock('@/lib/store/hubStore', () => ({
  useHubStore: {
    getState: () => ({
      hub: { stash: [] },
      raid: null,
      resetHub: vi.fn(),
    }),
  },
}))

describe('exitToMainMenu', () => {
  beforeEach(() => {
    saveMock.mockClear()
  })

  it('saves progress instead of deleting the slot', async () => {
    const { exitToMainMenu } = await import('@/hooks/useAutoSave')
    const { deleteSaveSlot } = await import('@/lib/persistence/saveStorage')

    await exitToMainMenu()

    expect(saveMock).toHaveBeenCalledTimes(1)
    expect(deleteSaveSlot).not.toHaveBeenCalled()
  })
})
