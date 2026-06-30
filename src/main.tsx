import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { game } from './game/state'
import * as systems from './game/systems'
import { useGame } from './store/useGame'

// StrictMode intentionally omitted: its double-invoke of effects/renders fights
// the imperative game loop + singleton world state.
createRoot(document.getElementById('root')!).render(<App />)

// Opt-in debug handle (dev, or ?debug) for tinkering / automated checks.
if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) {
  ;(window as unknown as { __GTA: unknown }).__GTA = { game, useGame, ...systems }
}
