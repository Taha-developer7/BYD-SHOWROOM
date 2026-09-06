import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import Button from '../common/Button'
import Container from '../common/Container'
import ScrollIndicator from '../ui/ScrollIndicator'
import VehicleSelector from './VehicleSelector'

  function Hero({ vehicles, selectedId, selectedVehicle, onSelect, viewer }) {
  const heroRef = useRef(null)
  const copyRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-reveal', { y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.1, delay: 0.35, ease: 'power3.out' })
      gsap.from('.hero-vehicle-frame', { scale: 0.92, autoAlpha: 0, duration: 1.4, delay: 0.45, ease: 'power3.out' })
      gsap.to('.hero-glow', { x: 25, y: -15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      const onMove = (event) => {
        if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) return
        const x = (event.clientX / window.innerWidth - 0.5) * 10
        const y = (event.clientY / window.innerHeight - 0.5) * 8
        gsap.to(copyRef.current, { x: x * -0.5, y: y * -0.5, duration: 0.8, overwrite: true })
        gsap.to('.hero-vehicle-frame', { x, y, duration: 1.2, overwrite: true })
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    }, heroRef)
    return () => context.revert()
  }, [])

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <div className="hero-glow" />
      <div className="hero-grid" />
      <Container className="hero-inner">
        <div ref={copyRef} className="hero-copy">
          <p className="eyebrow hero-reveal">ELECTRIC MOBILITY / REDEFINED</p>
          <h1 className="hero-title hero-reveal">THE FUTURE<br /><em>OF MOTION.</em></h1>
          <p className="hero-description hero-reveal">A new generation of intelligent electric vehicles, designed around performance, cutting-edge Blade battery tech and the freedom to move differently.</p>
          <div className="hero-actions hero-reveal">
            <Button href="#vehicles">EXPLORE COLLECTION</Button>
            <Button href="#technology" variant="ghost">DISCOVER TECH</Button>
          </div>
        </div>

        <div className="hero-vehicle-frame">
          <div className="hero-model-label hero-reveal">
            <div className="flex items-center gap-2">
              <span className="hero-tag">{selectedVehicle.year}</span>
              <span className="hero-category">{selectedVehicle.category || selectedVehicle.type}</span>
            </div>
            <strong>{selectedVehicle.name}</strong>
            {selectedVehicle.tagline && <small className="hero-tagline">{selectedVehicle.tagline}</small>}
            {selectedVehicle.specs && (
              <div className="hero-quick-specs">
                <div>
                  <em>0-100 KM/H</em>
                  <span>{selectedVehicle.specs.acceleration}</span>
                </div>
                <div>
                  <em>RANGE</em>
                  <span>{selectedVehicle.specs.range}</span>
                </div>
                <div>
                  <em>POWER</em>
                  <span>{selectedVehicle.specs.power.split('/')[0]}</span>
                </div>
              </div>
            )}
          </div>
          {viewer}
        </div>

        <div className="hero-bottom hero-reveal">
          <VehicleSelector vehicles={vehicles} selectedId={selectedId} onSelect={onSelect} />
          <p className="hero-note">
            INTERACTIVE 3D SHOWROOM
            <br />
            <span>DRAG TO ORBIT / PINCH TO ZOOM / SWITCH ANGLES</span>
          </p>
        </div>

        <ScrollIndicator />
      </Container>
    </section>
  )
}

export default Hero