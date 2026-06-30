import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { game } from '../game/state'
import { useGame } from '../store/useGame'
import { useVehicleTemplates } from './useVehicleTemplates'

// One civilian vehicle: clones the right GLB template and syncs its transform
// from the sim entity every frame (no React state on the hot path).
function CarView({ car, templates }) {
  const ref = useRef<any>(null)
  const obj = useMemo(() => {
    const tpl =
      car.kind === 'bike'
        ? templates.motoTpl
        : templates.carTpls[car.variant % templates.carTpls.length]
    return tpl.clone(true)
  }, [car, templates])
  useFrame(() => {
    if (!ref.current) return
    ref.current.position.set(car.x, 0, car.z)
    ref.current.rotation.y = car.a
  })
  return (
    <group ref={ref}>
      <primitive object={obj} />
    </group>
  )
}

export function Cars() {
  const v = useGame((s) => s.versions.cars)
  const templates = useVehicleTemplates()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => game.cars.slice(), [v])
  return list.map((c) => <CarView key={c.id} car={c} templates={templates} />)
}

// Police keep a procedural, instantly recognisable model with a flashing bar.
function PoliceView({ car }) {
  const ref = useRef<any>(null)
  const bar = useRef<any>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(car.x, 0, car.z)
      ref.current.rotation.y = car.a
    }
    if (bar.current)
      bar.current.material.color.setHex(Math.sin(car.siren * 4) > 0 ? 0xff1133 : 0x1133ff)
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[21, 9, 46]} />
        <meshLambertMaterial color={0x1d3557} />
      </mesh>
      <mesh position={[0, 13, 0]}>
        <boxGeometry args={[20, 6, 40]} />
        <meshLambertMaterial color={0x1d3557} />
      </mesh>
      <mesh position={[0, 18, -2]}>
        <boxGeometry args={[18, 9, 20]} />
        <meshLambertMaterial color={0x121a26} />
      </mesh>
      <mesh ref={bar} position={[0, 26, -2]}>
        <boxGeometry args={[16, 5, 6]} />
        <meshBasicMaterial color={0x1133ff} />
      </mesh>
      {[15, -15].map((lz) =>
        [11, -11].map((lx) => (
          <mesh
            key={`${lz},${lx}`}
            position={[lx, 7, lz]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[7, 7, 6, 14]} />
            <meshLambertMaterial color={0x14151a} />
          </mesh>
        )),
      )}
    </group>
  )
}

export function Police() {
  const v = useGame((s) => s.versions.police)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => game.police.slice(), [v])
  return list.map((c) => <PoliceView key={c.id} car={c} />)
}
