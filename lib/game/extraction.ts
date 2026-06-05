import { MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
import type { RaidState } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

/** Флаг «ключа» — позволяет отступить с поверхностных локаций. */
export const RETURN_SIGIL_FLAG = 'return_sigil'

/** Места, где можно выбраться без печати. */
export const EXTRACTION_SITES = new Set([
  'exit_monastery',
  'ash_path',
  'drain_water',
])

/** Дополнительные точки выхода при наличии печати возврата. */
export const SIGIL_EXTRACTION_SITES = new Set([
  'leave_cart',
  'mouth',
  'merchant',
  'start',
])

export type ExitSiteCondition =
  | { kind: 'min_depth'; value: number }
  | { kind: 'min_sanity'; value: number }
  | { kind: 'max_corruption'; value: number }
  | { kind: 'flag'; value: string }

/**
 * Условия извлечения на конкретной точке выхода.
 * Глобальный MIN_EXTRACT_DEPTH по-прежнему обязателен для всех.
 */
export const EXIT_SITE_CONDITIONS: Partial<
  Record<string, ExitSiteCondition[]>
> = {
  /** Двор: нужен рассудок, чтобы добежать до камеры. */
  exit_monastery: [{ kind: 'min_sanity', value: 15 }],
  /** Пепельная галерея: только после осмысленного спуска. */
  ash_path: [{ kind: 'min_depth', value: 3 }],
  /** Сток: глубокий физический выход. */
  drain_water: [
    { kind: 'min_depth', value: 4 },
    { kind: 'min_sanity', value: 12 },
  ],
  /** Уста тянут вниз — печать не спасает с пустой головой. */
  mouth: [{ kind: 'min_sanity', value: 18 }],
  /** Телега: Бездыханный отпускает только знакомых. */
  merchant: [{ kind: 'flag', value: 'met_breathless' }],
  /** Дорога с печатью: скверна не должна разорвать путь. */
  start: [{ kind: 'max_corruption', value: 70 }],
  leave_cart: [{ kind: 'min_sanity', value: 14 }],
}

export type ExtractBlockReason =
  | 'available'
  | 'need_depth'
  | 'need_exit_site'
  | 'need_sigil_site'
  | 'need_sanity'
  | 'need_site_depth'
  | 'need_flag'
  | 'too_corrupt'

export function isAtExtractionSite(
  sceneId: string | undefined,
  flags: string[],
): boolean {
  if (!sceneId) {
    return false
  }

  if (EXTRACTION_SITES.has(sceneId)) {
    return true
  }

  return (
    flags.includes(RETURN_SIGIL_FLAG) && SIGIL_EXTRACTION_SITES.has(sceneId)
  )
}

function evaluateSiteConditions(
  sceneId: string,
  raid: RaidState,
  character: Character,
): ExtractBlockReason | 'available' {
  const conditions = EXIT_SITE_CONDITIONS[sceneId]

  if (!conditions?.length) {
    return 'available'
  }

  for (const condition of conditions) {
    switch (condition.kind) {
      case 'min_depth':
        if (raid.depth < condition.value) {
          return 'need_site_depth'
        }
        break
      case 'min_sanity':
        if (character.sanity < condition.value) {
          return 'need_sanity'
        }
        break
      case 'max_corruption':
        if (character.corruption > condition.value) {
          return 'too_corrupt'
        }
        break
      case 'flag':
        if (!character.flags.includes(condition.value)) {
          return 'need_flag'
        }
        break
    }
  }

  return 'available'
}

export function canExtractRaid(
  raid: RaidState | null,
  flags: string[],
  sceneId: string | undefined,
  character?: Character | null,
): boolean {
  return (
    getExtractBlockReason(raid, flags, sceneId, character) === 'available'
  )
}

export function getExtractBlockReason(
  raid: RaidState | null,
  flags: string[],
  sceneId: string | undefined,
  character?: Character | null,
): ExtractBlockReason {
  if (!raid?.active || !sceneId) {
    return flags.includes(RETURN_SIGIL_FLAG)
      ? 'need_sigil_site'
      : 'need_exit_site'
  }

  if (raid.depth < MIN_EXTRACT_DEPTH) {
    return 'need_depth'
  }

  const hasSigil = flags.includes(RETURN_SIGIL_FLAG)
  const onDedicatedExit = EXTRACTION_SITES.has(sceneId)
  const onSigilExit = hasSigil && SIGIL_EXTRACTION_SITES.has(sceneId)

  if (!onDedicatedExit && !onSigilExit) {
    return hasSigil ? 'need_sigil_site' : 'need_exit_site'
  }

  if (!character) {
    return 'available'
  }

  const siteCheck = evaluateSiteConditions(sceneId, raid, character)

  return siteCheck === 'available' ? 'available' : siteCheck
}

export function getExitSiteConditionValues(
  sceneId: string,
): ExitSiteCondition[] {
  return EXIT_SITE_CONDITIONS[sceneId] ?? []
}

export function hasReturnSigil(flags: string[]): boolean {
  return flags.includes(RETURN_SIGIL_FLAG)
}

export type EmergencyExtractBlockReason =
  | 'available'
  | 'already_used'
  | 'too_shallow'
  | 'exit_available'
  | 'inactive'

export function getEmergencyExtractBlockReason(
  raid: RaidState | null,
  extractBlockReason: ExtractBlockReason,
): EmergencyExtractBlockReason {
  if (!raid?.active) {
    return 'inactive'
  }

  if (raid.emergencyExtractUsed) {
    return 'already_used'
  }

  if (raid.depth < MIN_EXTRACT_DEPTH || extractBlockReason === 'need_depth') {
    return 'too_shallow'
  }

  if (extractBlockReason === 'available') {
    return 'exit_available'
  }

  return 'available'
}

export function canEmergencyExtractRaid(
  raid: RaidState | null,
  extractBlockReason: ExtractBlockReason,
): boolean {
  return (
    getEmergencyExtractBlockReason(raid, extractBlockReason) === 'available'
  )
}
