import { prologueUi } from '@/locales/ru/prologue'
import { getRaidModifier, type RaidModifierId } from '@/lib/game/raidModifiers'

export type PrologueSlide = {
  id: string
  title: string
  body: string
  imageSrc?: string
  imageAlt?: string
}

/** Короткий пролог в рейде — только то, чего нет на Пороге (крупная картинка проклятия). */
export function buildPrologueSlides(options: {
  modifierId: RaidModifierId | null
}): PrologueSlide[] {
  const modifier = getRaidModifier(options.modifierId)

  if (!modifier) {
    return []
  }

  return [
    {
      id: `modifier_${modifier.id}`,
      title: modifier.name,
      body: `${prologueUi.modifierIntro} ${modifier.description} ${modifier.hint}`,
      imageSrc: `/ui/gothic-cursed-rosary.png`,
      imageAlt: modifier.name,
    },
  ]
}
