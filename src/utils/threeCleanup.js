export function disposeTexture(texture) {
  texture?.dispose()
}

export function disposeMaterial(material) {
  if (!material) return
  Object.values(material).forEach((value) => {
    if (value?.isTexture) disposeTexture(value)
  })
  material.dispose()
}

export function disposeObject3D(object) {
  object?.traverse((child) => {
    child.geometry?.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach(disposeMaterial)
  })
}