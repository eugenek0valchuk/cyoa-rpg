/** Одна реплика-ответ после выбора игрока. */
export type NpcChoiceReply = {
  player?: string
  npc: string[]
  /** Заключительные реплики NPC перед сменой сцены. */
  epilogue?: string[]
}

export type NpcChoiceReplyTiered = {
  first: NpcChoiceReply
  reunion?: NpcChoiceReply
  sameRun?: NpcChoiceReply
}

export type NpcChoiceReplyEntry = NpcChoiceReply | NpcChoiceReplyTiered

export type NpcOpeningTiered = {
  first: string[]
  reunion?: string[]
  sameRun?: string[]
}

export type NpcSceneDialoguePack = {
  opening?: string[]
  openingTiered?: NpcOpeningTiered
  replies: Record<string, NpcChoiceReplyEntry>
}

export function isTieredReply(
  entry: NpcChoiceReplyEntry,
): entry is NpcChoiceReplyTiered {
  return 'first' in entry
}
