import { TWO_PI, WORLD, CAR_COLORS, VEHICLE, rand, randi, clamp, dist2, isRoad } from './constants.js'
import { game, resetGame } from './state.js'
import { generateCity, findRoadPoint } from './world.js'
import { useGame } from '../store/useGame.js'
import { initAudio, beep, gunshot, sfxEnter, sfxPickup, sfxDelivery, sfxSiren } from './audio.js'

let idc = 1
const nextId = () => idc++
const bump = (k) => useGame.getState().bump(k)
let toastId = 0
export function toast(text, ms = 1400) { useGame.getState().setToast(text ? { text, ms, id: ++toastId } : null) }

const K = {
  up: () => game.keys['w'] || game.keys['arrowup'],
  down: () => game.keys['s'] || game.keys['arrowdown'],
  left: () => game.keys['a'] || game.keys['arrowleft'],
  right: () => game.keys['d'] || game.keys['arrowright'],
  boost: () => game.keys['shift'],
  brake: () => game.keys[' '],
  focus: () => game.keys['q'],
}

/* ---------- factories ---------- */
function mkCar(x, z, opts = {}) {
  const kind = opts.type === 'police' ? 'car' : (opts.kind || (Math.random() < 0.22 ? 'bike' : 'car'))
  return {
    id: nextId(), x, z, a: rand(0, TWO_PI), vx: 0, vz: 0, speed: 0, kind,
    color: CAR_COLORS[randi(0, CAR_COLORS.length)], hp: 100, type: 'parked', driver: null,
    _ai_steer: 0, _ai_accel: 0, _flip: 0, honk: 0, siren: 0, ...opts,
  }
}
function mkPed(x, z) {
  const hue = Math.floor(rand(0, 360))
  return { id: nextId(), x, z, a: rand(0, TWO_PI), speed: rand(0.5, 1.1), r: 9, hp: 30, panic: 0, dead: false, color: `hsl(${hue},50%,55%)` }
}
function mkPickup(x, z) { return { id: nextId(), x, z, val: randi(20, 120), bob: rand(0, TWO_PI), spin: 0, taken: false } }

/* ---------- lifecycle ---------- */
export function startRun() {
  resetGame()
  game.cityData = generateCity()
  spawnWorld()
  newMission()
  game.started = true
  initAudio()
  useGame.getState().setPhase('playing')
}
function spawnWorld() {
  game.cars.length = 0; game.peds.length = 0; game.police.length = 0; game.pickups.length = 0; game.fx.length = 0
  for (let i = 0; i < 70; i++) {
    const p = findRoadPoint(); const c = mkCar(p.x, p.z); c.a = p.horiz ? Math.PI / 2 : 0
    if (Math.random() < 0.55) { c.type = 'traffic'; c.driver = {} }
    game.cars.push(c)
  }
  for (let i = 0; i < 55; i++) {
    const onRoad = Math.random() < 0.5; let x, z
    for (let t = 0; t < 30; t++) { x = rand(40, WORLD.w - 40); z = rand(40, WORLD.h - 40); if (isRoad(x, z) === onRoad) break }
    game.peds.push(mkPed(x, z))
  }
  for (let i = 0; i < 40; i++) { const p = findRoadPoint(); game.pickups.push(mkPickup(p.x, p.z)) }
  const p = findRoadPoint(); game.player.x = p.x; game.player.z = p.z
  bump('cars'); bump('peds'); bump('police'); bump('pickups')
}
export function newMission() {
  const p = findRoadPoint()
  game.mission = { x: p.x, z: p.z, r: 48, reward: randi(300, 600) + game.deliveries * 120, pulse: 0 }
  useGame.getState().setMissionInfo({ title: 'Delivery #' + (game.deliveries + 1), desc: `Drive to the marked drop-off and earn $${game.mission.reward}. Cops won't make it easy.` })
}

