import { useMemo, useState } from 'react'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const categories = ['ALL', 'SEDAN', 'SUV', 'HATCHBACK', 'MPV', 'PERFORMANCE']

function categoryFor(vehicle) {
  const name = vehicle.name
  if (/DOLPHIN|SEAGULL|ATTO 2/.test(name)) return 'HATCHBACK'
  if (/ATTO 3|SEAL U|SEALION|TANG|YANGWANG U8/.test(name)) return 'SUV'
  if (/M6|ETP3/.test(name)) return 'MPV'
  if (/YANGWANG U7|YANGWANG U9|SEAL 06 GT/.test(name)) return 'PERFORMANCE'
  return 'SEDAN'
}

function ModelExplorer({ vehicles, selectedId, onSelect }) {
  const [category, setCategory] = useState('ALL')
  const filtered = useMemo(
    () => (category === 'ALL' ? vehicles : vehicles.filter((vehicle) => (vehicle.category || categoryFor(vehicle)) === category)),
    [category, vehicles],
  )

  return (
    <section id="explorer" className="section section--explorer">
      <Container>
        <SectionHeading
          eyebrow="THE GARAGE / 08"
          title={<>FIND YOUR<br /><em>NEXT VEHICLE.</em></>}
          copy="Explore the complete BYD electric portfolio. Select any vehicle to inspect its full 3D interactive model."
        />
        <div className="filter-row">
          {categories.map((item) => (
            <button
              className={category === item ? 'is-active' : ''}
              type="button"
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="model-grid">
          {filtered.map((vehicle, index) => {
            const isSelected = selectedId === vehicle.id
            return (
              <button
                className={`model-card ${isSelected ? 'is-active' : ''}`}
                type="button"
                key={vehicle.id}
                onClick={() => onSelect(vehicle.id)}
              >
                <span className="model-card-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="model-card-info">
                  <div className="flex items-center gap-2">
                    <strong>{vehicle.name}</strong>
                    {isSelected && <span className="active-pill">ACTIVE 3D</span>}
                  </div>
                  <small>
                    {vehicle.year} • {vehicle.category || categoryFor(vehicle)}
                    {vehicle.specs?.range && ` • ${vehicle.specs.range}`}
                    {vehicle.specs?.acceleration && ` • ${vehicle.specs.acceleration}`}
                  </small>
                </div>
                <b className="model-card-arrow">↗</b>
              </button>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default ModelExplorer