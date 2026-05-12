export function getFallbackScene(choiceText: string) {
  return {
    id: `fallback_${Date.now()}`,

    title: 'The Path Below',

    description:
      `You chose "${choiceText}". ` +
      'The silence beneath the cathedral deepens as unseen bells echo through stone.',

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
