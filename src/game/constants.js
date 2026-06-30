// Tuning + world constants (ported from the vanilla build, kept identical where tuned).
export const TWO_PI = Math.PI * 2
export const WORLD = { w: 4000, h: 4000 }
export const BLOCK = 500
export const ROAD = 120

export const CAR_COLORS = [
  '#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22',
  '#ecf0f1', '#1abc9c', '#ff6b9d', '#566270', '#2c3e50', '#d35400',
]

// vehicle handling
export const VEHICLE = {
  car:  { base: 2.6, boost: 3.9, accel: 0.065, turn: 0.03 },
  bike: { base: 2.9, boost: 4.3, accel: 0.075, turn: 0.036 },
}

export const rand = (a, b) => a + Math.random() * (b - a)
export const randi = (a, b) => Math.floor(rand(a, b))
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const dist2 = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz)
export const isRoad = (x, z) => {
  const mx = ((x % BLOCK) + BLOCK) % BLOCK
  const mz = ((z % BLOCK) + BLOCK) % BLOCK
  return mx < ROAD || mz < ROAD
}
