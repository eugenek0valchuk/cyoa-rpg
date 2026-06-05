import { createLoopingNoise } from './noise'
import { createHallReverb, semitoneToHz, type ChordVoicing } from './chords'

export type AmbientTrackConfig = {
  progression: ChordVoicing[]
  melodyNotes: number[]
  chordHoldSec: number
  padLevel: number
  subLevel: number
  melodyLevel: number
  airLevel: number
  filterBase: number
  reverbWet: number
}

export class AmbientTrack {
  private readonly ctx: AudioContext

  private readonly dryBus: GainNode

  private readonly padGain: GainNode

  private readonly subGain: GainNode

  private readonly melodyGain: GainNode

  private readonly filter: BiquadFilterNode

  private readonly reverb: ReturnType<typeof createHallReverb>

  private readonly config: AmbientTrackConfig

  private padVoices: Array<{ osc: OscillatorNode; gain: GainNode }> = []

  private subOsc: OscillatorNode | null = null

  private subGainNode: GainNode | null = null

  private chordIndex = 0

  private chordTimer: number | null = null

  private melodyTimer: number | null = null

  private breathLfo: OscillatorNode | null = null

  private disposed = false

  constructor(ctx: AudioContext, destination: GainNode, config: AmbientTrackConfig) {
    this.ctx = ctx
    this.config = config

    this.dryBus = ctx.createGain()
    this.dryBus.gain.value = 1
    this.dryBus.connect(destination)

    this.reverb = createHallReverb(ctx, config.reverbWet)
    this.reverb.wet.connect(destination)

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = config.filterBase
    this.filter.Q.value = 0.45

    this.padGain = ctx.createGain()
    this.padGain.gain.value = config.padLevel
    this.padGain.connect(this.filter)

    this.subGain = ctx.createGain()
    this.subGain.gain.value = config.subLevel
    this.subGain.connect(this.filter)

    this.melodyGain = ctx.createGain()
    this.melodyGain.gain.value = config.melodyLevel
    this.melodyGain.connect(this.reverb.convolver)
    this.melodyGain.connect(this.filter)

    this.filter.connect(this.dryBus)
    this.filter.connect(this.reverb.convolver)

    createLoopingNoise(ctx, this.filter, config.airLevel)

    this.initPadVoices()
    this.initSub()
    this.initBreathLfo()
    this.applyChord(this.config.progression[0]!, 0)
  }

  start() {
    if (this.disposed) {
      return
    }

    this.scheduleChordCycle()
    this.scheduleMelody()
  }

  stop() {
    if (this.chordTimer) {
      window.clearInterval(this.chordTimer)
      this.chordTimer = null
    }

    if (this.melodyTimer) {
      window.clearInterval(this.melodyTimer)
      this.melodyTimer = null
    }
  }

  dispose() {
    this.stop()
    this.disposed = true

    for (const voice of this.padVoices) {
      voice.osc.stop()
    }

    this.subOsc?.stop()
    this.breathLfo?.stop()
  }

  private initPadVoices() {
    const chord = this.config.progression[0]!
    let voiceIndex = 0

    for (const semitone of chord.tones) {
      for (const detune of [-9, 0, 9]) {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = voiceIndex % 2 === 0 ? 'sine' : 'triangle'
        osc.detune.value = detune
        gain.gain.value = 0.0001
        osc.connect(gain)
        gain.connect(this.padGain)

        osc.frequency.value = semitoneToHz(chord.root, semitone)
        osc.start()

        this.padVoices.push({ osc, gain })
        voiceIndex += 1
      }
    }
  }

  private initSub() {
    const chord = this.config.progression[0]!
    this.subOsc = this.ctx.createOscillator()
    this.subGainNode = this.ctx.createGain()
    this.subOsc.type = 'sine'
    this.subOsc.frequency.value = chord.root / 2
    this.subGainNode.gain.value = 0.0001
    this.subOsc.connect(this.subGainNode)
    this.subGainNode.connect(this.subGain)
    this.subOsc.start()
  }

  private initBreathLfo() {
    this.breathLfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    this.breathLfo.frequency.value = 0.035
    lfoGain.gain.value = this.config.filterBase * 0.35
    this.breathLfo.connect(lfoGain)
    lfoGain.connect(this.filter.frequency)
    this.breathLfo.start()
  }

