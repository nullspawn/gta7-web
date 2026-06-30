import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { game } from '../game/state'
import { stepWorld, nearestCar } from '../game/systems'
import { WEAPONS } from '../game/weapons'
import { useGame } from '../store/useGame'

// The single authoritative game-loop component. Advances the simulation each
// frame and pushes a THROTTLED snapshot to the reactive store (~12x/sec) so the
// HUD updates without re-rendering React 60 times a second.
export default function Systems() {
  const acc = useRef(0)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    stepWorld(dt)
    acc.current += dt
    if (acc.current >= 0.08) {
      acc.current = 0
      const p = game.player
      const st = useGame.getState()
      const speed = p.inCar ? Math.abs(p.inCar.speed) / 4.3 : p.speed / 3.0
      const w = game.weapon
      const def = WEAPONS[w.current]
      st.setHud({
        money: p.money,
        wanted: Math.round(game.wanted),
        hp: Math.max(0, Math.round(p.hp)),
        speed: Math.min(1, Math.max(0, speed)),
        focus: Math.round(game.focus),
        deliveries: game.deliveries,
        kills: game.kills,
        inCar: !!p.inCar,
        weaponName: def.name,
        ammo: w.ammo[w.current],
        mag: def.mag,
        reloading: w.reloadT > 0,
        missionTimer: game.mission?.timeLeft ? Math.ceil(game.mission.timeLeft) : 0,
      })
      st.setFocusActive(game.focusActive)
      if (!p.inCar) {
        const c = nearestCar(60)
        st.setPrompt(c ? `Press [E] to take the ${c.kind === 'bike' ? 'motorcycle' : 'car'}` : '')
      } else st.setPrompt('')
    }
  })
  return null
}
