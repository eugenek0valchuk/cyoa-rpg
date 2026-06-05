import type { Artifact, Origin } from '@/lib/types/game'

import { artifacts } from './artifacts'

export const originTitles: Record<Origin, string> = {
  hollow: 'ПУСТОЙ',
  heretic: 'ЕРЕТИК',
  witness: 'СВИДЕТЕЛЬ',
}

/** Имя происхождения в тексте журнала и квестов (не капс). */
export const originDisplayNames: Record<Origin, string> = {
  hollow: 'Пустой',
  heretic: 'Еретик',
  witness: 'Свидетель',
}

export type OriginCard = {
  value: Origin
  title: string
  subtitle: string
  description: string
  image: string
  inventory: Artifact[]
  stats: {
    strength: number
    agility: number
    intelligence: number
  }
}

export const origins: OriginCard[] = [
  {
    value: 'hollow',
    title: 'ПУСТОЙ',
    subtitle: 'Вернулся из бездны без души.',
    description:
      'Когда бездна забрала его, молитвы не были услышаны. То, что вернулось, всё ещё носило доспехи — но под железом остались только голод, тишина и угасающая память забытого имени.',
    image: '/origins/hollow.png',
    inventory: [artifacts.ashen_faceless_mask],
    stats: { strength: 7, agility: 4, intelligence: 4 },
  },
  {
    value: 'heretic',
    title: 'ЕРЕТИК',
    subtitle: 'Говорил с тем, что под собором.',
    description:
      'В закопанном соборе он услышал голос под камнем. Тот предложил откровение в пепле и крови. С той ночи священный огонь отшатывается от его присутствия.',
    image: '/origins/heretic.png',
    inventory: [artifacts.inverted_rosary],
    stats: { strength: 3, agility: 4, intelligence: 8 },
  },
  {
    value: 'witness',
    title: 'СВИДЕТЕЛЬ',
    subtitle: 'Видел конец и пережил память.',
    description:
      'Он стоял перед последним шествием и пережил зрелище. Разум выдержал — но за глазами навсегда исчезло то, что делало взгляд человеческим.',
    image: '/origins/witness.png',
    inventory: [artifacts.drowned_bell_fragment],
    stats: { strength: 4, agility: 8, intelligence: 3 },
  },
]