/* ---------- collisions ---------- */
function hitBuilding(x, z, r) {
  for (const b of game.buildings) {
    const hw = b.w / 2 + r, hd = b.d / 2 + r
    if (x > b.x - hw && x < b.x + hw && z > b.z - hd && z < b.z + hd) return b
  }
  return null
}
function resolveBuilding(o) {
  const b = hitBuilding(o.x, o.z, o.r); if (!b) return false
  const hw = b.w / 2 + o.r, hd = b.d / 2 + o.r
  const left = o.x - (b.x - hw), right = (b.x + hw) - o.x, top = o.z - (b.z - hd), bot = (b.z + hd) - o.z
  const m = Math.min(left, right, top, bot)
  if (m === left) o.x = b.x - hw; else if (m === right) o.x = b.x + hw
  else if (m === top) o.z = b.z - hd; else o.z = b.z + hd
  if ('speed' in o) o.speed *= 0.35
  return true
}

/* ---------- enter / exit / actions (called from input) ---------- */
export function nearestCar(maxD) {
  let best = null, bd = maxD
  for (const c of game.cars) { if (c === game.player.inCar) continue; const d = dist2(game.player.x, game.player.z, c.x, c.z); if (d < bd) { bd = d; best = c } }
  return best
}
export function tryEnterExit() {
  if (!game.started) return
  const p = game.player
  if (p.inCar) {
    const c = p.inCar; p.inCar = null; c.type = 'parked'; c.driver = null
    p.x = c.x + Math.cos(c.a) * 32; p.z = c.z - Math.sin(c.a) * 32; p.vx = p.vz = 0; p.speed = 0; p.a = c.a
    toast('On foot', 600); beep(330, 0.06, 'sine')
  } else {
    const c = nearestCar(60)
    if (c) { c.type = 'player'; c.driver = p; c.hp = Math.max(c.hp, 60); p.inCar = c; game.yaw = c.a + Math.PI; if (c.kind === 'bike') toast('Motorcycle', 600); sfxEnter() }
  }
}
export function doAction() {
  if (!game.started) return
  const p = game.player
  if (p.inCar) { p.inCar.honk = 12; beep(180, 0.12, 'sawtooth', 0.05); return }
  p.punchT = 12; beep(120, 0.05, 'square', 0.05)
  const fx2 = p.x + Math.sin(p.a) * 22, fz2 = p.z + Math.cos(p.a) * 22
  for (const t of game.peds) { if (t.dead) continue; if (dist2(fx2, fz2, t.x, t.z) < 24) { t.hp -= 20; t.panic = 200; t.a = Math.atan2(t.x - p.x, t.z - p.z); t.speed = 2.2; bumpWanted(1); spawnFX(t.x, 18, t.z, 0xc0392b, 8) } }
}
export function shoot() {
  if (!game.started || game.player.inCar) return
  const p = game.player
  gunshot(); game.focus = Math.min(100, game.focus + 4)
  const dx = -Math.sin(game.yaw), dz = -Math.cos(game.yaw)
  p.a = Math.atan2(dx, dz)
  const ox = p.x + dx * 18, oz = p.z + dz * 18, range = 720
  let hitT = range, hitKind = null, hitObj = null
  const scan = (arr, kind, perpMax) => {
    for (const c of arr) { if (c === p.inCar || c.dead) continue
      const tx = c.x - ox, tz = c.z - oz, proj = tx * dx + tz * dz
      if (proj < 0 || proj > range) continue
      const perp = Math.hypot(tx - dx * proj, tz - dz * proj)
      if (perp < perpMax && proj < hitT) { hitT = proj; hitKind = kind; hitObj = c }
    }
  }
  scan(game.peds, 'ped', 22); scan(game.cars, 'car', 24); scan(game.police, 'car', 24)
  const ex = ox + dx * hitT, ez = oz + dz * hitT
  for (let i = 1; i <= 4; i++) spawnFX(ox + dx * (hitT * i / 5), 22, oz + dz * (hitT * i / 5), 0xfff2a0, 1, true)
  spawnFX(ox + dx * 16, 22, oz + dz * 16, 0xffe08a, 3, true)
  if (hitKind === 'ped') { hitObj.hp -= 100; hitObj.panic = 200; spawnFX(hitObj.x, 20, hitObj.z, 0xc0392b, 10); bumpWanted(1.4); game.kills++ }
  else if (hitKind === 'car') { hitObj.hp -= 22; spawnFX(ex, 16, ez, 0xffd33d, 6); bumpWanted(0.3) }
}

