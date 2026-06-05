import { repeatSceneVariants } from '@/locales/ru/scenes/repeatVariants'

import { isChoiceVisible } from './choiceVisibility'

import type { Character, Choice, Scene } from '../types/game'
import type { OriginSceneVariant } from '@/locales/ru/scenes/originVariants'

export interface RepeatSceneContext {
  character: Character
  journalEntries: string[]
  visitedSceneIds: Set<string>
}

function filterVisibleOptions(
  options: Choice[],
  character: Character,
  journalEntries: string[],
): Choice[] {
  return options.filter((option) =>
    isChoiceVisible(option, character, journalEntries),
  )
}

function applyVariant(
  scene: Scene,
  variant: OriginSceneVariant,
  character: Character,
  journalEntries: string[],
): Scene {
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

export function applyRepeatToScene(
  scene: Scene,
  context: RepeatSceneContext,
): Scene {
  const config = repeatSceneVariants[scene.id]

  if (!config) {
    return scene
  }

  const remembered = context.journalEntries.includes(config.journalId)
  const revisited = context.visitedSceneIds.has(scene.id)

  if (!remembered && !revisited) {
    return scene
  }

  if (remembered) {
    return applyVariant(
      scene,
      config.variant,
      context.character,
      context.journalEntries,
    )
  }

  if (config.sameRun) {
    return applyVariant(
      scene,
      config.sameRun,
      context.character,
      context.journalEntries,
    )
  }

  return scene
}
