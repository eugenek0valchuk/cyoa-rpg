import type { NpcChoiceReply } from '@/locales/ru/npc/dialogue'
import {
  resolveNpcChoiceReply,
  getNpcEncounterDef,
  resolveNpcEncounterLines,
} from '@/locales/ru/npcEncounters'

export type NpcDialogueTurn = {
  speaker: 'npc' | 'player'
  text: string
}

export function buildNpcReplyTurns(reply: NpcChoiceReply): NpcDialogueTurn[] {
  const turns: NpcDialogueTurn[] = []

  if (reply.player) {
    turns.push({ speaker: 'player', text: reply.player })
  }

  for (const line of reply.npc) {
    turns.push({ speaker: 'npc', text: line })
  }

  if (reply.epilogue) {
    for (const line of reply.epilogue) {
      turns.push({ speaker: 'npc', text: line })
    }
  }

  return turns
}

export function getChoiceReplyForScene(
  sceneId: string,
  choiceId: string,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
): NpcChoiceReply | null {
  return resolveNpcChoiceReply(
    sceneId,
    choiceId,
    journalEntries,
    visitedSceneIds,
  )
}

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
