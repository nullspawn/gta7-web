// Shared domain types. Kept pragmatic (the project migrated from JS); strictness
// can be ratcheted up over time.

export type VehicleKind = 'car' | 'bike'
export type CarType = 'parked' | 'traffic' | 'player' | 'police'

export interface Car {
  id: number
  x: number
  z: number
  a: number
  vx: number
  vz: number
  speed: number
  kind: VehicleKind
  color: number | string
  hp: number
  type: CarType
  driver: unknown
  variant: number // which GLB model
  cls: string // handling class key (weapons.VEHICLE_CLASSES)
  _ai_steer: number
  _ai_accel: number
  _flip: number
  honk: number
  siren: number
  _smoke?: number
}

export interface Ped {
  id: number
  x: number
  z: number
  a: number
  speed: number
  r: number
  hp: number
  panic: number
  dead: boolean
  color: string
}

export interface Pickup {
  id: number
  x: number
  z: number
  val: number
  bob: number
  spin: number
  taken: boolean
}

export interface FX {
  id: number
  x: number
  y: number
  z: number
  color: number
  vx: number
  vy: number
  vz: number
  s: number
  life: number
  maxLife: number
}

export type MissionType = 'delivery' | 'chase' | 'survive'
export interface Mission {
  type: MissionType
  x: number
  z: number
  r: number
  reward: number
  pulse: number
  title: string
  desc: string
  // type-specific
  timeLeft?: number // survive / chase
  targetId?: number // chase
  done?: boolean
}

export interface Building {
  x: number
  z: number
  w: number
  d: number
}
export interface BuildingMesh extends Building {
  h: number
  facade: number
  repeatX: number
  repeatY: number
}
export interface TreeData {
  x: number
  z: number
  scale: number
}
export interface ParkData {
  x: number
  z: number
  w: number
  h: number
}
export interface CityData {
  buildings: BuildingMesh[]
  trees: TreeData[]
  parks: ParkData[]
  cols: number
  rows: number
}

export interface Player {
  x: number
  z: number
  a: number
  vx: number
  vz: number
  speed: number
  r: number
  hp: number
  inCar: Car | null
  punchT: number
  money: number
}

export interface WeaponState {
  current: number // index into WEAPONS
  ammo: number[] // ammo in mag per weapon
  reloadT: number // frames remaining on reload
  cooldown: number // frames until next shot allowed
}

export interface GameEvent {
  type: string
  [k: string]: unknown
}

export interface GameState {
  started: boolean
  cars: Car[]
  peds: Ped[]
  police: Car[]
  pickups: Pickup[]
  fx: FX[]
  buildings: Building[]
  cityData: CityData | null
  player: Player
  mission: Mission | null
  deliveries: number
  kills: number
  wanted: number
  wantedDecay: number
  busting: number
  keys: Record<string, boolean>
  yaw: number
  pitch: number
  camDist: number
  mouseIdle: number
  locked: boolean
  focus: number
  focusActive: boolean
  timeScale: number
  simAccum: number
  weapon: WeaponState
  events: GameEvent[]
}

export interface Settings {
  mouseSensitivity: number // 0.3 .. 2.5  (multiplier)
  steerSensitivity: number // 0.4 .. 1.6  (multiplier)
  invertY: boolean
}

export interface Profile {
  bestMoney: number
  totalDeliveries: number
  totalKills: number
  runs: number
}
