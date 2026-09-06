function VehicleSelector({ vehicles, selectedId, onSelect }) {
  const featuredIds = ['2024-byd-seal', '2024-byd-atto-3', '2024-byd-dolphin', '2024-byd-sealion-7', '2022-byd-han-ev-facelift', '2024-byd-tang']
  const featured = featuredIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter(Boolean)
  return (
    <div className="hero-selector" aria-label="Featured vehicle selector">
      {featured.map((vehicle, index) => <button className={selectedId === vehicle.id ? 'is-active' : ''} key={vehicle.id} type="button" onClick={() => onSelect(vehicle.id)}><span>{String(index + 1).padStart(2, '0')}</span>{vehicle.name.replace('BYD ', '')}</button>)}
    </div>
  )
}

export default VehicleSelector