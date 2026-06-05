import { MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
import type { RaidState } from '@/lib/types/hub'

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

export type ExtractBlockReason =
  | 'available'
  | 'need_depth'
  | 'need_exit_site'
  | 'need_sigil_site'

export function canExtractRaid(
  raid: RaidState | null,
  flags: string[],
  sceneId: string | undefined,
): boolean {
  return getExtractBlockReason(raid, flags, sceneId) === 'available'
}

export function getExtractBlockReason(
  raid: RaidState | null,
  flags: string[],
  sceneId: string | undefined,
): ExtractBlockReason {
  if (!raid?.active || !sceneId) {
    return flags.includes(RETURN_SIGIL_FLAG)
      ? 'need_sigil_site'
      : 'need_exit_site'
  }

  if (raid.depth < MIN_EXTRACT_DEPTH) {
    return 'need_depth'
  }

  if (EXTRACTION_SITES.has(sceneId)) {
    return 'available'
  }

  if (
    flags.includes(RETURN_SIGIL_FLAG) &&
    SIGIL_EXTRACTION_SITES.has(sceneId)
  ) {
    return 'available'
  }

  return flags.includes(RETURN_SIGIL_FLAG)
    ? 'need_sigil_site'
    : 'need_exit_site'
}

export function hasReturnSigil(flags: string[]): boolean {
  return flags.includes(RETURN_SIGIL_FLAG)
}
