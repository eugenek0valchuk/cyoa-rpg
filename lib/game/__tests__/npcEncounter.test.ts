import { describe, expect, it } from 'vitest'

import {
  buildNpcEncounterDialogue,
  isNpcEncounterScene,
} from '../npcEncounter'

describe('npcEncounter', () => {
  it('recognizes npc dialogue scenes', () => {
    expect(isNpcEncounterScene('merchant')).toBe(true)
    expect(isNpcEncounterScene('encounter_wax_pilgrim')).toBe(true)
    expect(isNpcEncounterScene('encounter_synod_acolyte')).toBe(true)
    expect(isNpcEncounterScene('mouth')).toBe(false)
    expect(isNpcEncounterScene('descent_echoes')).toBe(false)
  })

  it('returns merchant first-meeting lines', () => {
    const dialogue = buildNpcEncounterDialogue('merchant', [], new Set())

    expect(dialogue.def?.npcName).toBe('Бездыханный')
    expect(dialogue.lines.length).toBeGreaterThan(0)
  })

  it('returns reunion lines when journal remembers npc', () => {
    const dialogue = buildNpcEncounterDialogue(
      'merchant',
      ['npc_breathless'],
      new Set(),
    )

    expect(dialogue.lines[0]).toContain('Снова ты')
  })

  it('returns wax pilgrim scene art path', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_wax_pilgrim',
      [],
      new Set(),
    )

    expect(dialogue.def?.imageSrc).toBe('/encounters/npc-wax-pilgrim.png')
  })
})