/* ---------- wanted ---------- */
function bumpWanted(n) { game.wanted = clamp(game.wanted + n * 0.34, 0, 5); game.wantedDecay = 0; if (Math.floor(game.wanted) >= 1) ensurePolice() }
function ensurePolice() {
  while (game.police.length < Math.floor(game.wanted)) {
    const ang = rand(0, TWO_PI), d = rand(600, 950)
    const c = mkCar(clamp(game.player.x + Math.cos(ang) * d, 60, WORLD.w - 60), clamp(game.player.z + Math.sin(ang) * d, 60, WORLD.h - 60), { type: 'police' })
    c.color = 0x1d3557; c.driver = {}; game.police.push(c); sfxSiren()
  }
  bump('police')
}
function clearPolice() { game.police.length = 0; bump('police') }

/* ---------- fx ---------- */
function spawnFX(x, y, z, color, n, flash) {
  for (let i = 0; i < n; i++) {
    game.fx.push({ id: nextId(), x, y, z, color,
      vx: flash ? rand(-1, 1) : rand(-2, 2), vy: flash ? rand(-0.5, 0.5) : rand(1, 4), vz: flash ? rand(-1, 1) : rand(-2, 2),
      s: flash ? rand(5, 10) : rand(3, 7), life: flash ? 6 : 30, maxLife: flash ? 6 : 30 })
  }
}

