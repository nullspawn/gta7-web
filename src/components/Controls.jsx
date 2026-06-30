import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { game } from '../game/state.js'
import { clamp } from '../game/constants.js'
import { tryEnterExit, doAction, shoot, respawnPlayer } from '../game/systems.js'
import { useGame } from '../store/useGame.js'

// Pointer-lock mouse-look + keyboard + scroll-zoom. Writes to the mutable
// `game` singleton (no React state on the hot path).
export default function Controls() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const el = gl.domElement
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase(); game.keys[k] = true
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
      if (k === 'e') tryEnterExit()
      if (k === 'f') doAction()
      if (k === 'r') respawnPlayer()
      if (k === 'c') game.camDist = game.camDist > 200 ? 110 : game.camDist > 120 ? 260 : 150
    }
    const onKeyUp = (e) => { game.keys[e.key.toLowerCase()] = false }
    const onClick = () => { if (game.started && !game.locked) el.requestPointerLock?.() }
    const onMouseDown = (e) => { if (game.started && game.locked && e.button === 0 && !game.player.inCar) shoot() }
    const onLockChange = () => {
      game.locked = document.pointerLockElement === el
      useGame.getState().setLocked(game.locked)
    }
    const onMouseMove = (e) => {
      if (!game.locked) return
      game.yaw -= (e.movementX || 0) * 0.0024
      game.pitch = clamp(game.pitch - (e.movementY || 0) * 0.0024, -0.25, 1.3)
      game.mouseIdle = 0
    }
    const onWheel = (e) => {
      if (!game.started) return
      e.preventDefault()
      let d = e.deltaY
      if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= innerHeight
      d = clamp(d, -120, 120)
      game.camDist = clamp(game.camDist + d * 0.5, 55, 360)
    }
    addEventListener('keydown', onKeyDown)
    addEventListener('keyup', onKeyUp)
    el.addEventListener('click', onClick)
    addEventListener('mousedown', onMouseDown)
    document.addEventListener('pointerlockchange', onLockChange)
    addEventListener('mousemove', onMouseMove)
    addEventListener('wheel', onWheel, { passive: false })
    return () => {
      removeEventListener('keydown', onKeyDown)
      removeEventListener('keyup', onKeyUp)
      el.removeEventListener('click', onClick)
      removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('pointerlockchange', onLockChange)
      removeEventListener('mousemove', onMouseMove)
      removeEventListener('wheel', onWheel)
    }
  }, [gl])
  return null
}
