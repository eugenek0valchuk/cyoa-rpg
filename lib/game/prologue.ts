import { contractById } from '@/locales/ru/contracts'
import { prologueUi } from '@/locales/ru/prologue'
import { getRaidModifier, type RaidModifierId } from '@/lib/game/raidModifiers'

export type PrologueSlide = {
  id: string
  title: string
  body: string
  imageSrc?: string
  imageAlt?: string
}

/** Короткий пролог в рейде — камера, дорога, обет, проклятие спуска. */
export function buildPrologueSlides(options: {
  modifierId: RaidModifierId | null
  contractId?: string | null
}): PrologueSlide[] {
  const slides: PrologueSlide[] = [
    {
      id: 'chamber',
      title: prologueUi.chamberTitle,
      body: prologueUi.chamberBody,
      imageSrc: '/rooms/hollow-chamber.png',
      imageAlt: prologueUi.chamberTitle,
    },
    {
      id: 'road',
      title: prologueUi.roadTitle,
      body: prologueUi.roadBody,
      imageSrc: '/hub/merchant-cart-scene.png',
      imageAlt: prologueUi.roadTitle,
    },
  ]

  const contract = options.contractId
    ? contractById[options.contractId]
    : undefined

  if (contract) {
    slides.push({
      id: `contract_${contract.id}`,
      title: prologueUi.contractTitle,
      body: `${prologueUi.contractBody} **${contract.title}:** ${contract.vow}`,
      imageSrc: '/ui/gothic-blessed-star.png',
      imageAlt: contract.title,
    })
  } else {
    slides.push({
      id: 'contract_none',
      title: prologueUi.contractTitle,
      body: prologueUi.contractBodyNone,
    })
  }

  const modifier = getRaidModifier(options.modifierId)

  if (modifier) {
    slides.push({
      id: `modifier_${modifier.id}`,
      title: modifier.name,
      body: `${prologueUi.modifierIntro} ${modifier.description} ${modifier.hint}`,
      imageSrc: '/ui/gothic-cursed-rosary.png',
      imageAlt: modifier.name,
    })
  }

  return slides
}
