import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, Group } from 'three'

const url = (f) => `${import.meta.env.BASE_URL}models/${f}`
const CAR_URLS = [url('car_minivan.glb'), url('car_truck.glb')]
const MOTO_URL = url('motorcycle.glb')

// Preload so the start button can gate on readiness.
useGLTF.preload(CAR_URLS[0])
useGLTF.preload(CAR_URLS[1])
useGLTF.preload(MOTO_URL)

// Scale/orient a loaded scene to a target length, centre it, and drop it so the
// wheels rest on y=0. Returns a reusable template group (cloned per vehicle).
function normalize(scene, targetLen) {
  const root = scene.clone(true)
  const size = new Vector3()
  new Box3().setFromObject(root).getSize(size)
  const rotY = size.x > size.z ? Math.PI / 2 : 0
  const s = targetLen / (Math.max(size.x, size.z) || 1)
  root.scale.setScalar(s)
  root.rotation.y = rotY
  const wrap = new Group()
  wrap.add(root)
  const bb = new Box3().setFromObject(wrap)
  const c = new Vector3()
  bb.getCenter(c)
  root.position.x -= c.x
  root.position.z -= c.z
  root.position.y -= bb.min.y
  wrap.traverse((o: any) => {
    if (o.isMesh) {
      o.castShadow = true
      if (o.material && 'metalness' in o.material)
        o.material.metalness = Math.min(o.material.metalness, 0.35)
    }
  })
  return wrap
}

export function useVehicleTemplates() {
  const minivan = useGLTF(CAR_URLS[0])
  const truck = useGLTF(CAR_URLS[1])
  const moto = useGLTF(MOTO_URL)
  return useMemo(
    () => ({
      carTpls: [normalize(minivan.scene, 46), normalize(truck.scene, 50)],
      motoTpl: normalize(moto.scene, 44),
    }),
    [minivan, truck, moto],
  )
}
