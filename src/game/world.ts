import { WORLD, BLOCK, ROAD, rand, randi } from './constants'
import { game } from './state'

const FACADES = 6

// Procedurally lay out the city once. Returns render data; also fills
// game.buildings with AABB collision boxes (trees are non-colliding).
export function generateCity() {
  const buildings = [] // { x, z, w, d, h, facade, repeatX, repeatY }
  const trees = [] // { x, z, scale }
  const parks = [] // { x, z, w, d }
  game.buildings.length = 0

  const cols = Math.floor(WORLD.w / BLOCK)
  const rows = Math.floor(WORLD.h / BLOCK)

  const place = (x, z, w, d) => {
    const h = rand(70, 300)
    buildings.push({
      x: x + w / 2,
      z: z + d / 2,
      w,
      d,
      h,
      facade: randi(0, FACADES),
      repeatX: Math.max(1, Math.round(w / 42)),
      repeatY: Math.max(1, Math.round(h / 46)),
    })
    game.buildings.push({ x: x + w / 2, z: z + d / 2, w, d })
  }

  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const bx = cx * BLOCK + ROAD
      const bz = cy * BLOCK + ROAD
      const iw = BLOCK - ROAD
      const ih = BLOCK - ROAD
      if (Math.random() < 0.12) {
        parks.push({ x: bx, z: bz, w: iw, h: ih })
        for (let t = 0; t < 5; t++)
          trees.push({
            x: bx + rand(30, iw - 30),
            z: bz + rand(30, ih - 30),
            scale: rand(0.85, 1.3),
          })
        continue
      }
      const sub = randi(1, 3)
      const pad = 18
      if (sub === 1) {
        place(bx + pad, bz + pad, iw - pad * 2, ih - pad * 2)
      } else {
        const hw = iw / 2,
          hh = ih / 2
        for (let i = 0; i < 2; i++)
          for (let j = 0; j < 2; j++) {
            if (Math.random() < 0.18) continue
            place(bx + i * hw + pad, bz + j * hh + pad, hw - pad * 2, hh - pad * 2)
          }
      }
    }
  }
  return { buildings, trees, parks, cols, rows }
}

// pick a point on a road centerline
export function findRoadPoint() {
  for (let i = 0; i < 200; i++) {
    const cx = randi(0, Math.floor(WORLD.w / BLOCK))
    const cy = randi(0, Math.floor(WORLD.h / BLOCK))
    const horiz = Math.random() < 0.5
    let x, z
    if (horiz) {
      x = cx * BLOCK + rand(ROAD, BLOCK)
      z = cy * BLOCK + ROAD * 0.5
    } else {
      x = cx * BLOCK + ROAD * 0.5
      z = cy * BLOCK + rand(ROAD, BLOCK)
    }
    return { x: clampW(x), z: clampW(z), horiz }
  }
  return { x: BLOCK * 4, z: BLOCK * 4, horiz: true }
}
const clampW = (v) => Math.max(60, Math.min(WORLD.w - 60, v))
