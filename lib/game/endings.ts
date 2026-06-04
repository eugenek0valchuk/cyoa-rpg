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

export function getEnding(
  character: Character,
  context: EndingContext,
): Ending | null {
  if (character.corruption >= 100) {
    return {
      id: 'abyssal_ascension',
      title: 'The Mouth Opens',
      description: 'Your flesh becomes scripture for the abyss.',
    }
  }

  if (character.sanity <= 0) {
    return {
      id: 'madness',
      title: 'The Last Bell',
      description: 'Reality fractures beyond recovery.',
    }
  }

  if (
    character.flags.includes('heard_the_bell') &&
    character.origin === 'witness' &&
    (context.forceEnding || character.corruption >= 75)
  ) {
    return {
      id: 'bell_witness',
      title: 'The Bell Remembers You',
      description:
        'The drowned bell rings through your bones until memory and metal become one.',
    }
  }

  if (
    character.flags.includes('claimed_mask') &&
    character.corruption >= 85
  ) {
    return {
      id: 'hollow_merge',
      title: 'Faceless Communion',
      description:
        'The mask finds its missing features beneath your skin. You kneel, and the abyss kneels with you.',
    }
  }

  if (
    character.origin === 'heretic' &&
    character.flags.includes('read_the_writings') &&
    character.corruption >= 80
  ) {
    return {
      id: 'heretic_lexicon',
      title: 'The Forbidden Lexicon',
      description:
        'Every forbidden word you read rewrites your blood. The cathedral exhales through your mouth.',
    }
  }

  if (
    context.historyLength >= 12 &&
    character.sanity >= 70 &&
    character.corruption <= 20 &&
    character.flags.includes('ash_path_taken')
  ) {
    return {
      id: 'silent_departure',
      title: 'Ash on the Wind',
      description:
        'You climb back toward a sky that still pretends to exist. The bells grow faint, but never fully silent.',
    }
  }

  if (context.forceEnding && context.phase === 'COLLAPSE') {
    return {
      id: 'reality_collapse',
      title: 'The World Unthreads',
      description:
        'Stone, flesh, and prayer unravel together. What remains of you is scattered across the ruins.',
    }
  }

  return null
}
