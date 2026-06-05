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

test.describe('Память дороги между спусками', () => {
  test('второй спуск: вспомнить путь и вернуться к телеге', async ({
    page,
  }) => {
    await resetSaveSlot(page)
    await createVessel(page, { name: 'E2E Память', origin: 'heretic' })

    await startRaidSession(page)
    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await skipNpcModal(page)
    await pickChoiceById(page, 'leave_cart')
    await waitForScene(page, 'leave_cart')
    await pickChoiceById(page, 'monastery')
    await runMonasteryExtractionPath(page)
    await extractFromHeader(page)
    await returnFromRaidSummary(page)

    await startRaidSession(page)
    await waitForScene(page, 'start')

    const memoryChoice = page.getByTestId('choice-beat_return_road')
    await expect(memoryChoice).toBeVisible({ timeout: 15_000 })
    await pickChoiceById(page, 'beat_return_road')
    await waitForScene(page, 'remembered_path')

    await pickChoiceById(page, 'merchant')
    await waitForScene(page, 'merchant')
    await expect(page.getByTestId('npc-encounter-modal')).toBeVisible()
    await expect(page.getByText('Снова ты')).toBeVisible()
    await skipNpcModal(page)

    await pickChoiceById(page, 'leave_cart')
    await waitForScene(page, 'leave_cart')
    await pickChoiceById(page, 'monastery')
    await runMonasteryExtractionPath(page)
    await extractFromHeader(page)
    await returnFromRaidSummary(page)

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-chamber').click()
    await expect(page.getByTestId('chronicle-stat-raids')).toContainText('2')
    await expect(page.getByTestId('chronicle-stat-extractions')).toContainText(
      '2',
    )
  })
})
