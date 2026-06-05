/** Разбивает описание сцены на короткие фрагменты для поэтапного показа. */
export function splitNarrativeChunks(text: string): string[] {
  const paragraphs = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const chunks: string[] = []

  for (const paragraph of paragraphs) {
    if (paragraph.length <= 200) {
      chunks.push(paragraph)
      continue
    }

    const sentences =
      paragraph.match(/[^.!?…]+[.!?…]+(?:\s|$)|[^.!?…]+$/g) ?? [paragraph]

    for (const sentence of sentences) {
      const trimmed = sentence.trim()

      if (trimmed) {
        chunks.push(trimmed)
      }
    }
  }

  return chunks.length > 0 ? chunks : [text]
}

/** Интервал между фрагментами — длинный текст укладывается примерно в ~1.1 с. */
export function chunkRevealDelayMs(chunkCount: number): number {
  if (chunkCount <= 1) {
    return 0
  }

  const targetMs = 1100

  return Math.min(160, Math.max(50, Math.floor(targetMs / chunkCount)))
}
