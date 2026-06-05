import { contractById } from '@/locales/ru/contracts'
import { prologueUi } from '@/locales/ru/prologue'
import { getRaidModifier, type RaidModifierId } from '@/lib/game/raidModifiers'
import type { Origin } from '@/lib/types/game'

export type PrologueSlide = {
  id: string
  title: string
  body: string
  imageSrc?: string
  imageAlt?: string
}

export function buildPrologueSlides(options: {
  origin: Origin
  roomImage: string
  modifierId: RaidModifierId | null
  contractId: string | null
  isFirstRaid: boolean
}): PrologueSlide[] {
  const slides: PrologueSlide[] = []
  const modifier = getRaidModifier(options.modifierId)

  if (options.isFirstRaid) {
    slides.push({
      id: 'chamber',
      title: prologueUi.chamberTitle,
      body: prologueUi.chamberBody,
      imageSrc: options.roomImage,
      imageAlt: 'Камера',
    })
  }

  if (modifier) {
    slides.push({
      id: `modifier_${modifier.id}`,
      title: modifier.name,
      body: `${modifier.description} ${modifier.hint}`,
      imageSrc: `/ui/gothic-cursed-rosary.png`,
      imageAlt: modifier.name,
    })
  }

  const contract = options.contractId
    ? contractById[options.contractId]
    : null

  slides.push({
    id: 'contract',
    title: prologueUi.contractTitle,
    body: contract
      ? `${prologueUi.contractBody} «${contract.title}»: ${contract.vow}`
      : prologueUi.contractBodyNone,
    imageSrc: '/ui/gothic-intelligence.png',
    imageAlt: 'Обет',
  })

  if (options.isFirstRaid) {
    slides.push({
      id: 'road',
      title: prologueUi.roadTitle,
      body: prologueUi.roadBody,
      imageSrc: '/rooms/witness-chamber.png',
      imageAlt: 'Дорога',
    })
  }

  return slides
}
