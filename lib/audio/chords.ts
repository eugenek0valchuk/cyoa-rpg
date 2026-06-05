export type ChordVoicing = {
  root: number
  tones: number[]
}

export function semitoneToHz(root: number, semitones: number): number {
  return root * 2 ** (semitones / 12)
}

export function createReverbImpulse(
  ctx: AudioContext,
  durationSec = 3.8,
  decay = 2.4,
): AudioBuffer {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * durationSec)
  const impulse = ctx.createBuffer(2, length, rate)

  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel)

    for (let i = 0; i < length; i += 1) {
      const envelope = (1 - i / length) ** decay
      data[i] = (Math.random() * 2 - 1) * envelope
    }
  }

  return impulse
}

export function createHallReverb(ctx: AudioContext, wetLevel = 0.55) {
  const convolver = ctx.createConvolver()
  convolver.buffer = createReverbImpulse(ctx, 4.2, 2.6)

  const wet = ctx.createGain()
  wet.gain.value = wetLevel

  convolver.connect(wet)

  return { convolver, wet }
}
