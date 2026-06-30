import { useEffect, useState } from 'react'
import { useGame } from '../store/useGame'
import type { Toast } from '../store/useGame'
import Minimap from './Minimap'

function Stars({ n }: { n: number }) {
  return (
    <div className="wanted">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'on' : ''}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function HUD() {
  const hud = useGame((s) => s.hud)
  const prompt = useGame((s) => s.prompt)
  const toast = useGame((s) => s.toast)
  const mission = useGame((s) => s.missionInfo)
  const focusActive = useGame((s) => s.focusActive)
  const locked = useGame((s) => s.locked)
  const [shownToast, setShownToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    setShownToast(toast)
    const t = setTimeout(() => setShownToast(null), toast.ms || 1400)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <>
      <div id="hud">
        <div className="panel topleft">
          <div className="money">${hud.money.toLocaleString()}</div>
          <Stars n={hud.wanted} />
          <div className="bar-wrap">
            <div className="bar-label">
              <span>Health</span>
            </div>
            <div className="bar hp">
              <i style={{ width: hud.hp + '%' }} />
            </div>
          </div>
          <div className="bar-wrap">
            <div className="bar-label">
              <span>Speed</span>
            </div>
            <div className="bar speed">
              <i style={{ width: Math.round(hud.speed * 100) + '%' }} />
            </div>
          </div>
          <div className="bar-wrap">
            <div className="bar-label">
              <span>Focus</span>
              <span style={{ opacity: 0.6 }}>Q</span>
            </div>
            <div className="bar focus">
              <i style={{ width: hud.focus + '%' }} />
            </div>
          </div>
        </div>

        <div className="panel mini">
          <Minimap />
        </div>

        <div className="panel mission">
          <h3>
            {mission.title}
            {hud.missionTimer > 0 ? ` · ${hud.missionTimer}s` : ''}
          </h3>
          <p>{mission.desc}</p>
        </div>

        {!hud.inCar && (
          <div className="panel weapon">
            <span className="wname">{hud.weaponName}</span>
            <span className="wammo">
              {hud.reloading ? 'RELOADING…' : `${hud.ammo} / ${hud.mag}`}
            </span>
          </div>
        )}

        <div className="controls">
          <b>Mouse</b> Look · <b>Click</b> Shoot · <b>RMB/G</b> Reload · <b>1-3</b> Weapon ·{' '}
          <b>Scroll</b> Zoom
          <br />
          <b>WASD</b> Move/Drive · <b>E</b> Enter/Exit · <b>Q</b> Focus · <b>Shift</b> Boost ·{' '}
          <b>Space</b> Handbrake
          <br />
          <b>C</b> Camera · <b>F</b> Punch/Honk · <b>R</b> Respawn · <b>Esc</b> Release mouse
        </div>
      </div>

      {locked && !hud.inCar && <div className="crosshair" />}
      <div
        className={'prompt' + (prompt ? ' show' : '')}
        dangerouslySetInnerHTML={{ __html: promptHtml(prompt) }}
      />
      <div className={'toast' + (shownToast ? ' show' : '')}>{shownToast?.text}</div>
      <div className={'focusfx' + (focusActive ? ' on' : '')} />
    </>
  )
}

function promptHtml(p: string) {
  if (!p) return ''
  return p.replace('[E]', '<kbd>E</kbd>')
}
