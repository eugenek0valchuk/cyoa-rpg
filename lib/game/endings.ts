import { t } from '@/lib/i18n'

import type { Character } from '../types/game'
import type { StoryPhase } from './director'

export interface Ending {
  id: string
  title: string
  description: string
}

interface EndingContext {
  historyLength: number
  phase: StoryPhase
  forceEnding: boolean
}

function ending(id: keyof typeof t.endings): Ending {
  return { id, ...t.endings[id] }
}

export function getEnding(
  character: Character,
  context: EndingContext,
): Ending | null {
  if (character.corruption >= 100) {
    return ending('abyssal_ascension')
  }

  if (character.sanity <= 0) {
    return ending('madness')
  }

  if (
    character.flags.includes('heard_the_bell') &&
    character.origin === 'witness' &&
    (context.forceEnding || character.corruption >= 75)
  ) {
    return ending('bell_witness')
  }

  if (
    character.flags.includes('claimed_mask') &&
    character.corruption >= 85
  ) {
    return ending('hollow_merge')
  }

  if (
    character.origin === 'heretic' &&
    character.flags.includes('read_the_writings') &&
    character.corruption >= 80
  ) {
    return ending('heretic_lexicon')
  }

  if (
    context.historyLength >= 12 &&
    character.sanity >= 70 &&
    character.corruption <= 20 &&
    character.flags.includes('ash_path_taken')
  ) {
    return ending('silent_departure')
  }

  if (
    context.forceEnding &&
    context.phase === 'COLLAPSE' &&
    context.historyLength >= 3 &&
    character.sanity <= 12
  ) {
    return ending('reality_collapse')
  }

  return null
}
