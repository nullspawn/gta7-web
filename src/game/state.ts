// Mutable, NON-reactive game world singleton. Per-frame simulation mutates these
// fields directly so React never re-renders 60x/second. Reactive UI values live
// in the Zustand store (src/store/useGame.ts).
import type { GameState } from './types'
import { WEAPONS } from './weapons'

const freshWeapon = () => ({ current: 0, ammo: WEAPONS.map((w) => w.mag), reloadT: 0, cooldown: 0 })

export const game: GameState = {
  started: false,
  cars: [],
  peds: [],
  police: [],
  pickups: [],
  fx: [],
  buildings: [],
  cityData: null,
  player: {
    x: 0,
    z: 0,
    a: 0,
    vx: 0,
    vz: 0,
    speed: 0,
    r: 14,
    hp: 100,
    inCar: null,
    punchT: 0,
    money: 0,
  },
  mission: null,
  deliveries: 0,
  kills: 0,
  wanted: 0,
  wantedDecay: 0,
  busting: 0,
  keys: {},
  yaw: Math.PI,
  pitch: 0.55,
  camDist: 150,
  mouseIdle: 0,
  locked: false,
  focus: 100,
  focusActive: false,
  timeScale: 1,
  simAccum: 0,
  weapon: freshWeapon(),
  events: [],
}

export function resetGame() {
  game.cars.length = 0
  game.peds.length = 0
  game.police.length = 0
  game.pickups.length = 0
  game.fx.length = 0
  game.buildings.length = 0
  Object.assign(game.player, {
    x: 0,
    z: 0,
    a: 0,
    vx: 0,
    vz: 0,
    speed: 0,
    hp: 100,
    inCar: null,
    punchT: 0,
    money: 0,
  })
  game.mission = null
  game.deliveries = 0
  game.kills = 0
  game.wanted = 0
  game.wantedDecay = 0
  game.busting = 0
  game.yaw = Math.PI
  game.pitch = 0.55
  game.camDist = 150
  game.focus = 100
  game.focusActive = false
  game.timeScale = 1
  game.simAccum = 0
  game.weapon = freshWeapon()
  game.events = []
}
