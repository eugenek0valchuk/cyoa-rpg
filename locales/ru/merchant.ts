export type HubMerchantOfferKind =
  | 'stash_artifact'
  | 'journal_entry'
  | 'remove_mark'
  | 'sanity_bonus'

export type HubMerchantOfferDef = {
  id: string
  title: string
  description: string
  cost: number
  kind: HubMerchantOfferKind
  artifactId?: string
  journalId?: string
  markId?: string
  sanityBonus?: number
  requiresJournal?: string
  requiresMark?: string
  once?: boolean
}

export const merchantUi = {
  title: 'Телега Бездыханного',
  subtitle: 'Плати эхом — или слухами, которые камера уже записала',
  lockedTitle: 'Телега в тумане',
  lockedBody:
    'Бездыханный откроет лавку после первой встречи на дороге — или когда камера запомнит его в журнале.',
  npcName: 'Бездыханный',
  npcTitle: 'Купец у телеги',
  shopTitle: 'Товар',
  close: 'Закрыть',
  lineDefault: 'Плати зубами — или слухами. Синод всегда помнит.',
  lineReturn: 'Телега ещё тёплая от твоего шага. Эхо честнее зубов.',
  lineRepeat: 'Синод не смотрит сюда. Пока. Выбирай — я не дышу, пока смотришь.',
  lineStain: 'Пятно на стене пахнет провалом. Могу помочь смыло — не подарком.',
  lineRich: 'Камера полна эха. Хороший знак — или приглашение спуститься снова.',
  echoLabel: 'Эхо',
  buy: 'Купить',
  owned: 'Уже есть',
  unavailable: 'Недоступно',
  purchased: 'Куплено',
  notEnoughEcho: 'Не хватает эха',
  purchaseDone: 'Сделка закрыта',
} as const

export const hubMerchantOffers: HubMerchantOfferDef[] = [
  {
    id: 'offer_candle',
    title: 'Свеча из телеги',
    description:
      'Холодное пламя, снятое с паломника, который ещё не понял, что остановился. В сокровищницу — на следующий спуск.',
    cost: 3,
    kind: 'stash_artifact',
    artifactId: 'buried_choir_candle',
    once: true,
  },
  {
    id: 'offer_synod_rumor',
    title: 'Слух Синода',
    description:
      'Бездыханный шепчет то, что адепт сказал бы за sanity. Запись о Синоде появится в журнале — если её ещё нет.',
    cost: 2,
    kind: 'journal_entry',
    journalId: 'npc_synod',
    requiresJournal: 'npc_breathless',
    once: true,
  },
  {
    id: 'offer_cleanse_stain',
    title: 'Смыть пятно провала',
    description:
      'Тёплая вода из-под трупов. След failure_stain исчезнет со стены камеры.',
    cost: 5,
    kind: 'remove_mark',
    markId: 'failure_stain',
    requiresMark: 'failure_stain',
    once: true,
  },
  {
    id: 'offer_sanity_balm',
    title: 'Настойка тишины',
    description:
      '+5 рассудка на старте следующего спуска. Одна склянка — один раз.',
    cost: 2,
    kind: 'sanity_bonus',
    sanityBonus: 5,
    once: true,
  },
]
