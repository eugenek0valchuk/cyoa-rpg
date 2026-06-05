/**
 * Makes gothic UI icons transparent: strips black, white, and fake checkerboard BG.
 * Run: node scripts/process-ui-icons.mjs
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const UI_DIR = path.join(process.cwd(), 'public', 'ui')

const STAT_ICONS = [
  'gothic-strength.png',
  'gothic-agility.png',
  'gothic-intelligence.png',
  'gothic-blessed-star.png',
  'gothic-cursed-rosary.png',
]

function saturation(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max - min
}

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = saturation(r, g, b)

  // Pure / near black
  if (max < 36) {
    return true
  }

  // White, light gray, AI checkerboard (low saturation neutrals)
  if (sat < 24) {
    if (max > 165) {
      return true
    }

    if (max > 115 && max < 175) {
      return true
    }
  }

  // Very desaturated mid-tones (checkerboard fringe)
  if (sat < 12 && max > 90 && max < 210) {
    return true
  }

  return false
}

function alphaFromPixel(r, g, b) {
  if (isBackgroundPixel(r, g, b)) {
    return 0
  }

  const max = Math.max(r, g, b)

  if (max < 72) {
    return Math.min(255, Math.floor((max - 36) * 7))
  }

  if (max < 110 && saturation(r, g, b) < 28) {
    return Math.min(255, Math.floor(90 + (max - 72) * 4))
  }

  return 255
}

async function processIcon(filename) {
  const filePath = path.join(UI_DIR, filename)
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    pixels[i + 3] = Math.min(pixels[i + 3], alphaFromPixel(r, g, b))
  }

  const output = await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .resize(256, 256, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer()

  await writeFile(filePath, output)
  console.log(`processed ${filename} (${info.width}x${info.height} → 256x256)`)
}

async function main() {
  const args = process.argv.slice(2)
  const targets = args.length > 0 ? args : STAT_ICONS

  for (const file of targets) {
    await processIcon(file)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
