import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { game } from '../game/state'
import { useGame } from '../store/useGame'

function PickupView({ k }) {
  const ref = useRef<any>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.visible = !k.taken
    ref.current.position.set(k.x, 16 + Math.sin(k.bob) * 4, k.z)
    ref.current.rotation.y = k.spin
  })
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[16, 16, 5]} />
      <meshLambertMaterial color={0x2ecc71} emissive={0x0c5a2c} />
    </mesh>
  )
}

export default function Pickups() {
  const v = useGame((s) => s.versions.pickups)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => game.pickups.slice(), [v])
  return list.map((k) => <PickupView key={k.id} k={k} />)
}
