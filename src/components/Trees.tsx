import { useMemo } from 'react'
import type { TreeData } from '../game/types'

const GREENS = [0x2e7d4f, 0x35935b, 0x287045]

// Low-poly trees: a tapered trunk + a few icosahedron foliage blobs.
export default function Trees({ trees }: { trees: TreeData[] }) {
  const built = useMemo(
    () =>
      trees.map((t) => {
        const th = (55 + Math.random() * 40) * t.scale
        const blobs = Array.from({ length: 3 }, (_, i: number) => ({
          r: (26 + Math.random() * 14) * t.scale,
          x: -10 + Math.random() * 20,
          y: th + (-6 + Math.random() * 20),
          z: -10 + Math.random() * 20,
          c: GREENS[i % 3],
        }))
        return { ...t, th, blobs }
      }),
    [trees],
  )
  return (
    <group>
      {built.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.th / 2, 0]} castShadow>
            <cylinderGeometry args={[9, 11, t.th, 6]} />
            <meshLambertMaterial color={0x6b4a2b} />
          </mesh>
          {t.blobs.map((b, j) => (
            <mesh key={j} position={[b.x, b.y, b.z]} castShadow>
              <icosahedronGeometry args={[b.r, 1]} />
              <meshLambertMaterial color={b.c} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
