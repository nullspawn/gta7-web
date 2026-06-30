import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { game } from '../game/state'
import { useGame } from '../store/useGame'

function PedView({ ped }) {
  const ref = useRef<any>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.visible = !ped.dead
    ref.current.position.set(ped.x, 0, ped.z)
    ref.current.rotation.y = ped.a
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[10, 14, 8]} />
        <meshLambertMaterial color={0x2b2f3a} />
      </mesh>
      <mesh position={[0, 20, 0]} castShadow>
        <boxGeometry args={[11, 14, 9]} />
        <meshLambertMaterial color={ped.color} />
      </mesh>
      <mesh position={[0, 31, 0]}>
        <boxGeometry args={[8, 8, 8]} />
        <meshLambertMaterial color={0xf1c27d} />
      </mesh>
    </group>
  )
}

export default function Pedestrians() {
  const v = useGame((s) => s.versions.peds)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => game.peds.slice(), [v])
  return list.map((p) => <PedView key={p.id} ped={p} />)
}
