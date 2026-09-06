import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import Button from '../common/Button'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

function VehicleShowcase({ vehicles, selectedId, selectedVehicle, onSelect }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.showcase-reveal', {
        y: 45,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
      })
    }, sectionRef)
    return () => context.revert()
  }, [])

  const specs = selectedVehicle.specs || {
    acceleration: '3.8s',
    range: '570 km',
    power: '390 kW / 530 hp',
    battery: '82.5 kWh Blade',
    drivetrain: 'AWD Dual Motor',
    topSpeed: '180 km/h',
  }

  return (
    <section id="vehicles" ref={sectionRef} className="section section--showcase">
      <Container>
        <SectionHeading
          eyebrow="THE COLLECTION / 01"
          title={<>EXPLORE<br /><em>THE LINEUP.</em></>}
          copy="A considered range of pure electric and super-hybrid vehicles engineered for power, intelligence and sustained range."
        />

        <div className="showcase-layout showcase-reveal">
          {/* Technical Specs Dashboard */}
          <div className="showcase-spec-card">
            <div className="spec-card-header">
              <span className="eyebrow">{selectedVehicle.category || selectedVehicle.type}</span>
              <span className="spec-model-year">{selectedVehicle.year}</span>
            </div>
            <h3 className="spec-model-name">{selectedVehicle.name}</h3>
            <p className="spec-model-tagline">{selectedVehicle.tagline || 'Leading the world transition to intelligent electric mobility.'}</p>

            <div className="spec-metrics-grid">
              <div className="spec-metric-item">
                <span className="metric-label">0–100 KM/H</span>
                <strong className="metric-value">{specs.acceleration}</strong>
                <small className="metric-sub">Acceleration</small>
              </div>
              <div className="spec-metric-item">
                <span className="metric-label">ELECTRIC RANGE</span>
                <strong className="metric-value">{specs.range}</strong>
                <small className="metric-sub">Certified CLTC/WLTP</small>
              </div>
              <div className="spec-metric-item">
                <span className="metric-label">MAX POWER</span>
                <strong className="metric-value">{specs.power.split('/')[0]}</strong>
                <small className="metric-sub">{specs.power.split('/')[1] || 'Output'}</small>
              </div>
              <div className="spec-metric-item">
                <span className="metric-label">BATTERY TECH</span>
                <strong className="metric-value">{specs.battery.split(' ')[0]} {specs.battery.split(' ')[1]}</strong>
                <small className="metric-sub">BYD Blade Cell</small>
              </div>
              <div className="spec-metric-item">
                <span className="metric-label">DRIVETRAIN</span>
                <strong className="metric-value">{specs.drivetrain}</strong>
                <small className="metric-sub">Architecture</small>
              </div>
              <div className="spec-metric-item">
                <span className="metric-label">TOP SPEED</span>
                <strong className="metric-value">{specs.topSpeed}</strong>
                <small className="metric-sub">Track Velocity</small>
              </div>
            </div>
          </div>

          <div className="showcase-details">
            <p className="eyebrow">{selectedVehicle.year} / {selectedVehicle.type}</p>
            <h3>{selectedVehicle.name}</h3>
            <p>
              Engineered with BYD&apos;s proprietary Blade Battery and Cell-to-Body (CTB) integration.
              Experience dynamic balance, instantaneous dual-motor torque, and refined aerodynamic efficiency
              in our high-fidelity 3D interactive viewer.
            </p>
            <div className="flex items-center gap-4">
              <Button href="#home">VIEW IN 3D SHOWROOM</Button>
              <Button href="#technology" variant="secondary">EXPLORE TECH</Button>
            </div>
          </div>
        </div>

        {/* Extended Vehicle Lineup Strip */}
        <div className="lineup-strip showcase-reveal">
          {vehicles.slice(0, 10).map((vehicle) => (
            <button
              className={selectedId === vehicle.id ? 'is-active' : ''}
              key={vehicle.id}
              type="button"
              onClick={() => onSelect(vehicle.id)}
            >
              <span>{vehicle.year} • {vehicle.category || 'EV'}</span>
              {vehicle.name.replace('BYD ', '')}
              <i />
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default VehicleShowcase