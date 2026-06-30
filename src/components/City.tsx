import { useMemo } from 'react'
import * as THREE from 'three'
import { WORLD, BLOCK, ROAD } from '../game/constants'
import { game } from '../game/state'
import Trees from './Trees'

const FACADE_BASE = ['#3a4256', '#454d66', '#4a3b50', '#3b4f4c', '#524d3a', '#413a52']

function makeFacade(base) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = base
  g.fillRect(0, 0, 128, 128)
  const grd = g.createLinearGradient(0, 0, 0, 128)
  grd.addColorStop(0, 'rgba(255,255,255,0.06)')
  grd.addColorStop(1, 'rgba(0,0,0,0.18)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const cols = 4,
    rows = 4,
    mar = 10,
    gap = 6
  const cw = (128 - mar * 2 - gap * (cols - 1)) / cols
  const ch = (128 - mar * 2 - gap * (rows - 1)) / rows
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const x = mar + i * (cw + gap),
        y = mar + j * (ch + gap)
      const lit = Math.random() < 0.32
      g.fillStyle = lit
        ? `rgba(255,221,150,${0.55 + Math.random() * 0.4})`
        : `rgba(${(20 + Math.random() * 40) | 0},${(30 + Math.random() * 40) | 0},${(45 + Math.random() * 50) | 0},0.9)`
      g.fillRect(x, y, cw, ch)
      g.strokeStyle = 'rgba(0,0,0,0.35)'
      g.lineWidth = 1.5
      g.strokeRect(x, y, cw, ch)
      g.strokeStyle = 'rgba(0,0,0,0.25)'
      g.beginPath()
      g.moveTo(x + cw / 2, y)
      g.lineTo(x + cw / 2, y + ch)
      g.stroke()
    }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Static city geometry: ground, road grid + lane lines, parks, and buildings
// with per-building window-facade textures. Generated once per run from
// game.cityData (built in startRun()).
export default function City() {
  const data = game.cityData
  const cols = Math.floor(WORLD.w / BLOCK)
  const rows = Math.floor(WORLD.h / BLOCK)

  const facades = useMemo(() => FACADE_BASE.map(makeFacade), [])
  const materials = useMemo(
    () =>
      data.buildings.map((b) => {
        const tex = facades[b.facade].clone()
        tex.needsUpdate = true
        tex.repeat.set(b.repeatX, b.repeatY)
        return new THREE.MeshLambertMaterial({ map: tex })
      }),
    [data, facades],
  )

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[WORLD.w / 2, 0, WORLD.h / 2]} receiveShadow>
        <planeGeometry args={[WORLD.w, WORLD.h]} />
        <meshLambertMaterial color={0x24402c} />
      </mesh>

      {/* roads + lane lines */}
      {Array.from({ length: cols + 1 }, (_, c) => (
        <group key={'v' + c}>
          <mesh position={[c * BLOCK + ROAD / 2, 0.5, WORLD.h / 2]} receiveShadow>
            <boxGeometry args={[ROAD, 1, WORLD.h]} />
            <meshLambertMaterial color={0x2b2b30} />
          </mesh>
          <mesh position={[c * BLOCK + ROAD / 2, 1.0, WORLD.h / 2]}>
            <boxGeometry args={[3, 1, WORLD.h]} />
            <meshLambertMaterial color={0xc8a93a} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: rows + 1 }, (_, r) => (
        <group key={'h' + r}>
          <mesh position={[WORLD.w / 2, 0.5, r * BLOCK + ROAD / 2]} receiveShadow>
            <boxGeometry args={[WORLD.w, 1, ROAD]} />
            <meshLambertMaterial color={0x2b2b30} />
          </mesh>
          <mesh position={[WORLD.w / 2, 1.0, r * BLOCK + ROAD / 2]}>
            <boxGeometry args={[WORLD.w, 1, 3]} />
            <meshLambertMaterial color={0xc8a93a} />
          </mesh>
        </group>
      ))}

      {/* parks */}
      {data.parks.map((p, i) => (
        <mesh key={'p' + i} position={[p.x + p.w / 2, 0.8, p.z + p.h / 2]} receiveShadow>
          <boxGeometry args={[p.w, 1, p.h]} />
          <meshLambertMaterial color={0x2f5e3f} />
        </mesh>
      ))}

      {/* buildings + roof caps */}
      {data.buildings.map((b, i) => (
        <group key={'b' + i}>
          <mesh position={[b.x, b.h / 2, b.z]} material={materials[i]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
          </mesh>
          <mesh position={[b.x, b.h + 3, b.z]}>
            <boxGeometry args={[b.w * 1.02, 6, b.d * 1.02]} />
            <meshLambertMaterial color={0x23262e} />
          </mesh>
        </group>
      ))}

      <Trees trees={data.trees} />
    </group>
  )
}
