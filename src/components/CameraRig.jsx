import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { game } from '../game/state.js'
import { TWO_PI } from '../game/constants.js'

const tmp = new Vector3()

// Third-person orbit camera driven by yaw/pitch/dist from the input layer.
// In a car, gently recenters behind the vehicle when driving forward.
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  useFrame((_, delta) => {
    const p = game.player
    const tx = p.x, ty = p.inCar ? 20 : 26, tz = p.z
    if (p.inCar && (game.keys['w'] || game.keys['arrowup']) && game.mouseIdle > 0.4) {
      const target = p.inCar.a + Math.PI
      const d = ((target - game.yaw + Math.PI) % TWO_PI) - Math.PI
      game.yaw += d * 0.04
    }
    const cp = Math.cos(game.pitch), sp = Math.sin(game.pitch)
    const cx = tx + Math.sin(game.yaw) * cp * game.camDist
    const cy = ty + sp * game.camDist + 18
    const cz = tz + Math.cos(game.yaw) * cp * game.camDist
    camera.position.lerp(tmp.set(cx, cy, cz), 0.18)
    camera.lookAt(tx, ty + 10, tz)
    game.mouseIdle += delta
  })
  return null
}
