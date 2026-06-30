import { useGame } from '../store/useGame.js'
import { startRun } from '../game/systems.js'

// Menu (phase 'menu') and game-over (phase 'wasted') screen.
export default function Overlay() {
  const phase = useGame((s) => s.phase)
  const modelsReady = useGame((s) => s.modelsReady)
  const hud = useGame((s) => s.hud)
  const wasted = phase === 'wasted'

  return (
    <>
      <div className="overlay">
        <h1>{wasted ? 'WASTED' : 'GTA 7'}</h1>
        <div className="sub">
          {wasted
            ? `Banked $${hud.money.toLocaleString()} · ${hud.deliveries} deliveries · ${hud.kills} KOs`
            : 'Liberty Streets · React + R3F'}
        </div>
        <button disabled={!modelsReady} onClick={() => startRun()}>
          {modelsReady ? (wasted ? 'RESPAWN' : 'ENTER THE CITY') : 'LOADING MODELS…'}
        </button>
        {!wasted && (
          <div className="keys">
            <b>Move mouse</b> to look · <b>Click</b> to shoot on foot · <b>WASD / Arrows</b> move &amp; drive · <b>E</b> enter / exit<br />
            <b>Q</b> Focus slow-mo · <b>Shift</b> boost · <b>Space</b> handbrake · <b>C</b> camera · <b>F</b> punch / honk · <b>R</b> respawn<br />
            Cars &amp; motorcycles to steal · collect cash · complete drop-offs · evade the cops.
          </div>
        )}
      </div>
      <div className="byline">an AI-driven Bappi build · React + react-three-fiber · made with Kitten Bot</div>
    </>
  )
}
