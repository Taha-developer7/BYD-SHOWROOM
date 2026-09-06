import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import CarViewer from './components/three/CarViewer'
import VehicleShowcase from './components/vehicles/VehicleShowcase'
import ModelExplorer from './components/vehicles/ModelExplorer'
import Technology from './components/technology/Technology'
import Performance from './components/performance/Performance'
import Experience from './components/experience/Experience'
import About from './components/showcase/About'
import CTA from './components/cta/CTA'
import Footer from './components/footer/Footer'
import LoadingScreen from './components/ui/LoadingScreen'
import ProgressBar from './components/ui/ProgressBar'
import CustomCursor from './components/ui/CustomCursor'
import ScrollTop from './components/ui/ScrollTop'
import { technology } from './data/technology'
import { performance } from './data/performance'
import vehicles from './data/vehicles'

function App() {
  const [selectedId, setSelectedId] = useState('2024-byd-seal')
  const [ready, setReady] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const viewerRef = useRef(null)
  const selectedVehicle = useMemo(() => vehicles.find((vehicle) => vehicle.id === selectedId) || vehicles[0], [selectedId])
  const handleViewerStatus = useCallback((status) => {
    if (['ready', 'error', 'webgl-unavailable'].includes(status)) setReady(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(mediaQuery.matches)
    updateMotion()
    mediaQuery.addEventListener('change', updateMotion)
    return () => mediaQuery.removeEventListener('change', updateMotion)
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  useEffect(() => {
    document.title = 'BYD Showroom — Electric Mobility Experience'
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', 'A cinematic interactive 3D electric vehicle showroom demo built with React, Three.js and GSAP.')
  }, [])

  const selectVehicle = useCallback((id) => setSelectedId(id), [])
  const selectVehicleFromExplorer = useCallback((id) => {
    setSelectedId(id)
    window.requestAnimationFrame(() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }))
  }, [])
  const viewer = <CarViewer ref={viewerRef} modelPath={selectedVehicle.model} scale={selectedVehicle.scale} position={selectedVehicle.position} rotation={selectedVehicle.rotation} cameraDistance={selectedVehicle.cameraDistance} cameraHeight={selectedVehicle.cameraHeight} autoRotate={!reducedMotion} onStatusChange={handleViewerStatus} />

  return <>
    <LoadingScreen ready={ready} />
    <ProgressBar progress={scrollProgress} />
    <CustomCursor />
    <Navbar />
    <main>
      <Hero vehicles={vehicles} selectedId={selectedId} selectedVehicle={selectedVehicle} onSelect={selectVehicle} viewer={viewer} />
      <VehicleShowcase vehicles={vehicles} selectedId={selectedId} selectedVehicle={selectedVehicle} onSelect={selectVehicle} />
      <Experience />
      <Technology items={technology} />
      <Performance items={performance} />
      <section className="cinematic-break"><div className="break-grid" /><div><p className="eyebrow">A QUIETER KIND OF POWER</p><h2>MOVE<br /><em>DIFFERENTLY.</em></h2></div><span className="break-side">SCROLL / 06</span></section>
      <ModelExplorer vehicles={vehicles} selectedId={selectedId} onSelect={selectVehicleFromExplorer} />
      <About />
      <CTA />
    </main>
    <Footer />
    <ScrollTop />
  </>
}

export default App
