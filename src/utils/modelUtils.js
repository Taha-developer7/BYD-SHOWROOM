import * as THREE from 'three'

export function getModelBounds(model) {
  return new THREE.Box3().setFromObject(model)
}

export function getModelSize(model) {
  return getModelBounds(model).getSize(new THREE.Vector3())
}

export function getModelCenter(model) {
  return getModelBounds(model).getCenter(new THREE.Vector3())
}

export function centerModel(model) {
  model.updateMatrixWorld(true)
  const bounds = getModelBounds(model)
  const center = bounds.getCenter(new THREE.Vector3())
  model.position.x -= center.x
  model.position.y -= bounds.min.y
  model.position.z -= center.z
  model.updateMatrixWorld(true)
  return model
}

export function scaleModelToFit(model, targetSize = 4.8) {
  model.scale.set(1, 1, 1)
  model.updateMatrixWorld(true)
  const size = getModelSize(model)
  const largestDimension = Math.max(size.x, size.y, size.z)

  if (largestDimension > 0) {
    const factor = targetSize / largestDimension
    model.scale.setScalar(factor)
  }
  model.updateMatrixWorld(true)
  return model
}

export function fitAndCenterModel(model, targetSize = 4.8) {
  // 1. Reset transform to accurately sample base geometry
  model.scale.set(1, 1, 1)
  model.position.set(0, 0, 0)
  model.updateMatrixWorld(true)

  // 2. Uniformly scale model so its length matches targetSize
  const rawSize = getModelSize(model)
  const largestDim = Math.max(rawSize.x, rawSize.y, rawSize.z)
  if (largestDim > 0) {
    const scale = targetSize / largestDim
    model.scale.setScalar(scale)
    model.updateMatrixWorld(true)
  }

  // 3. Center horizontally and place wheels firmly on ground plane y = 0
  const bounds = getModelBounds(model)
  const center = bounds.getCenter(new THREE.Vector3())
  model.position.x = -center.x
  model.position.y = -bounds.min.y
  model.position.z = -center.z
  model.updateMatrixWorld(true)

  return model
}

export function frameCamera(camera, model, controls, options = {}) {
  const {
    padding = 1.12,
    cameraElevation = 0.28,
    cameraAngle = 0.85, // Front 3/4 angle
    cameraDistance,
  } = options

  const bounds = getModelBounds(model)
  const size = bounds.getSize(new THREE.Vector3())
  const center = bounds.getCenter(new THREE.Vector3())

  // Center camera focus on vehicle midpoint
  const targetY = bounds.min.y + size.y * 0.42
  controls.target.set(center.x, targetY, center.z)

  let distance = cameraDistance
  if (!distance) {
    const vFovRad = THREE.MathUtils.degToRad(camera.fov)
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * camera.aspect)

    const sphere = bounds.getBoundingSphere(new THREE.Sphere())
    const radius = sphere.radius || (Math.max(size.x, size.y, size.z) / 2)

    // Compute required distance for vertical and horizontal FOVs
    const distV = (radius / Math.sin(vFovRad / 2)) * padding
    const distH = (radius / Math.sin(hFovRad / 2)) * padding

    // Scale to fill 60-75% of the frame
    distance = Math.max(distV, distH) * 0.82
    distance = Math.max(4.5, Math.min(distance, 9.5))
  }

  const dir = new THREE.Vector3(
    Math.sin(cameraAngle),
    cameraElevation,
    Math.cos(cameraAngle),
  ).normalize()

  camera.position.copy(controls.target).addScaledVector(dir, distance)
  camera.near = 0.1
  camera.far = 100
  camera.updateProjectionMatrix()

  controls.minDistance = distance * 0.45
  controls.maxDistance = distance * 2.5
  controls.update()

  return { distance, center, size }
}

export function getModelMetrics(model) {
  const size = getModelSize(model)
  let meshCount = 0
  const materials = new Set()
  const textures = new Set()

  model.traverse((child) => {
    if (!child.isMesh) return
    meshCount += 1
    const materialList = Array.isArray(child.material) ? child.material : [child.material]
    materialList.forEach((material) => {
      if (!material || materials.has(material)) return
      materials.add(material)
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value)
      })
    })
  })

  return {
    meshCount,
    materialCount: materials.size,
    textureCount: textures.size,
    width: size.x,
    height: size.y,
    depth: size.z,
  }
}