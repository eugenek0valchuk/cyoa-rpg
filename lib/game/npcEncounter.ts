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
