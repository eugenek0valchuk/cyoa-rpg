import { createLoopingNoise } from './noise'
import {
  AmbientTrack,
  DESCENT_TRACK_CONFIG,
  HUB_TRACK_CONFIG,
} from './AmbientTrack'

export type AmbientSceneMode = 'hub' | 'descent' | 'off'

const STORAGE_KEY = 'cyoa_ambient_muted'
const MASTER_LEVEL = 0.1
const RAMP_SEC = 3
const TENSE_RAMP_SEC = 2

function readMuted(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

function writeMuted(muted: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
}

export class AmbientController {
  private ctx: AudioContext | null = null

  private master: GainNode | null = null

  private hubBus: GainNode | null = null

  private descentBus: GainNode | null = null

  private tenseBus: GainNode | null = null

  private hubTrack: AmbientTrack | null = null

  private descentTrack: AmbientTrack | null = null

  private sceneMode: AmbientSceneMode = 'off'

  private tenseTarget = 0

  private muted = readMuted()

  private started = false

  private unlocked = false

  private bellTimer: number | null = null

  private crackleTimer: number | null = null

  isMuted(): boolean {
    return this.muted
  }

  getSceneMode(): AmbientSceneMode {
    return this.sceneMode
  }

  hasUnlocked(): boolean {
    return this.unlocked
  }

  async ensureStarted(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false
    }

    if (!this.ctx) {
      this.initContext()
    }

    if (!this.ctx) {
      return false
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }

    this.started = true
    this.unlocked = true
    this.applyMasterGain()
    return true
  }

  setSceneMode(mode: AmbientSceneMode) {
    this.sceneMode = mode

    if (mode === 'off') {
      this.rampBus(this.hubBus, 0)
      this.rampBus(this.descentBus, 0)
      this.rampBus(this.tenseBus, 0)
      this.hubTrack?.stop()
      this.descentTrack?.stop()
      this.stopSchedulers()
      return
    }

    if (!this.started) {
      return
    }

    if (mode === 'hub') {
      this.rampBus(this.hubBus, 1)
      this.rampBus(this.descentBus, 0)
      this.hubTrack?.start()
      this.descentTrack?.stop()
      this.startHubCrackle()
      this.stopBellScheduler()
    } else {
      this.rampBus(this.hubBus, 0)
      this.rampBus(this.descentBus, 1)
      this.hubTrack?.stop()
      this.descentTrack?.start()
      this.stopCrackleScheduler()
      this.startBellScheduler()
    }
  }

  setTense(active: boolean) {
    this.tenseTarget = active ? 1 : 0
    this.rampBus(this.tenseBus, this.tenseTarget, TENSE_RAMP_SEC)
  }

  toggleMute(): boolean {
    this.muted = !this.muted
    writeMuted(this.muted)
    this.applyMasterGain()
    return this.muted
  }

  setMuted(muted: boolean) {
    this.muted = muted
    writeMuted(muted)
    this.applyMasterGain()
  }

  private initContext() {
    const ctx = new AudioContext()
    this.ctx = ctx

    this.master = ctx.createGain()
    this.master.connect(ctx.destination)

    this.hubBus = ctx.createGain()
    this.descentBus = ctx.createGain()
    this.tenseBus = ctx.createGain()

    this.hubBus.connect(this.master)
    this.descentBus.connect(this.master)
    this.tenseBus.connect(this.master)

    this.hubTrack = new AmbientTrack(ctx, this.hubBus, HUB_TRACK_CONFIG)
    this.descentTrack = new AmbientTrack(ctx, this.descentBus, DESCENT_TRACK_CONFIG)
    this.buildTenseBed(ctx, this.tenseBus)

    this.hubBus.gain.value = 0
    this.descentBus.gain.value = 0
    this.tenseBus.gain.value = 0

    this.applyMasterGain()
  }

  private applyMasterGain() {
    if (!this.ctx || !this.master) {
      return
    }

    const level = this.muted ? 0 : MASTER_LEVEL
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.setTargetAtTime(level, this.ctx.currentTime, 0.08)
  }

  private rampBus(node: GainNode | null, target: number, duration = RAMP_SEC) {
    if (!this.ctx || !node) {
      return
    }

    const now = this.ctx.currentTime
    node.gain.cancelScheduledValues(now)
    node.gain.setValueAtTime(node.gain.value, now)
    node.gain.linearRampToValueAtTime(target, now + duration)
  }

  private buildTenseBed(ctx: AudioContext, bus: GainNode) {
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 240
    filter.Q.value = 1.8
    filter.connect(bus)

    const strings = ctx.createGain()
    strings.gain.value = 0.55
    strings.connect(filter)

    const disA = this.createDrone(ctx, strings, 146.8, 0.08, 'sawtooth')
    const disB = this.createDrone(ctx, strings, 155.6, 0.07, 'triangle')
    const disC = this.createDrone(ctx, strings, 220, 0.04, 'sine')

    const pulse = ctx.createOscillator()
    const pulseGain = ctx.createGain()
    pulse.frequency.value = 0.22
    pulseGain.gain.value = 0.12
    pulse.connect(pulseGain)
    pulseGain.connect(strings.gain)
    pulse.start()

    createLoopingNoise(ctx, filter, 0.022)

    void disA
    void disB
    void disC
  }

  private createDrone(
    ctx: AudioContext,
    destination: AudioNode,
    frequency: number,
    gainValue: number,
    type: OscillatorType,
  ) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.value = gainValue
    osc.connect(gain)
    gain.connect(destination)
    osc.start()
    return osc
  }

  private startBellScheduler() {
    if (this.bellTimer) {
      return
    }

    this.bellTimer = window.setInterval(() => {
      if (this.sceneMode !== 'descent' || this.muted) {
        return
      }

      this.playDistantBell(this.tenseTarget > 0 ? 1.15 : 0.65)
    }, 11000 + Math.random() * 9000)
  }

  private stopBellScheduler() {
    if (this.bellTimer) {
      window.clearInterval(this.bellTimer)
      this.bellTimer = null
    }
  }

  private startHubCrackle() {
    if (this.crackleTimer) {
      return
    }

    this.crackleTimer = window.setInterval(() => {
      if (this.sceneMode !== 'hub' || this.muted) {
        return
      }

      this.playCandleCrackle()
    }, 5000 + Math.random() * 6000)
  }

  private stopCrackleScheduler() {
    if (this.crackleTimer) {
      window.clearInterval(this.crackleTimer)
      this.crackleTimer = null
    }
  }

  private stopSchedulers() {
    this.stopBellScheduler()
    this.stopCrackleScheduler()
  }

  private playDistantBell(intensity: number) {
    if (!this.ctx || !this.descentBus) {
      return
    }

    const ctx = this.ctx
    const now = ctx.currentTime
    const base = 196 + Math.random() * 36

    for (const ratio of [1, 1.5, 2]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = base * ratio
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.028 * intensity, now + 0.12)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4 + ratio * 0.5)
      osc.connect(gain)
      gain.connect(this.descentBus)
      osc.start(now)
      osc.stop(now + 4)
    }
  }

  private playCandleCrackle() {
    if (!this.ctx || !this.hubBus) {
      return
    }

    const ctx = this.ctx
    const now = ctx.currentTime
    const buffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * 0.06),
      ctx.sampleRate,
    )
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 2200

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.hubBus)
    source.start(now)
    source.stop(now + 0.08)
  }
}

export const ambientController = new AmbientController()

export function resolveAmbientTense(input: {
  sanity?: number
  sanityStress?: boolean
  modalOpen?: boolean
  thresholdOpen?: boolean
  npcOpen?: boolean
  keyChoicePending?: boolean
  diceRolling?: boolean
  ending?: boolean
  failureStain?: boolean
}): boolean {
  if (input.ending) {
    return true
  }

  if (input.keyChoicePending || input.diceRolling || input.npcOpen) {
    return true
  }

  if (input.thresholdOpen || input.failureStain) {
    return true
  }

  if (input.sanityStress) {
    return true
  }

  if ((input.sanity ?? 100) <= 22) {
    return true
  }

  if (input.modalOpen) {
    return true
  }

  return false
}
