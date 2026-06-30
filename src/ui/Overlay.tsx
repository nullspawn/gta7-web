import { useGame } from '../store/useGame'
import { startRun } from '../game/systems'
import Settings from './Settings'

// Menu (phase 'menu') and game-over (phase 'wasted') screen.
export default function Overlay() {
  const phase = useGame((s) => s.phase)
  const modelsReady = useGame((s) => s.modelsReady)
  const hud = useGame((s) => s.hud)
  const profile = useGame((s) => s.profile)
  const showSettings = useGame((s) => s.showSettings)
  const toggleSettings = useGame((s) => s.toggleSettings)
  const wasted = phase === 'wasted'

  return (
    <>
      <div className="overlay">
        <h1>{wasted ? 'WASTED' : 'GTA 7'}</h1>
        <div className="sub">
          {wasted
            ? `Banked $${hud.money.toLocaleString()} · ${hud.deliveries} deliveries · ${hud.kills} KOs`
            : 'Liberty Streets · React + R3F'}
        </div>

        {showSettings ? (
          <Settings />
        ) : (
          <>
            <button disabled={!modelsReady} onClick={() => startRun()}>
              {modelsReady ? (wasted ? 'RESPAWN' : 'ENTER THE CITY') : 'LOADING MODELS…'}
            </button>
            <div className="profile">
              Best&nbsp;${profile.bestMoney.toLocaleString()} · {profile.totalDeliveries} deliveries
              · {profile.totalKills} KOs · {profile.runs} runs
            </div>
            {!wasted && (
              <div className="keys">
                <b>Move mouse</b> to look · <b>Click</b> shoot · <b>RMB/G</b> reload · <b>1-3</b>{' '}
                weapons · <b>WASD</b> move &amp; drive · <b>E</b> enter / exit
                <br />
                <b>Q</b> Focus slow-mo · <b>Shift</b> boost · <b>Space</b> handbrake · <b>C</b>{' '}
                camera · <b>F</b> punch / honk · <b>R</b> respawn
                <br />
                Cars &amp; motorcycles to steal · collect cash · complete missions · evade the cops.
              </div>
            )}
          </>
        )}

        <button className="link-btn" onClick={() => toggleSettings()}>
          {showSettings ? '← Back' : '⚙ Settings'}
        </button>
      </div>
      <div className="byline">
        an AI-driven Bappi build · React + react-three-fiber · made with Kitten Bot
      </div>
    </>
  )
}
