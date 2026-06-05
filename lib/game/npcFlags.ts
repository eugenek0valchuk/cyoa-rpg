/** Флаги персонажа, которые считаются «долгом NPC» в этом спуске. */
export const RUN_NPC_FLAG_IDS = [
  'met_breathless',
  'synod_mark',
  'wax_offered',
  'choir_split',
  'met_heretic_cog',
  'heretic_answered',
  'heard_the_bell',
] as const

export type RunNpcFlagId = (typeof RUN_NPC_FLAG_IDS)[number]

const RUN_NPC_FLAG_SET = new Set<string>(RUN_NPC_FLAG_IDS)

export function isRunNpcFlag(flag: string): flag is RunNpcFlagId {
  return RUN_NPC_FLAG_SET.has(flag)
}

export function collectNewNpcFlags(
  flagsBefore: string[],
  flagsAfter: string[],
  existing: string[] = [],
): string[] {
  const before = new Set(flagsBefore)
  const known = new Set(existing)
  const gained: string[] = []

  for (const flag of flagsAfter) {
    if (
      isRunNpcFlag(flag) &&
      !before.has(flag) &&
      !known.has(flag) &&
      !gained.includes(flag)
    ) {
      gained.push(flag)
    }
  }

  return gained
}
