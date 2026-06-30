// Tiny WebAudio synth. Created lazily after a user gesture (start click).
let actx: AudioContext | null = null
export function initAudio() {
  if (!actx) {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      actx = new Ctx()
    } catch {
      /* no audio */
    }
  }
  return actx
}
export function beep(freq: number, dur = 0.08, type: OscillatorType = 'square', vol = 0.04) {
  const a = actx
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.value = vol
  o.connect(g)
  g.connect(a.destination)
  o.start()
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur)
  o.stop(a.currentTime + dur)
}
export const gunshot = () => {
  beep(220, 0.05, 'square', 0.05)
  beep(90, 0.12, 'sawtooth', 0.05)
}
export const sfxEnter = () => {
  beep(220, 0.08, 'sine')
  beep(440, 0.06, 'sine')
}
export const sfxPickup = () => {
  beep(660, 0.05, 'sine')
  beep(990, 0.05, 'sine')
}
export const sfxDelivery = () => {
  beep(523, 0.08)
  beep(659, 0.08)
  beep(784, 0.12)
}
export const sfxSiren = () => {
  beep(880, 0.1, 'sine')
  beep(660, 0.1, 'sine')
}
