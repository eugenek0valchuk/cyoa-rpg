export const fadeSlideUp = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
}

export const sceneTransition = {
  duration: 0.7,
  ease: 'easeOut',
} as const

export const choiceAnimation = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.98,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
}
