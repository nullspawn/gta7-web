import { useEffect } from 'react'
import { useVehicleTemplates } from './useVehicleTemplates'
import { useGame } from '../store/useGame'

// Loads the vehicle GLBs up front (suspends until ready) so the menu's
// "ENTER THE CITY" button can enable only once models are available.
export default function Preloader() {
  useVehicleTemplates()
  const setModelsReady = useGame((s) => s.setModelsReady)
  useEffect(() => {
    setModelsReady(true)
  }, [setModelsReady])
  return null
}
