export function createPinkNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * seconds
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  let b0 = 0
  let b1 = 0
  let b2 = 0
  let b3 = 0
  let b4 = 0
  let b5 = 0
  let b6 = 0

  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }

  return buffer
}

export function createLoopingNoise(
  ctx: AudioContext,
  destination: AudioNode,
  gainValue: number,
): { source: AudioBufferSourceNode; gain: GainNode } {
  const source = ctx.createBufferSource()
  source.buffer = createPinkNoiseBuffer(ctx, 4)
  source.loop = true

  const gain = ctx.createGain()
  gain.gain.value = gainValue

  source.connect(gain)
  gain.connect(destination)
  source.start()

  return { source, gain }
}
