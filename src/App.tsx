import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Color, Fog } from 'three'
import { useGame } from './store/useGame'
import { startRun } from './game/systems'
import Controls from './components/Controls'
import Preloader from './components/Preloader'
import World from './components/World'
import HUD from './ui/HUD'
import Overlay from './ui/Overlay'

const SKY = 0xaecae8

export default function App() {
  const phase = useGame((s) => s.phase)
  const modelsReady = useGame((s) => s.modelsReady)

  // Optional ?autostart=1 — jump straight into a run once models are ready.
  useEffect(() => {
    if (modelsReady && phase === 'menu' && new URLSearchParams(location.search).has('autostart'))
      startRun()
  }, [modelsReady, phase])

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ fov: 62, near: 0.5, far: 9000, position: [0, 80, 160] }}
        onCreated={({ scene, gl }) => {
          scene.background = new Color(SKY)
          scene.fog = new Fog(SKY, 1200, 3200)
          gl.toneMappingExposure = 1.25
        }}
      >
        <Suspense fallback={null}>
          <Preloader />
          {phase === 'playing' && <World />}
        </Suspense>
        <Controls />
      </Canvas>

      {phase === 'playing' && <HUD />}
      {phase !== 'playing' && <Overlay />}
    </>
  )
}
