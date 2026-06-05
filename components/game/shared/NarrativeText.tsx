import type { ReactNode } from 'react'

/** `**акцент**` в тексте сцен → выделение, как в диалогах NPC. */
export function renderNarrativeEmphasis(text: string): ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#e7ded7]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}
