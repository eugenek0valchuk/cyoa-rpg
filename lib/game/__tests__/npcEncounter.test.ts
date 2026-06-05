import { describe, expect, it } from 'vitest'

import {
  buildNpcEncounterDialogue,
  buildNpcReplyTurns,
  getChoiceReplyForScene,
  isNpcEncounterScene,
} from '../npcEncounter'

describe('npcEncounter', () => {
  it('recognizes npc dialogue scenes', () => {
    expect(isNpcEncounterScene('merchant')).toBe(true)
    expect(isNpcEncounterScene('encounter_wax_pilgrim')).toBe(true)
    expect(isNpcEncounterScene('encounter_synod_acolyte')).toBe(true)
    expect(isNpcEncounterScene('encounter_procession_herald')).toBe(true)
    expect(isNpcEncounterScene('encounter_ash_weaver')).toBe(true)
    expect(isNpcEncounterScene('encounter_mirror_nun')).toBe(true)
    expect(isNpcEncounterScene('encounter_iron_keeper')).toBe(true)
    expect(isNpcEncounterScene('encounter_vein_prophet')).toBe(true)
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

  it('returns wax reunion lines from hub journal', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_wax_pilgrim',
      ['npc_wax'],
      new Set(),
    )

    expect(dialogue.lines[0]).toContain('Маска та же')
  })

  it('returns wax same-run lines when revisiting in one raid', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_wax_pilgrim',
      [],
      new Set(['encounter_wax_pilgrim']),
    )

    expect(dialogue.lines[0]).toContain('Паломник не отступает')
  })

  it('returns bell wretch first lines by default', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_bell_wretch',
      [],
      new Set(),
    )

    expect(dialogue.def?.npcName).toBe('Колокольный урод')
    expect(dialogue.lines[0]).toContain('медью')
  })

  it('registers follow-up scenes as npc encounters', () => {
    expect(isNpcEncounterScene('encounter_wax_pull_away')).toBe(true)
    expect(isNpcEncounterScene('encounter_synod_marked')).toBe(true)
  })

  it('returns choice reply with player and npc lines', () => {
    const reply = getChoiceReplyForScene(
      'encounter_wax_pilgrim',
      'mouth',
      [],
      new Set(),
    )

    expect(reply?.player).toContain('пульс')
    expect(reply?.npc.length).toBeGreaterThan(2)
    expect(reply?.epilogue?.length).toBeGreaterThan(0)

    const turns = buildNpcReplyTurns(reply!)
    expect(turns[0]?.speaker).toBe('player')
    expect(turns[1]?.speaker).toBe('npc')
  })

  it('returns reunion reply when journal remembers npc', () => {
    const reply = getChoiceReplyForScene(
      'encounter_wax_pilgrim',
      'mouth',
      ['npc_wax'],
      new Set(),
    )

    expect(reply?.player).toContain('Снова')
  })

  it('registers take_mask as npc dialogue scene', () => {
    expect(isNpcEncounterScene('take_mask')).toBe(true)

    const dialogue = buildNpcEncounterDialogue('take_mask', [], new Set())

    expect(dialogue.lines.length).toBeGreaterThan(2)
  })

  it('uses opening dialogue on follow-up scenes', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_wax_pull_away',
      [],
      new Set(),
    )

    expect(dialogue.lines[0]).toContain('Паломник')
  })

  it('returns heretic cog art path', () => {
    const dialogue = buildNpcEncounterDialogue(
      'encounter_heretic_cog',
      [],
      new Set(),
    )

    expect(dialogue.def?.imageSrc).toBe('/encounters/npc-heretic-cog.png')
  })

  it('registers heretic cog risk-fail follow-up', () => {
    expect(isNpcEncounterScene('encounter_heretic_fail_cog')).toBe(true)

    const dialogue = buildNpcEncounterDialogue(
      'encounter_heretic_fail_cog',
      [],
      new Set(),
    )

    expect(dialogue.def?.baseSceneId).toBe('encounter_heretic_cog')
    expect(dialogue.lines[0]).toContain('режут')
  })
})
