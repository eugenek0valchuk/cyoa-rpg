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
  /** Можно купить несколько раз за одну витрину */
  repeatable?: boolean
}

export const merchantUi = {
  title: 'Телега Бездыханного',
  subtitle: 'Плати эхом — товар меняется после каждого спуска',
  lockedTitle: 'Телега в тумане',
  lockedBody:
    'Бездыханный откроет лавку после первой встречи на дороге — или когда камера запомнит его в журнале.',
  npcName: 'Бездыханный',
  npcTitle: 'Купец у телеги',
  shopTitle: 'Товар',
  stockRefreshed: 'Телега сменила товар — выбирай, пока эхо не остыло',
  close: 'Закрыть',
  lineDefault: 'Плати зубами — или слухами. Синод всегда помнит.',
  lineReturn: 'Телега ещё тёплая от твоего шага. Эхо честнее зубов.',
  lineRepeat: 'Синод не смотрит сюда. Пока. Выбирай — я не дышу, пока смотришь.',
  lineStain: 'Пятно на стене пахнет провалом. Могу помочь смыло — не подарком.',
  lineRich: 'Камера полна эха. Хороший знак — или приглашение спуститься снова.',
  lineFreshStock:
    'Товар сменился с прошлого спуска. То, что не купил — ушло в туман.',
  echoLabel: 'Эхо',
  buy: 'Купить',
  owned: 'Уже в сокровищнице',
  unavailable: 'Недоступно',
  purchased: 'Куплено в этой витрине',
  notEnoughEcho: 'Не хватает эха',
  purchaseDone: 'Сделка закрыта',
} as const

export const hubMerchantOffers: HubMerchantOfferDef[] = [
  {
    id: 'offer_candle',
    title: 'Свеча из телеги',
    description:
      'Холодное пламя, снятое с паломника. В сокровищницу — на следующий спуск.',
    cost: 3,
    kind: 'stash_artifact',
    artifactId: 'buried_choir_candle',
  },
  {
    id: 'offer_bell_shard',
    title: 'Осколок из затона',
    description:
      'Кусок утонувшего колокола — Бездыханный поднял его до того, как вода забыла имя.',
    cost: 4,
    kind: 'stash_artifact',
    artifactId: 'drowned_bell_fragment',
    requiresJournal: 'npc_breathless',
  },
  {
    id: 'offer_inverted_rosary',
    title: 'Перевёртыш с телеги',
    description:
      'Чётки с символами внутрь. Еретики платили за них рассудком — ты платишь эхом.',
    cost: 6,
    kind: 'stash_artifact',
    artifactId: 'inverted_rosary',
    requiresJournal: 'npc_breathless',
  },
  {
    id: 'offer_synod_rumor',
    title: 'Слух Синода',
    description:
      'Бездыханный шепчет то, что адепт сказал бы за sanity. Запись о Синоде в журнале.',
    cost: 2,
    kind: 'journal_entry',
    journalId: 'npc_synod',
    requiresJournal: 'npc_breathless',
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
  },
  {
    id: 'offer_sanity_balm',
    title: 'Настойка тишины',
    description: '+5 рассудка на старт следующего спуска. Можно купить несколько — эффект суммируется.',
    cost: 2,
    kind: 'sanity_bonus',
    sanityBonus: 5,
    repeatable: true,
  },
  {
    id: 'offer_deep_balm',
    title: 'Настой глубины',
    description:
      '+8 рассудка на старт спуска. Появляется, когда камера помнит глубокий след.',
    cost: 4,
    kind: 'sanity_bonus',
    sanityBonus: 8,
    repeatable: true,
    requiresMark: 'deep_echo',
  },
  {
    id: 'offer_wax_hint',
    title: 'Слух о воске',
    description:
      'Запись о паломнике в журнале — если ещё не встречал его на дороге.',
    cost: 2,
    kind: 'journal_entry',
    journalId: 'npc_wax',
    requiresJournal: 'npc_breathless',
  },
]
