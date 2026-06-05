import { describe, expect, it } from 'vitest'

import { resolveAmbientTense } from '../AmbientController'

describe('resolveAmbientTense', () => {
  it('is calm by default', () => {
    expect(resolveAmbientTense({ sanity: 80 })).toBe(false)
  })

  it('tenses on low sanity', () => {
    expect(resolveAmbientTense({ sanity: 18 })).toBe(true)
  })

  it('tenses on key choice and npc dialogue', () => {
    expect(resolveAmbientTense({ keyChoicePending: true })).toBe(true)
    expect(resolveAmbientTense({ npcOpen: true })).toBe(true)
  })

  it('tenses on threshold and failure stain in hub', () => {
    expect(resolveAmbientTense({ thresholdOpen: true })).toBe(true)
    expect(resolveAmbientTense({ failureStain: true })).toBe(true)
  })
})
