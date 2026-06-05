import type { RaidModifierId } from '@/lib/game/raidModifiers'
import type { RaidZone } from '@/lib/game/zones'

export const raidUi = {
  zoneLabel: 'Зона',
  modifierLabel: 'Проклятие спуска',
  prepareTitle: 'Брифинг спуска',
  prepareSubtitle: 'Порог открыт — машина уже считает твой путь',
  prepareRulesTitle: 'Правила извлечения',
  prepareVesselTitle: 'Сосуд',
  prepareLoadoutTitle: 'Снаряжение',
  prepareSanity: 'Рассудок на старте',
  prepareModifierRoll: 'Перебросить',
  extractInScene: 'Отступить с добычей',
  extractInSceneHint: 'Путь назад открыт — можно выбраться отсюда',
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
