import { t } from '@/lib/i18n'
import {
  EXIT_SITE_CONDITIONS,
  type ExtractBlockReason,
} from './extraction'

const FLAG_LABELS: Record<string, string> = {
  met_breathless: 'Бездыханным',
}

export function getExtractHint(
  reason: ExtractBlockReason,
  context: {
    hasSigil: boolean
    raidDepth: number
    minExtractDepth: number
    sanity?: number
    corruption?: number
    sceneId?: string
  },
): { summary: string; detail?: string } | null {
  const { ui: hubText } = t.hub

  if (reason === 'available') {
    return { summary: hubText.extractAvailable }
  }

  if (reason === 'need_depth') {
    return {
      summary: hubText.extractHintDepth
        .replace('{depth}', String(context.raidDepth))
        .replace('{min}', String(context.minExtractDepth)),
    }
  }

  if (reason === 'need_sanity') {
    const required = EXIT_SITE_CONDITIONS[context.sceneId ?? '']?.find(
      (entry) => entry.kind === 'min_sanity',
    )
    const min = required?.kind === 'min_sanity' ? required.value : '?'

    return {
      summary: hubText.extractHintSanity
        .replace('{min}', String(min))
        .replace('{current}', String(context.sanity ?? 0)),
    }
  }

  if (reason === 'need_site_depth') {
    const required = EXIT_SITE_CONDITIONS[context.sceneId ?? '']?.find(
      (entry) => entry.kind === 'min_depth',
    )
    const min = required?.kind === 'min_depth' ? required.value : '?'

    return {
      summary: hubText.extractHintSiteDepth
        .replace('{min}', String(min))
        .replace('{current}', String(context.raidDepth)),
    }
  }

  if (reason === 'need_flag') {
    const required = EXIT_SITE_CONDITIONS[context.sceneId ?? '']?.find(
      (entry) => entry.kind === 'flag',
    )
    const flag =
      required?.kind === 'flag'
        ? (FLAG_LABELS[required.value] ?? required.value)
        : '…'

    return { summary: hubText.extractHintExitFlag.replace('{label}', flag) }
  }

  if (reason === 'too_corrupt') {
    const required = EXIT_SITE_CONDITIONS[context.sceneId ?? '']?.find(
      (entry) => entry.kind === 'max_corruption',
    )
    const max =
      required?.kind === 'max_corruption' ? required.value : '?'

    return {
      summary: hubText.extractHintTooCorrupt
        .replace('{max}', String(max))
        .replace('{current}', String(context.corruption ?? 0)),
    }
  }

  if (reason === 'need_sigil_site') {
    return { summary: hubText.extractHintSigilSite }
  }

  if (context.hasSigil) {
    return { summary: hubText.extractHintSigilSite }
  }

  return {
    summary: hubText.extractHintShort,
    detail: `${hubText.extractHintExitSite} ${hubText.extractHintSigil}`,
  }
}
