import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { game } from '../game/state.js'

// Hemisphere fill + a directional sun whose shadow frustum follows the player,
// so only nearby objects are shadow-mapped (keeps the cost bounded).
export default function Lights() {
  const sun = useRef()
  const target = useRef()
  useFrame(() => {
    const p = game.player
    if (sun.current) sun.current.position.set(p.x + 500, 1000, p.z + 350)
    if (target.current) { target.current.position.set(p.x, 0, p.z); target.current.updateMatrixWorld() }
  })
  return (
    <>
      <hemisphereLight args={[0xdfeeff, 0x3a4a35, 1.25]} />
      <directionalLight
        ref={sun}
        color={0xfff3df}
        intensity={1.5}
        position={[600, 1000, 400]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0006}
        shadow-camera-near={200}
        shadow-camera-far={2800}
        shadow-camera-left={-650}
        shadow-camera-right={650}
        shadow-camera-top={650}
        shadow-camera-bottom={-650}
        target={target.current}
      />
      <object3D ref={target} />
    </>
  )
}