/* ---------- movement / AI ---------- */
function updateFoot() {
  const p = game.player
  const fH = { x: -Math.sin(game.yaw), z: -Math.cos(game.yaw) }
  const rH = { x: Math.cos(game.yaw), z: -Math.sin(game.yaw) }   // D = right, A = left
  let mx = 0, mz = 0
  if (K.up()) { mx += fH.x; mz += fH.z } if (K.down()) { mx -= fH.x; mz -= fH.z }
  if (K.right()) { mx += rH.x; mz += rH.z } if (K.left()) { mx -= rH.x; mz -= rH.z }
  const sp = K.boost() ? 3.0 : 1.9
  if (mx || mz) { const l = Math.hypot(mx, mz); mx /= l; mz /= l; p.a = Math.atan2(mx, mz); p.vx += mx * sp * 0.5; p.vz += mz * sp * 0.5 }
  p.vx *= 0.78; p.vz *= 0.78; p.x += p.vx; p.z += p.vz
  p.x = clamp(p.x, 14, WORLD.w - 14); p.z = clamp(p.z, 14, WORLD.h - 14)
  resolveBuilding(p); if (p.punchT > 0) p.punchT--
  p.speed = Math.hypot(p.vx, p.vz)
}
function updateCar(c, control) {
  const t = VEHICLE[c.kind === 'bike' ? 'bike' : 'car']
  const maxS = (control && K.boost()) ? t.boost : t.base
  let steer = 0
  if (control) {
    if (K.right()) steer = -1; if (K.left()) steer = 1
    if (K.up()) c.speed += t.accel * (K.boost() ? 1.4 : 1)
    else if (K.down()) c.speed -= 0.06; else c.speed *= 0.975
    if (K.brake()) c.speed *= 0.9
  } else { c.speed += c._ai_accel; c.speed *= 0.985; steer = c._ai_steer }
  c.speed = clamp(c.speed, -1.6, maxS)
  const turn = t.turn * clamp(Math.abs(c.speed) / 2.0, 0, 1.2); c.a += steer * turn * (c.speed < 0 ? -1 : 1)
  const fx2 = Math.sin(c.a), fz2 = Math.cos(c.a); c.vx = fx2 * c.speed; c.vz = fz2 * c.speed
  if (control && K.brake() && Math.abs(c.speed) > 1.6) {
    c.vx += Math.cos(c.a) * c.speed * 0.22 * steer; c.vz += -Math.sin(c.a) * c.speed * 0.22 * steer
    if (Math.random() < 0.5) spawnFX(c.x - fx2 * 22, 4, c.z - fz2 * 22, 0x9aa0aa, 1)
  }
  c.x += c.vx; c.z += c.vz; c.x = clamp(c.x, 20, WORLD.w - 20); c.z = clamp(c.z, 20, WORLD.h - 20)
  const probe = { x: c.x, z: c.z, r: 16, speed: c.speed }
  if (resolveBuilding(probe)) { c.x = probe.x; c.z = probe.z; c.speed = probe.speed; if (Math.abs(c.speed) > 1.6) spawnFX(c.x, 14, c.z, 0xffd33d, 5) }
  if (c.honk > 0) c.honk--
}
function aiTraffic(c) {
  c._ai_accel = 0.05
  const nx = c.x + Math.sin(c.a) * 48, nz = c.z + Math.cos(c.a) * 48
  if (!isRoad(nx, nz) || hitBuilding(nx, nz, 16)) { if (!c._flip) c._flip = Math.random() < 0.5 ? -1 : 1; c._ai_steer = c._flip }
  else { c._flip = 0; c._ai_steer = 0 }
  if (c.speed < 0.9) c.speed = 1.0; c.speed = clamp(c.speed, 0, 2.2)
}
function aiPolice(c) {
  const des = Math.atan2(game.player.x - c.x, game.player.z - c.z)
  let diff = ((des - c.a + Math.PI) % TWO_PI) - Math.PI; c._ai_steer = clamp(diff * 2.2, -1, 1); c._ai_accel = 0.1
  c.speed = clamp(c.speed, 0, 4.2); c.siren = (c.siren + 0.25) % TWO_PI
  const d = dist2(c.x, c.z, game.player.x, game.player.z)
  if (d < 42) { if (game.player.inCar) game.player.inCar.hp -= 0.6; else game.player.hp -= 0.5; game.busting += 1; if (Math.random() < 0.05) spawnFX(game.player.x, 16, game.player.z, 0xffd33d, 4) }
}
function carHits(c) {
  const sp = Math.abs(c.speed)
  for (const t of game.peds) { if (t.dead) continue; if (dist2(c.x, c.z, t.x, t.z) < 22) { t.x += c.vx * 1.5; t.z += c.vz * 1.5; t.panic = 200; t.a = Math.atan2(t.x - c.x, t.z - c.z); t.speed = 2.5; if (sp > 1.4) { t.hp -= 40; spawnFX(t.x, 18, t.z, 0xc0392b, 8); if (c === game.player.inCar) bumpWanted(1.2) } } }
  for (const o of game.cars) { if (o === c) continue; const d = dist2(c.x, c.z, o.x, o.z)
    if (d < 40) { const nx = (c.x - o.x) / (d || 1), nz = (c.z - o.z) / (d || 1); c.x += nx * 2; c.z += nz * 2; o.x -= nx * 2; o.z -= nz * 2
      if (sp > 1.6) { spawnFX((c.x + o.x) / 2, 14, (c.z + o.z) / 2, 0xffd33d, 5); c.speed *= 0.6; o.speed *= 0.5; if (c === game.player.inCar) { c.hp -= 2; bumpWanted(0.2) } } } }
}
function updatePed(t) {
  if (t.hp <= 0) { t.dead = true; return }
  if (t.panic > 0) { t.panic--; t.speed = 2.0; t.a = Math.atan2(t.x - game.player.x, t.z - game.player.z) }
  else { if (Math.random() < 0.01) t.a += rand(-1, 1); t.speed = 0.7 }
  const nx = t.x + Math.sin(t.a) * t.speed, nz = t.z + Math.cos(t.a) * t.speed
  if (!hitBuilding(nx, nz, t.r)) { t.x = nx; t.z = nz } else t.a += Math.PI / 2
  t.x = clamp(t.x, 8, WORLD.w - 8); t.z = clamp(t.z, 8, WORLD.h - 8)
}
function updatePickups() {
  const p = game.player
  for (const k of game.pickups) {
    if (k.taken) continue; k.bob += 0.1; k.spin += 0.08
    if (dist2(p.x, p.z, k.x, k.z) < (p.inCar ? 26 : 18)) { k.taken = true; p.money += k.val; toast('+$' + k.val, 700); sfxPickup() }
  }
  if (game.pickups.filter((k) => !k.taken).length < 20 && Math.random() < 0.02) { const rp = findRoadPoint(); game.pickups.push(mkPickup(rp.x, rp.z)); bump('pickups') }
  if (game.mission) {
    game.mission.pulse += 0.08
    if (p.inCar && dist2(p.x, p.z, game.mission.x, game.mission.z) < game.mission.r) {
      p.money += game.mission.reward; game.deliveries++; toast('DELIVERY DONE +$' + game.mission.reward, 1600); sfxDelivery(); newMission()
    }
  }
}
export function respawnPlayer() {
  if (!game.started) return
  const p = game.player
  if (p.inCar) { p.inCar.driver = null; p.inCar.type = 'parked'; p.inCar = null }
  p.hp = 100; p.vx = p.vz = 0; p.speed = 0; const rp = findRoadPoint(); p.x = rp.x; p.z = rp.z
  game.wanted = 0; clearPolice(); game.busting = 0; toast('Respawned', 900)
}
function checkDeath() {
  const p = game.player
  if (p.inCar && p.inCar.hp <= 0) { spawnFX(p.x, 18, p.z, 0xffae42, 16); p.hp -= 30; const c = p.inCar; p.inCar = null; c.type = 'parked'; c.driver = null }
  if (p.hp <= 0) { game.started = false; useGame.getState().setPhase('wasted'); return }
  if (game.busting > 180) { toast('BUSTED', 1500); p.money = Math.floor(p.money * 0.85); respawnPlayer() }
  game.busting = Math.max(0, game.busting - 1)
}

