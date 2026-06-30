import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'
import { game } from '../game/state'

// On-foot player avatar (hidden while driving). Gun points forward; a punch
// arm pops out briefly when meleeing.
export default function Player() {
  const ref = useRef<Group>(null)
  const arm = useRef<Mesh>(null)
  useFrame(() => {
    const p = game.player
    if (!ref.current) return
    ref.current.visible = !p.inCar
    ref.current.position.set(p.x, 0, p.z)
    ref.current.rotation.y = p.a
    if (arm.current) arm.current.visible = p.punchT > 0
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[10, 14, 8]} />
        <meshLambertMaterial color={0x2b2f3a} />
      </mesh>
      <mesh position={[0, 20, 0]} castShadow>
        <boxGeometry args={[11, 14, 9]} />
        <meshLambertMaterial color={0x2c7be5} />
      </mesh>
      <mesh position={[0, 31, 0]}>
        <boxGeometry args={[8, 8, 8]} />
        <meshLambertMaterial color={0xf1c27d} />
      </mesh>
      {/* pistol */}
      <mesh position={[7, 20, 8]}>
        <boxGeometry args={[4, 4, 14]} />
        <meshLambertMaterial color={0x18181d} />
      </mesh>
      {/* punch arm */}
      <mesh ref={arm} position={[0, 16, 16]}>
        <boxGeometry args={[6, 6, 16]} />
        <meshLambertMaterial color={0xf1c27d} />
      </mesh>
    </group>
  )
}