  private scheduleChordCycle() {
    const advance = () => {
      this.chordIndex = (this.chordIndex + 1) % this.config.progression.length
      this.applyChord(
        this.config.progression[this.chordIndex]!,
        this.config.chordHoldSec * 0.85,
      )
    }

    this.chordTimer = window.setInterval(
      advance,
      this.config.chordHoldSec * 1000,
    )
  }

  private scheduleMelody() {
    const tick = () => {
      if (Math.random() > 0.55) {
        return
      }

      const note =
        this.config.melodyNotes[
          Math.floor(Math.random() * this.config.melodyNotes.length)
        ] ?? 440

      this.playMotifNote(note)
    }

    this.melodyTimer = window.setInterval(
      tick,
      5200 + Math.random() * 4800,
    )
  }

  private applyChord(chord: ChordVoicing, rampSec: number) {
    const now = this.ctx.currentTime
    const targets: number[] = []

    for (const semitone of chord.tones) {
      for (const _detune of [-9, 0, 9]) {
        targets.push(semitoneToHz(chord.root, semitone))
      }
    }

    for (let i = 0; i < this.padVoices.length; i += 1) {
      const voice = this.padVoices[i]
      if (!voice) {
        continue
      }

      const hz = targets[i] ?? targets[0] ?? chord.root
      voice.osc.frequency.cancelScheduledValues(now)
      voice.osc.frequency.setValueAtTime(voice.osc.frequency.value, now)
      voice.osc.frequency.exponentialRampToValueAtTime(
        Math.max(hz, 20),
        now + rampSec,
      )

      const level = 0.045 + (i % 3 === 0 ? 0.012 : 0)
      voice.gain.gain.cancelScheduledValues(now)
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now)
      voice.gain.gain.linearRampToValueAtTime(level, now + rampSec * 0.6)
    }

    if (this.subOsc && this.subGainNode) {
      const subHz = Math.max(chord.root / 2, 30)
      this.subOsc.frequency.cancelScheduledValues(now)
      this.subOsc.frequency.setValueAtTime(this.subOsc.frequency.value, now)
      this.subOsc.frequency.exponentialRampToValueAtTime(subHz, now + rampSec)

      this.subGainNode.gain.cancelScheduledValues(now)
      this.subGainNode.gain.setValueAtTime(this.subGainNode.gain.value, now)
      this.subGainNode.gain.linearRampToValueAtTime(1, now + rampSec * 0.5)
    }
  }

  private playMotifNote(frequency: number) {
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = frequency

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.35)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2)

    osc.connect(gain)
    gain.connect(this.melodyGain)
    osc.start(now)
    osc.stop(now + 4.5)
  }
}

export const HUB_TRACK_CONFIG: AmbientTrackConfig = {
  progression: [
    { root: 220, tones: [0, 3, 7, 12] },
    { root: 174.61, tones: [0, 4, 7, 12] },
    { root: 261.63, tones: [0, 4, 7, 12] },
    { root: 196, tones: [0, 4, 7, 12] },
    { root: 164.81, tones: [0, 3, 7, 12] },
  ],
  melodyNotes: [329.63, 392, 440, 523.25, 587.33, 659.25],
  chordHoldSec: 16,
  padLevel: 1,
  subLevel: 1,
  melodyLevel: 1,
  airLevel: 0.008,
  filterBase: 780,
  reverbWet: 0.62,
}

export const DESCENT_TRACK_CONFIG: AmbientTrackConfig = {
  progression: [
    { root: 220, tones: [0, 3, 7, 12] },
    { root: 293.66, tones: [0, 3, 7, 12] },
    { root: 174.61, tones: [0, 4, 7, 12] },
    { root: 164.81, tones: [0, 4, 8, 12] },
    { root: 110, tones: [0, 3, 7, 12] },
  ],
  melodyNotes: [261.63, 293.66, 329.63, 349.23, 392, 440],
  chordHoldSec: 20,
  padLevel: 1,
  subLevel: 1.1,
  melodyLevel: 0.85,
  airLevel: 0.014,
  filterBase: 520,
  reverbWet: 0.68,
}
