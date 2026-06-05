import type { Artifact } from './game'

export type RaidOutcome =
  | 'extracted'
  | 'emergency_extracted'
  | 'failed'
  | 'abandoned'

export interface RaidSummary {
  outcome: RaidOutcome
  depth: number
  gainedArtifacts: Artifact[]
  lostArtifacts: Artifact[]
  newMarks: string[]
  sanityBefore: number
  sanityAfter: number
  roomLevelAfter: number
  bestDepthAfter: number
  totalExtractionsAfter: number
  echoGain?: number
  echoAfter?: number
  /** Первый провал — Машина записывает урок */
  isFirstFailure?: boolean
  contractTitle?: string
  contractFulfilled?: boolean
  contractReward?: string
  contractClaimPending?: boolean
}
