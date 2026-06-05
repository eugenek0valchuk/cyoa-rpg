import type {
  NpcChoiceReply,
  NpcChoiceReplyEntry,
  NpcOpeningTiered,
} from './types'
import { isTieredReply } from './types'

export function resolveNpcOpeningTiered(
  opening: NpcOpeningTiered,
  journalId: string | undefined,
  journalEntries: string[],
  baseSceneId: string,
  visitedSceneIds: Set<string>,
): string[] {
  if (journalId && journalEntries.includes(journalId) && opening.reunion) {
    return opening.reunion
  }

  if (visitedSceneIds.has(baseSceneId) && opening.sameRun) {
    return opening.sameRun
  }

  return opening.first
}

export function resolveNpcChoiceReplyEntry(
  entry: NpcChoiceReplyEntry,
  journalId: string | undefined,
  journalEntries: string[],
  baseSceneId: string,
  visitedSceneIds: Set<string>,
): NpcChoiceReply {
  if (!isTieredReply(entry)) {
    return entry
  }

  if (journalId && journalEntries.includes(journalId) && entry.reunion) {
    return entry.reunion
  }

  if (visitedSceneIds.has(baseSceneId) && entry.sameRun) {
    return entry.sameRun
  }

  return entry.first
}
