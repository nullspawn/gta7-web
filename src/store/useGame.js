import { create } from 'zustand'

// Reactive store for UI + low-frequency signals only.
// - `phase`: 'menu' | 'playing' | 'wasted'
// - `hud`: throttled snapshot the loop pushes ~12x/sec (not every frame)
// - version counters bump when entity membership changes, so entity-list
//   components re-render only on spawn/despawn (never per frame).
export const useGame = create((set) => ({
  phase: 'menu',
  modelsReady: false,
  hud: { money: 0, wanted: 0, hp: 100, speed: 0, focus: 100, deliveries: 0, kills: 0 },
  prompt: '',
  toast: null,         // { text, id }
  missionInfo: { title: 'Objective', desc: 'Loading the city…' },
  focusActive: false,
  locked: false,

  versions: { cars: 0, peds: 0, police: 0, pickups: 0 },

  setPhase: (phase) => set({ phase }),
  setModelsReady: (modelsReady) => set({ modelsReady }),
  setHud: (hud) => set({ hud }),
  setPrompt: (prompt) => set((s) => (s.prompt === prompt ? s : { prompt })),
  setToast: (toast) => set({ toast }),
  setMissionInfo: (missionInfo) => set({ missionInfo }),
  setFocusActive: (focusActive) => set((s) => (s.focusActive === focusActive ? s : { focusActive })),
  setLocked: (locked) => set((s) => (s.locked === locked ? s : { locked })),
  bump: (key) => set((s) => ({ versions: { ...s.versions, [key]: s.versions[key] + 1 } })),
}))
