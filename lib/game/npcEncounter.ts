import {
  getNpcEncounterDef,
  resolveNpcEncounterLines,
} from '@/locales/ru/npcEncounters'

export function isNpcEncounterScene(sceneId: string): boolean {
  return getNpcEncounterDef(sceneId) != null
}

export function buildNpcEncounterDialogue(
  sceneId: string,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
) {
  const def = getNpcEncounterDef(sceneId)

  return {
    def,
    lines: resolveNpcEncounterLines(sceneId, journalEntries, visitedSceneIds),
  }
}

export function getNpcMeetingFlag(sceneId: string): string | null {
  return getNpcEncounterDef(sceneId)?.meetingFlag ?? null
}

/** @deprecated use isNpcEncounterScene */
export const isBreathlessEncounterScene = isNpcEncounterScene

/** @deprecated use buildNpcEncounterDialogue */
export function buildBreathlessEncounterDialogue(
  sceneId: string,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
) {
  const { lines } = buildNpcEncounterDialogue(
    sceneId,
    journalEntries,
    visitedSceneIds,
  )

  return { mode: 'first' as const, lines }
}
