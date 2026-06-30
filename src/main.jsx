import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// StrictMode intentionally omitted: its double-invoke of effects/renders fights
// the imperative game loop + singleton world state.
createRoot(document.getElementById('root')).render(<App />)
