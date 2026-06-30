import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { game } from '../game/state.js'

// Pulsing translucent beacon over the current delivery drop-off.
export default function MissionMarker() {
  const ref = useRef()
  useFrame(() => {
    const m = game.mission
    if (!ref.current) return
    ref.current.visible = !!m
    if (!m) return
    ref.current.position.set(m.x, 250, m.z)
    const s = 1 + Math.sin(m.pulse) * 0.06
    ref.current.scale.set(s, 1, s)
    ref.current.rotation.y = m.pulse * 0.5
  })
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[46, 46, 500, 24, 1, true]} />
      <meshBasicMaterial color={0xffd33d} transparent opacity={0.18} side={2} depthWrite={false} />
    </mesh>
  )
}
