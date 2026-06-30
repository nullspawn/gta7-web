import { create } from 'zustand'
import type { Settings, Profile } from '../game/types'
import { loadSettings, saveSettings, loadProfile, saveProfile } from '../game/persist'

export type Phase = 'menu' | 'playing' | 'wasted'

export interface Hud {
  money: number
  wanted: number
  hp: number
  speed: number
  focus: number
  deliveries: number
  kills: number
  inCar: boolean
  weaponName: string
  ammo: number
  mag: number
  reloading: boolean
  missionTimer: number // seconds remaining, 0 = none
}
export interface Toast {
  text: string
  ms: number
  id: number
}
export interface MissionInfo {
  title: string
  desc: string
}

interface Versions {
  cars: number
  peds: number
  police: number
  pickups: number
}

interface UIStore {
  phase: Phase
  modelsReady: boolean
  hud: Hud
  prompt: string
  toast: Toast | null
  missionInfo: MissionInfo
  focusActive: boolean
  locked: boolean
  versions: Versions
  settings: Settings
  profile: Profile
  showSettings: boolean

  setPhase: (phase: Phase) => void
  setModelsReady: (modelsReady: boolean) => void
  setHud: (hud: Hud) => void
  setPrompt: (prompt: string) => void
  setToast: (toast: Toast | null) => void
  setMissionInfo: (missionInfo: MissionInfo) => void
  setFocusActive: (focusActive: boolean) => void
  setLocked: (locked: boolean) => void
  bump: (key: keyof Versions) => void
  setSettings: (patch: Partial<Settings>) => void
  setProfile: (profile: Profile) => void
  toggleSettings: (v?: boolean) => void
}

const EMPTY_HUD: Hud = {
  money: 0,
  wanted: 0,
  hp: 100,
  speed: 0,
  focus: 100,
  deliveries: 0,
  kills: 0,
  inCar: false,
  weaponName: 'Pistol',
  ammo: 12,
  mag: 12,
  reloading: false,
  missionTimer: 0,
}

export const useGame = create<UIStore>((set) => ({
  phase: 'menu',
  modelsReady: false,
  hud: EMPTY_HUD,
  prompt: '',
  toast: null,
  missionInfo: { title: 'Objective', desc: 'Loading the city…' },
  focusActive: false,
  locked: false,
  versions: { cars: 0, peds: 0, police: 0, pickups: 0 },
  settings: loadSettings(),
  profile: loadProfile(),
  showSettings: false,

  setPhase: (phase) => set({ phase }),
  setModelsReady: (modelsReady) => set({ modelsReady }),
  setHud: (hud) => set({ hud }),
  setPrompt: (prompt) => set((s) => (s.prompt === prompt ? s : { prompt })),
  setToast: (toast) => set({ toast }),
  setMissionInfo: (missionInfo) => set({ missionInfo }),
  setFocusActive: (focusActive) =>
    set((s) => (s.focusActive === focusActive ? s : { focusActive })),
  setLocked: (locked) => set((s) => (s.locked === locked ? s : { locked })),
  bump: (key) => set((s) => ({ versions: { ...s.versions, [key]: s.versions[key] + 1 } })),
  setSettings: (patch) =>
    set((s) => {
      const settings = { ...s.settings, ...patch }
      saveSettings(settings)
      return { settings }
    }),
  setProfile: (profile) => {
    saveProfile(profile)
    set({ profile })
  },
  toggleSettings: (v) => set((s) => ({ showSettings: v ?? !s.showSettings })),
}))
