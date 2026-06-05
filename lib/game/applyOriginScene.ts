import { originSceneVariants } from '@/locales/ru/scenes/originVariants'

import { isChoiceVisible } from './choiceVisibility'

import type { Character, Choice, Scene } from '../types/game'

function filterVisibleOptions(
  options: Choice[],
  character: Character,
  journalEntries: string[] = [],
): Choice[] {
  return options.filter((option) =>
    isChoiceVisible(option, character, journalEntries),
  )
}

export function applyOriginToScene(
  scene: Scene,
  character: Character,
  journalEntries: string[] = [],
): Scene {
  const variant = originSceneVariants[scene.id]?.[character.origin]

  if (!variant) {
    return {
      ...scene,
      options: filterVisibleOptions(scene.options, character, journalEntries),
    }
  }

  let description = variant.description ?? scene.description

  if (variant.prependDescription) {
    description = `${variant.prependDescription.trim()}\n\n${description.trim()}`
  }

  if (variant.appendDescription) {
    description = `${description.trim()}\n\n${variant.appendDescription.trim()}`
  }

  let options = scene.options.map((option) => {
    const textOverride = variant.optionText?.[option.id]

    if (!textOverride) {
      return { ...option }
    }

    return { ...option, text: textOverride }
  })

  if (variant.removeOptionIds?.length) {
    const remove = new Set(variant.removeOptionIds)
    options = options.filter((option) => !remove.has(option.id))
  }

  if (variant.addOptions?.length) {
    const existingIds = new Set(options.map((option) => option.id))
    const added = variant.addOptions
      .filter((option) => !existingIds.has(option.id))
      .map((option) => ({ ...option }))
    options = [...options, ...added]
  }

  return {
    ...scene,
    title: variant.title ?? scene.title,
    description,
    options: filterVisibleOptions(options, character, journalEntries),
  }
}
