import { describe, it, expect } from 'vitest'

import { applyChoiceEffects } from '../applyChoiceEffects'
import { resolveDirectedScene } from '../sceneDirector'
import { getEnding } from '../endings'
import { buildDirectorState } from '../director'
import { isChoiceVisible } from '../choiceVisibility'
import { t } from '@/lib/i18n'
import type { Character, SceneHistoryEntry } from '@/lib/types/game'

const artifacts = t.artifacts

function makeHeretic(overrides: Partial<Character> = {}): Character {
  return {
    name: 'Heretic',
    origin: 'heretic',
    stats: { strength: 3, agility: 4, intelligence: 8 },
    inventory: [],
    sanity: 40,
    corruption: 50,
    flags: [],
    ...overrides,
  }
}

describe('raid path simulation', () => {
  it('simulates start → mouth → descent with scene history growth', () => {
    const character = makeHeretic()
    const history: SceneHistoryEntry[] = []
    const start = t.scenes.start
    const mouthChoice = start.options.find((option) => option.id === 'mouth')!

    const mouthScene = resolveDirectedScene(start, mouthChoice, character, history)
    expect(mouthScene.id).toBe('mouth')

    history.push({
      id: start.id,
      title: start.title,
      description: start.description,
    })

    const descentChoice = mouthScene.options[0]!
    const descentScene = resolveDirectedScene(
      mouthScene,
      descentChoice,
      character,
      history,
    )

    expect(descentScene.id).toBe('descent')
    expect(history).toHaveLength(1)
  })

  it('synod flag boosts synod encounter in merchant pool on revisit', () => {
    const character = makeHeretic({ flags: ['synod_mark'] })
    const history: SceneHistoryEntry[] = [
      {
        id: 'merchant',
        title: t.scenes.merchant.title,
        description: 'seen',
      },
    ]

    const merchantChoice = t.scenes.descent_echoes.options.find(
      (option) => option.id === 'merchant',
    )!

    const next = resolveDirectedScene(
      t.scenes.descent_echoes,
      merchantChoice,
      character,
      history,
    )

    expect(next.id).toBe('encounter_synod_acolyte')
  })

  it('choir_split opens third voice in fracture choir', () => {
    const character = makeHeretic({ flags: ['choir_split'] })
    const scene = t.scenes.fracture_choir
    const third = scene.options.find((option) => option.id === 'whispers_mirror')

    expect(third).toBeDefined()
    expect(isChoiceVisible(third!, character)).toBe(true)
  })

  it('journal memory opens merchant recall path across raids', () => {
    const character = makeHeretic()
    const recall = t.scenes.merchant.options.find(
      (option) => option.id === 'recall_synod',
    )!

    expect(isChoiceVisible(recall!, character, [])).toBe(false)
    expect(isChoiceVisible(recall!, character, ['npc_breathless'])).toBe(true)
  })

  it('heretic lexicon ending at high corruption with writings flag', () => {
    const character = makeHeretic({
      corruption: 85,
      flags: ['read_the_writings'],
    })
    const director = buildDirectorState(character, Array.from({ length: 6 }, (_, i) => ({
      id: `s${i}`,
      title: `S${i}`,
      description: 'd',
    })))

    const ending = getEnding(character, {
      historyLength: 6,
      phase: director.phase,
      forceEnding: director.forceEnding,
    })

    expect(ending?.id).toBe('heretic_lexicon')
  })

  it('carving sigil applies flag through choice effects', () => {
    const character = makeHeretic({ stats: { strength: 3, agility: 4, intelligence: 8 } })
    const choice = t.scenes.read_writings.options.find(
      (option) => option.id === 'carve_return_sigil',
    )!

    const { updatedCharacter } = applyChoiceEffects({
      character,
      choice: choice!,
      artifacts,
    })

    expect(updatedCharacter.flags).toContain('return_sigil')
  })

  it('collapse ending triggers at low sanity in collapse phase', () => {
    const character = makeHeretic({ sanity: 9, corruption: 83 })
    const director = buildDirectorState(character, Array.from({ length: 4 }, (_, i) => ({
      id: `s${i}`,
      title: `S${i}`,
      description: 'd',
    })))

    const ending = getEnding(character, {
      historyLength: 4,
      phase: director.phase,
      forceEnding: director.forceEnding,
    })

    expect(ending?.id).toBe('reality_collapse')
  })
})

describe('scene option integrity', () => {
  it('every scene has unique option ids', () => {
    for (const scene of Object.values(t.scenes)) {
      const ids = scene.options.map((option) => option.id)
      expect(new Set(ids).size, scene.id).toBe(ids.length)
    }
  })
})
