import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { gsap } from '../../animations/gsap'
import { animateModelIn, animateModelOut } from '../../animations/modelAnimations'
import { loadCachedModel } from '../../utils/modelCache'
import {
  fitAndCenterModel,
  frameCamera,
  getModelMetrics,
} from '../../utils/modelUtils'
import ModelLoading from '../ui/ModelLoading'
import ThreeScene from './ThreeScene'

const DEFAULT_CONFIG = { scale: 4.8, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

// Generate realistic radial contact shadow texture for the showroom floor
function createContactShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 240)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)')
  gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)')
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const CarViewer = forwardRef(function CarViewer({
  modelPath,
  scale = DEFAULT_CONFIG.scale,
  position = DEFAULT_CONFIG.position,
  rotation = DEFAULT_CONFIG.rotation,
  cameraDistance,
  cameraHeight,
  autoRotate = false,
  onDebugChange,
  onStatusChange,
}, ref) {
  const containerRef = useRef(null)
  const sceneApiRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(true)
  const [activePreset, setActivePreset] = useState('front')
  const [isRotating, setIsRotating] = useState(autoRotate)

  const report = useCallback((patch) => {
    onDebugChange?.(patch)
  }, [onDebugChange])

  const setupScene = useCallback((container) => {
    containerRef.current = container
    if (!supportsWebGL()) {
      setWebglAvailable(false)
      onStatusChange?.('webgl-unavailable')
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    const controls = new OrbitControls(camera, renderer.domElement)
    const modelGroup = new THREE.Group()

    // Environment & PMREM Studio Lighting for authentic reflections on car paint
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const roomEnv = new RoomEnvironment()
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture

    // Ground & Radial Contact Shadow
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({
        color: 0x050508,
        roughness: 0.82,
        metalness: 0.15,
        transparent: true,
        opacity: 0.65,
      }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.005
    ground.receiveShadow = true

    // Contact shadow mesh directly beneath vehicle tires
    const shadowTexture = createContactShadowTexture()
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 3.4),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    )
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = 0.002

    const state = {
      activePath: null,
      requestedPath: null,
      activeModel: null,
      loadToken: 0,
      autoRotate,
      resumeTimer: null,
      initialCamera: null,
      distance: 6.2,
      target: new THREE.Vector3(0, 0.65, 0),
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'block h-full w-full touch-pan-y'
    container.appendChild(renderer.domElement)

    scene.add(ground, shadowMesh, modelGroup)

    // Lighting setup: studio lights + subtle warm/cool accents
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x11131a, 1.6)
    scene.add(hemiLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(7, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xdfe7f5, 1.8)
    fillLight.position.set(-8, 6, -5)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xff2a38, 3.5, 18)
    rimLight.position.set(4, 2, -6)
    scene.add(rimLight)

    const roofLight = new THREE.PointLight(0xffffff, 2.0, 15)
    roofLight.position.set(0, 5, 0)
    scene.add(roofLight)

    // Controls setup
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = false
    controls.minPolarAngle = THREE.MathUtils.degToRad(30)
    controls.maxPolarAngle = THREE.MathUtils.degToRad(86)
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.65

    const resize = () => {
      const { clientWidth, clientHeight } = container
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, clientWidth < 768 ? 1.5 : 2))
    }

    const setAutoRotate = (enabled) => {
      state.autoRotate = enabled
      controls.autoRotate = enabled
      setIsRotating(enabled)
      report({ autoRotate: enabled })
    }

    const animateCameraTo = (angleRad, elevationRatio = 0.28) => {
      const dist = state.distance || 6.2
      const targetPos = new THREE.Vector3(
        state.target.x + Math.sin(angleRad) * dist,
        state.target.y + dist * elevationRatio,
        state.target.z + Math.cos(angleRad) * dist,
      )

      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.85,
        ease: 'power3.inOut',
      })
      gsap.to(controls.target, {
        x: state.target.x,
        y: state.target.y,
        z: state.target.z,
        duration: 0.85,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      })
    }

    const setPreset = (presetKey) => {
      setActivePreset(presetKey)
      if (presetKey === 'front') animateCameraTo(0.85, 0.28)
      else if (presetKey === 'side') animateCameraTo(Math.PI / 2, 0.16)
      else if (presetKey === 'rear') animateCameraTo(2.35, 0.26)
      else if (presetKey === 'top') animateCameraTo(0.75, 0.92)
    }

    const resetView = () => {
      if (!state.initialCamera) return
      setActivePreset('front')
      gsap.to(camera.position, { ...state.initialCamera.position, duration: 0.65, ease: 'power2.inOut' })
      gsap.to(controls.target, { ...state.initialCamera.target, duration: 0.65, ease: 'power2.inOut', onUpdate: () => controls.update() })
    }

    const loadVehicle = async (nextPath, config = {}) => {
      const token = ++state.loadToken
      state.requestedPath = nextPath
      setLoading(true)
      setError(false)
      setProgress(0)
      onStatusChange?.('loading')

      if (state.activeModel) {
        await animateModelOut(state.activeModel)
        if (token !== state.loadToken) return
        modelGroup.remove(state.activeModel)
        state.activeModel = null
      }

      try {
        const gltf = await loadCachedModel(nextPath, (event) => {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100))
        })
        if (token !== state.loadToken) return

        const pivotGroup = new THREE.Group()
        const model = gltf.scene.clone(true)
        const targetScale = config.scale ?? scale ?? 4.8

        // Calibrate scale and geometry centering onto ground plane
        fitAndCenterModel(model, targetScale)

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material.envMapIntensity = 1.3
              child.material.needsUpdate = true
            }
          }
        })

        pivotGroup.add(model)
        modelGroup.add(pivotGroup)
        state.activeModel = pivotGroup
        state.activePath = nextPath

        const metrics = getModelMetrics(model)
        const frame = frameCamera(camera, model, controls, {
          cameraDistance: config.cameraDistance ?? cameraDistance,
          cameraHeight: config.cameraHeight ?? cameraHeight,
        })

        state.distance = frame.distance
        state.target.copy(controls.target)
        state.initialCamera = {
          position: camera.position.clone(),
          target: controls.target.clone(),
        }

        animateModelIn(pivotGroup)
        setLoading(false)
        onStatusChange?.('ready')
        report({ model: nextPath, status: 'READY', ...metrics, currentScale: targetScale, distance: frame.distance })
      } catch (loadError) {
        if (token !== state.loadToken) return
        console.error(`Unable to load 3D model: ${nextPath}`, loadError)
        setLoading(false)
        setError(true)
        onStatusChange?.('error')
        report({ model: nextPath, status: 'ERROR' })
      }
    }

    const onStart = () => {
      window.clearTimeout(state.resumeTimer)
      if (state.autoRotate) controls.autoRotate = false
    }
    const onEnd = () => {
      window.clearTimeout(state.resumeTimer)
      if (state.autoRotate) {
        state.resumeTimer = window.setTimeout(() => {
          controls.autoRotate = true
        }, 2000)
      }
    }
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)

    resize()
    window.addEventListener('resize', resize)
    sceneApiRef.current = {
      loadVehicle,
      resetView,
      setAutoRotate,
      setPreset,
      enterFullscreen: () => {
        const target = container.parentElement || container
        if (!document.fullscreenElement) {
          target.requestFullscreen?.()
        } else {
          document.exitFullscreen?.()
        }
      },
      get requestedPath() { return state.requestedPath },
    }
    loadVehicle(modelPath, { scale, position, rotation, cameraDistance, cameraHeight })

    let animationFrameId
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.clearTimeout(state.resumeTimer)
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      window.cancelAnimationFrame(animationFrameId)
      controls.dispose()
      pmremGenerator.dispose()
      roomEnv.dispose()
      shadowTexture?.dispose()
      shadowMesh.geometry.dispose()
      shadowMesh.material.dispose()
      ground.geometry.dispose()
      ground.material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      sceneApiRef.current = null
    }
  }, [autoRotate, cameraDistance, cameraHeight, modelPath, onStatusChange, position, report, rotation, scale])

  useEffect(() => {
    if (sceneApiRef.current && sceneApiRef.current.requestedPath !== modelPath) {
      sceneApiRef.current.loadVehicle(modelPath, { scale, position, rotation, cameraDistance, cameraHeight })
    }
  }, [cameraDistance, cameraHeight, modelPath, position, rotation, scale])

  useEffect(() => {
    sceneApiRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  useImperativeHandle(ref, () => ({
    resetView: () => sceneApiRef.current?.resetView(),
    setPreset: (preset) => sceneApiRef.current?.setPreset(preset),
    toggleRotate: () => sceneApiRef.current?.setAutoRotate(!isRotating),
    enterFullscreen: () => sceneApiRef.current?.enterFullscreen(),
  }), [isRotating])

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <ThreeScene onMount={setupScene} className="h-full w-full" />

      {!webglAvailable && (
        <div className="absolute inset-0 grid place-items-center bg-black/90 p-6 text-center text-red-400">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-widest uppercase">3D Engine Unavailable</p>
            <p className="text-xs text-zinc-500">WebGL hardware acceleration is required.</p>
          </div>
        </div>
      )}

      {loading && webglAvailable && <ModelLoading progress={progress} />}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center text-red-200">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.2em] text-red-400 uppercase">3D Model Could Not Be Loaded</p>
            <button
              type="button"
              className="border border-red-500/60 bg-red-500/10 px-5 py-2 text-[10px] tracking-[0.24em] text-white hover:bg-red-500/20 transition-colors uppercase"
              onClick={() => sceneApiRef.current?.loadVehicle(modelPath)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D Showroom HUD Controls */}
      <div className="absolute bottom-5 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Presets */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-md pointer-events-auto">
          <span className="px-2 text-[9px] font-semibold tracking-[0.22em] text-zinc-400 uppercase hidden sm:inline-block">VIEW</span>
          {[
            ['front', '3/4 ANGLE'],
            ['side', 'PROFILE'],
            ['rear', 'REAR'],
            ['top', 'AERO'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActivePreset(key)
                sceneApiRef.current?.setPreset(key)
              }}
              className={`rounded-full px-2.5 py-1 text-[9px] tracking-[0.16em] uppercase transition-all duration-200 ${
                activePreset === key
                  ? 'bg-red-600 text-white font-semibold shadow-[0_0_10px_rgba(230,0,18,0.5)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* View Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            title="Toggle Auto-Rotation"
            aria-label="Toggle Auto-Rotation"
            onClick={() => {
              const next = !isRotating
              setIsRotating(next)
              sceneApiRef.current?.setAutoRotate(next)
            }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] tracking-[0.18em] uppercase backdrop-blur-md transition-all duration-200 ${
              isRotating
                ? 'border-red-500/60 bg-red-500/20 text-red-300 shadow-[0_0_12px_rgba(230,0,18,0.3)]'
                : 'border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${isRotating ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
            <span>ROTATE</span>
          </button>

          <button
            type="button"
            title="Reset View"
            aria-label="Reset View"
            onClick={() => sceneApiRef.current?.resetView()}
            className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] tracking-[0.18em] uppercase text-zinc-400 backdrop-blur-md hover:border-white/30 hover:text-white transition-all duration-200"
          >
            RESET
          </button>

          <button
            type="button"
            title="Fullscreen"
            aria-label="Fullscreen"
            onClick={() => sceneApiRef.current?.enterFullscreen()}
            className="hidden sm:inline-flex rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] tracking-[0.18em] uppercase text-zinc-400 backdrop-blur-md hover:border-white/30 hover:text-white transition-all duration-200"
          >
            EXPAND
          </button>
        </div>
      </div>
    </div>
  )
})

export default CarViewer
