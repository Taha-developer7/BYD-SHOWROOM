import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const modelCache = new Map()

export function loadCachedModel(modelPath, onProgress) {
  if (!modelCache.has(modelPath)) {
    const loader = new GLTFLoader()
    const promise = new Promise((resolve, reject) => {
      loader.load(modelPath, resolve, onProgress, reject)
    }).catch((error) => {
      modelCache.delete(modelPath)
      throw error
    })
    modelCache.set(modelPath, promise)
  }
  return modelCache.get(modelPath)
}

export function hasCachedModel(modelPath) {
  return modelCache.has(modelPath)
}