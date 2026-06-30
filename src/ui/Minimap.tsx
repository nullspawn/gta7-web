import { useEffect, useRef } from 'react'
import { game } from '../game/state'
import { BLOCK, ROAD, TWO_PI } from '../game/constants'

// Top-down minimap drawn on its own rAF loop straight from the world singleton.
export default function Minimap() {
  const ref = useRef<any>(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const W = cv.width,
      H = cv.height
    let raf
    const draw = () => {
      const p = game.player
      ctx.clearRect(0, 0, W, H)
      const range = 1400,
        scl = W / range
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.strokeStyle = 'rgba(120,130,150,0.4)'
      ctx.lineWidth = 2
      const sC = Math.floor((p.x - range / 2) / BLOCK),
        eC = Math.ceil((p.x + range / 2) / BLOCK)
      for (let c = sC; c <= eC; c++) {
        const x = (c * BLOCK + ROAD / 2 - p.x) * scl
        ctx.beginPath()
        ctx.moveTo(x, -H / 2)
        ctx.lineTo(x, H / 2)
        ctx.stroke()
      }
      const sR = Math.floor((p.z - range / 2) / BLOCK),
        eR = Math.ceil((p.z + range / 2) / BLOCK)
      for (let r = sR; r <= eR; r++) {
        const y = (r * BLOCK + ROAD / 2 - p.z) * scl
        ctx.beginPath()
        ctx.moveTo(-W / 2, y)
        ctx.lineTo(W / 2, y)
        ctx.stroke()
      }
      ctx.fillStyle = '#2ecc71'
      for (const k of game.pickups) {
        if (k.taken) continue
        const dx = (k.x - p.x) * scl,
          dy = (k.z - p.z) * scl
        if (Math.abs(dx) < W / 2 && Math.abs(dy) < H / 2) ctx.fillRect(dx - 1, dy - 1, 3, 3)
      }
      ctx.fillStyle = '#3b6bff'
      for (const c of game.police) {
        const dx = (c.x - p.x) * scl,
          dy = (c.z - p.z) * scl
        if (Math.abs(dx) < W / 2 && Math.abs(dy) < H / 2) {
          ctx.beginPath()
          ctx.arc(dx, dy, 3, 0, TWO_PI)
          ctx.fill()
        }
      }
      if (game.mission) {
        const dx = Math.max(-W / 2 + 5, Math.min(W / 2 - 5, (game.mission.x - p.x) * scl))
        const dy = Math.max(-H / 2 + 5, Math.min(H / 2 - 5, (game.mission.z - p.z) * scl))
        ctx.fillStyle = '#ffd33d'
        ctx.beginPath()
        ctx.arc(dx, dy, 4, 0, TWO_PI)
        ctx.fill()
      }
      ctx.save()
      ctx.rotate(-game.yaw + Math.PI)
      ctx.fillStyle = p.inCar ? '#6dffa0' : '#fff'
      ctx.beginPath()
      ctx.moveTo(0, -6)
      ctx.lineTo(4, 5)
      ctx.lineTo(-4, 5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      ctx.restore()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, W - 2, H - 2)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} width={168} height={168} />
}
