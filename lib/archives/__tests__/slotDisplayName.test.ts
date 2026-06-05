import { describe, expect, it } from 'vitest'

import { getSlotDisplayName } from '../slotDisplayName'

describe('getSlotDisplayName', () => {
  const empty = 'Пустой сосуд'
  const unnamed = 'Безымянный сосуд'

  it('returns empty label when no character', () => {
    expect(getSlotDisplayName(undefined, empty, unnamed)).toBe(empty)
  })

  it('returns trimmed name when present', () => {
    expect(
      getSlotDisplayName(
        { name: '  Тест  ' } as Parameters<typeof getSlotDisplayName>[0],
        empty,
        unnamed,
      ),
    ).toBe('Тест')
  })

  it('falls back when name is missing or blank', () => {
    expect(
      getSlotDisplayName(
        { name: undefined } as unknown as Parameters<typeof getSlotDisplayName>[0],
        empty,
        unnamed,
      ),
    ).toBe(unnamed)
    expect(
      getSlotDisplayName({ name: '   ' } as Parameters<typeof getSlotDisplayName>[0], empty, unnamed),
    ).toBe(unnamed)
  })
})
