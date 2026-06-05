import { expect, test } from '@playwright/test'

import {
  createVessel,
  extractFromHeader,
  pickChoiceById,
  resetSaveSlot,
  returnFromRaidSummary,
  runMonasteryExtractionPath,
  skipNpcModal,
  startRaidSession,
  waitForScene,
} from './helpers'

test.describe('Встречи с NPC и добыча', () => {
  test.beforeEach(async ({ page }) => {
    await resetSaveSlot(page)
    await createVessel(page, { name: 'E2E NPC', origin: 'heretic' })
  })

  test('Бездыханный: модалка NPC и встреча с адептом Синода', async ({
    page,
  }) => {
    await startRaidSession(page)

    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await expect(page.getByTestId('npc-encounter-modal')).toBeVisible()
    await expect(page.getByText('Бездыханный', { exact: true })).toBeVisible()
    await skipNpcModal(page)

    await pickChoiceById(page, 'encounter_synod_acolyte')
    await waitForScene(page, 'encounter_synod_acolyte')
    await expect(page.getByTestId('npc-encounter-modal')).toBeVisible()
    await expect(page.getByText('Адепт под Вуалью')).toBeVisible()
    await skipNpcModal(page)

    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await skipNpcModal(page)

    await expect(page.getByTestId('game-journal-count')).toContainText('2')

    await pickChoiceById(page, 'leave_cart')
    await waitForScene(page, 'leave_cart')
    await pickChoiceById(page, 'monastery')
    await runMonasteryExtractionPath(page)
    await extractFromHeader(page)

    await expect(page.getByText('Извлечение')).toBeVisible()
    await returnFromRaidSummary(page)
  })

  test('Артефакт с телеги: маска попадает в итог спуска', async ({ page }) => {
    await startRaidSession(page)

    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await skipNpcModal(page)

    await pickChoiceById(page, 'take_mask')
    await waitForScene(page, 'take_mask')

    await pickChoiceById(page, 'mouth')
    await waitForScene(page, 'mouth')
    await pickChoiceById(page, 'start')
    await waitForScene(page, 'start')

    await runMonasteryExtractionPath(page)
    await extractFromHeader(page)

    await expect(page.getByText('Пепельная Безликая Маска')).toBeVisible()
    await returnFromRaidSummary(page)
  })

  test('Метка Синода: принять долг у адепта и извлечься', async ({ page }) => {
    await startRaidSession(page)

    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await skipNpcModal(page)
    await pickChoiceById(page, 'encounter_synod_acolyte')
    await waitForScene(page, 'encounter_synod_acolyte')
    await skipNpcModal(page)

    await pickChoiceById(page, 'mouth')
    await waitForScene(page, 'mouth')
    await pickChoiceById(page, 'start')
    await waitForScene(page, 'start')

    await runMonasteryExtractionPath(page)
    await extractFromHeader(page)
    await returnFromRaidSummary(page)

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-magazine').click()
    await expect(page.getByText('Синод под Вуалью')).toBeVisible()
  })
})
