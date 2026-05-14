export function getEnding(sanity: number, corruption: number) {
  if (corruption >= 100) {
    return {
      id: 'abyssal_ascension',
      title: 'The Mouth Opens',
      description: 'Your flesh becomes scripture for the abyss.',
    }
  }

  if (sanity <= 0) {
    return {
      id: 'madness',
      title: 'The Last Bell',
      description: 'Reality fractures beyond recovery.',
    }
  }

  return null
}
