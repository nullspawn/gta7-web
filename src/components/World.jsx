import City from './City.jsx'
import Lights from './Lights.jsx'
import { Cars, Police } from './Vehicles.jsx'
import Pedestrians from './Pedestrians.jsx'
import Pickups from './Pickups.jsx'
import Player from './Player.jsx'
import MissionMarker from './MissionMarker.jsx'
import Effects from './Effects.jsx'
import CameraRig from './CameraRig.jsx'
import Systems from './Systems.jsx'

// Everything that exists only while a run is active. Mounted when phase ===
// 'playing' and unmounted otherwise, so each run starts from a fresh city.
export default function World() {
  return (
    <>
      <Lights />
      <City />
      <Cars />
      <Police />
      <Pedestrians />
      <Pickups />
      <Player />
      <MissionMarker />
      <Effects />
      <CameraRig />
      <Systems />
    </>
  )
}
