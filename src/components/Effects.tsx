import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, Color, InstancedMesh } from 'three'
import { game } from '../game/state'

const MAX = 500
const dummy = new Object3D()
const col = new Color()

// All particle FX (blood, sparks, muzzle flash, debris) drawn from one
// InstancedMesh, synced imperatively from game.fx — no React churn per particle.
export default function Effects() {
  const mesh = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (mesh.current) mesh.current.frustumCulled = false
  }, [])
  useFrame(() => {
    const inst = mesh.current
    if (!inst) return
    const fx = game.fx
    const n = Math.min(fx.length, MAX)
    for (let i = 0; i < n; i++) {
      const f = fx[i]
      const k = Math.max(0, f.life / f.maxLife)
      const s = f.s * (0.4 + 0.6 * k)
      dummy.position.set(f.x, f.y, f.z)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, col.setHex(f.color))
    }
    // park unused instances at zero scale
    dummy.scale.set(0, 0, 0)
    dummy.position.set(0, -9999, 0)
    dummy.updateMatrix()
    for (let i = n; i < MAX; i++) inst.setMatrixAt(i, dummy.matrix)
    inst.count = MAX
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, MAX]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
