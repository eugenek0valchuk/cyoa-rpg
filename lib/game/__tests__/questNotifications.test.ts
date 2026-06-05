import { describe, expect, it } from 'vitest'

import { act1EventsToToasts } from '@/lib/game/acts/questNotifications'

describe('questNotifications', () => {
  it('maps completed step to toast with lore body', () => {
    const toasts = act1EventsToToasts([
      { kind: 'step_completed', stepId: 'w_main_2' },
    ])

    expect(toasts[0]?.title).toBe('Тот, кто не дышит')
    expect(toasts[0]?.body).toContain('Бездыханный')
  })
})
