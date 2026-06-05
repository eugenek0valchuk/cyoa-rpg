import { describe, expect, it } from 'vitest'

import { chunkRevealDelayMs, splitNarrativeChunks } from '../narrative'

describe('narrative', () => {
  it('splits on blank lines', () => {
    expect(splitNarrativeChunks('Первая строка.\n\nВторая строка.')).toEqual([
      'Первая строка.',
      'Вторая строка.',
    ])
  })

  it('splits long paragraphs into sentences', () => {
    const long =
      'Первая фраза тянется через весь коридор и не кончается сразу. '.repeat(4) +
      'Вторая фраза отделяется точкой. Третья завершает абзац.'

    expect(splitNarrativeChunks(long).length).toBeGreaterThan(1)
  })

  it('scales reveal delay for longer texts', () => {
    expect(chunkRevealDelayMs(1)).toBe(0)
    expect(chunkRevealDelayMs(8)).toBeLessThanOrEqual(160)
    expect(chunkRevealDelayMs(8)).toBeGreaterThanOrEqual(50)
  })
})
