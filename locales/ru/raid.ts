import type { RaidModifierId } from '@/lib/game/raidModifiers'
import type { RaidZone } from '@/lib/game/zones'

export const raidUi = {
  zoneLabel: 'Зона',
  modifierLabel: 'Проклятие спуска',
  prepareTitle: 'Брифинг спуска',
  prepareSubtitle: 'Порог открыт — машина уже считает твой путь',
  prepareSubtitleFirst: 'Порог открыт',
  prepareRulesTitle: 'Правила извлечения',
  prepareVesselTitle: 'Сосуд',
  prepareLoadoutTitle: 'Снаряжение',
  prepareSanity: 'Рассудок на старте',
  prepareModifierRoll: 'Перебросить',
  prepareModifierRollFree: 'Бесплатный переброс',
  prepareModifierRollEcho: 'Перебросить ({cost} эхо)',
  prepareEcho: 'Эхо камеры',
  prepareMarkEffects: 'Следы влияют на спуск',
  prepareStartSanity: 'Рассудок после следов',
  prepareLoadoutSlots: 'Слоты снаряжения',
  prepareLowSanityWarn:
    'После следов рассудок на старте будет {sanity}. Отдохни в камере или сними пятно обетом — иначе обвал близко.',
  extractInScene: 'Отступить с добычей',
  extractInSceneHint: 'Путь назад открыт — можно выбраться отсюда',
  extractBlockedInSceneHint: 'Ты на точке выхода, но условия ещё не выполнены',
  emergencyExtractBanner:
    'Путь назад закрыт. Один аварийный выход за спуск — ценой части добычи и рассудка.',
  mapTitle: 'Схема спуска',
  mapHint:
    'Узлы, где ты уже был. Соседний посещённый узел — шаг назад без новой сцены.',
  mapBack: 'Шаг назад',
  mapExit: 'Выход',
  mapNavigateConfirm: 'Вернуться на «{place}»? Глубина спуска уменьшится.',
  mapNavigate: 'Шагнуть назад',
  mapNavigateCancel: 'Остаться',
  loadingScene: 'Машина переписывает хронику…',
  zones: {
    surface: 'Поверхность',
    depth: 'Глубина',
    fracture: 'Трещина',
    collapse: 'Обвал',
  } satisfies Record<RaidZone, string>,
  zoneHints: {
    surface: 'Ещё слышен ветер снаружи. Выход ближе, чем кажется.',
    depth: 'Камень давит со всех сторон. Точки выхода редки.',
    fracture: 'Реальность тонкая. Скверна слышит каждый шаг.',
    collapse: 'Граница рвётся. Остаться здесь — значит исчезнуть.',
  } satisfies Record<RaidZone, string>,
} as const

export const raidModifierNames: Record<RaidModifierId, string> = {
  muted_bells: 'Глухие колокола',
  blood_mist: 'Кровавый туман',
  hollow_wind: 'Пустой ветер',
}
