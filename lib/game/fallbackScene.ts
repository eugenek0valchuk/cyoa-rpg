export function getFallbackScene(choiceText: string, historyLength = 0) {
  const variants = [
    {
      title: 'The Path Below',
      description:
        `You chose "${choiceText}". ` +
        'The silence beneath the cathedral deepens as unseen bells echo through stone.',
    },
    {
      title: 'The Fractured Passage',
      description:
        `After "${choiceText}", the corridor bends in a direction that should not exist. ` +
        'Walls sweat cold moisture while distant chants lose their rhythm.',
    },
    {
      title: 'The Hollow Threshold',
      description:
        `"${choiceText}" leads you to a threshold marked by rusted nails and prayer-scars. ` +
        'Something on the other side exhales with patient hunger.',
    },
  ]

  const variant = variants[historyLength % variants.length]!

  return {
    id: `fallback_${Date.now()}`,
    title: variant.title,
    description: variant.description,

    options: [
      {
        id: 'continue_forward',
        text: 'Descend deeper into the abyss',
        effects: {
          sanity: -5,
        },
      },

      {
        id: 'observe_shadows',
        text: 'Remain still and observe the darkness',
        effects: {},
      },
    ],
  }
}
