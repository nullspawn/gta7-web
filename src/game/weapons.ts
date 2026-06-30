// Weapon definitions + per-vehicle handling classes.

export interface WeaponDef {
  name: string
  mag: number // rounds per magazine
  damagePed: number // damage to a pedestrian per hit
  damageCar: number
  pellets: number // rays per trigger pull (shotgun > 1)
  spread: number // radians of random spread per ray
  cooldown: number // frames between shots
  reload: number // frames to reload
  range: number
  recoil: number // upward camera kick (radians)
  wanted: number // wanted gained per pedestrian killed
}

export const WEAPONS: WeaponDef[] = [
  {
    name: 'Pistol',
    mag: 12,
    damagePed: 100,
    damageCar: 22,
    pellets: 1,
    spread: 0.012,
    cooldown: 12,
    reload: 38,
    range: 720,
    recoil: 0.03,
    wanted: 1.4,
  },
  {
    name: 'SMG',
    mag: 30,
    damagePed: 60,
    damageCar: 16,
    pellets: 1,
    spread: 0.05,
    cooldown: 4,
    reload: 52,
    range: 620,
    recoil: 0.02,
    wanted: 1.2,
  },
  {
    name: 'Shotgun',
    mag: 6,
    damagePed: 70,
    damageCar: 14,
    pellets: 7,
    spread: 0.13,
    cooldown: 32,
    reload: 64,
    range: 380,
    recoil: 0.06,
    wanted: 1.6,
  },
]

// Per-vehicle handling classes, chosen by model. base/boost = top speed,
// accel = throttle ramp, turn = steering rate.
export interface VehicleClass {
  base: number
  boost: number
  accel: number
  turn: number
}
export const VEHICLE_CLASSES: Record<string, VehicleClass> = {
  sedan: { base: 2.6, boost: 3.9, accel: 0.065, turn: 0.03 },
  truck: { base: 2.2, boost: 3.3, accel: 0.05, turn: 0.024 },
  sports: { base: 3.2, boost: 4.8, accel: 0.085, turn: 0.034 },
  bike: { base: 2.9, boost: 4.3, accel: 0.075, turn: 0.036 },
}