/* ---------- one fixed simulation step ---------- */
function fixedStep() {
  const p = game.player
  if (p.inCar) { updateCar(p.inCar, true); p.x = p.inCar.x; p.z = p.inCar.z; p.a = p.inCar.a; carHits(p.inCar) }
  else updateFoot()
  for (const c of game.cars) { if (c === p.inCar) continue; if (c.type === 'traffic') { aiTraffic(c); updateCar(c, false); carHits(c) } }
  for (const c of game.police) { aiPolice(c); updateCar(c, false); carHits(c) }
  for (const t of game.peds) updatePed(t)
  let removed = false
  for (let i = game.peds.length - 1; i >= 0; i--) { if (game.peds[i].dead && Math.random() < 0.005) { game.peds.splice(i, 1); removed = true } }
  while (game.peds.length < 55 && Math.random() < 0.05) { const rp = findRoadPoint(); game.peds.push(mkPed(rp.x, rp.z)); removed = true }
  if (removed) bump('peds')
  updatePickups()
  game.wantedDecay += 1 / 60
  if (game.wantedDecay > 9 && game.wanted > 0) { game.wanted = Math.max(0, game.wanted - 0.12 / 60); if (Math.floor(game.wanted) < game.police.length) { game.police.pop(); bump('police') } }
  ensurePolice()
  // fx
  for (let i = game.fx.length - 1; i >= 0; i--) {
    const f = game.fx[i]; f.x += f.vx; f.y += f.vy; f.z += f.vz; f.vy -= 0.18; f.vx *= 0.95; f.vz *= 0.95
    if (f.y < 0) { f.y = 0; f.vy *= -0.3 } f.life--
    if (f.life <= 0) game.fx.splice(i, 1)
  }
  checkDeath()
}

// advance simulation with Focus slow-mo via an accumulator (frame-paced).
export function stepWorld(dt) {
  if (!game.started) return
  if (K.focus() && game.focus > 1) { game.focusActive = true; game.focus = Math.max(0, game.focus - 28 * dt); game.timeScale = 0.32 }
  else { game.focusActive = false; game.focus = Math.min(100, game.focus + 10 * dt); game.timeScale = 1 }
  game.simAccum += game.timeScale
  let steps = 0
  while (game.simAccum >= 1 && steps < 3) { fixedStep(); game.simAccum -= 1; steps++ }
}
