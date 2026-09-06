function VehicleSwitcher({ vehicles, selectedId, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Select Vehicle</p>
      <div className="grid max-h-[30rem] gap-2 overflow-y-auto pr-1">
        {vehicles.map((vehicle) => (
          <button
            className={`border px-3 py-3 text-left text-xs uppercase tracking-[0.12em] transition-colors ${selectedId === vehicle.id ? 'border-cyan-300 bg-cyan-300/10 text-cyan-100' : 'border-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'}`}
            key={vehicle.id}
            type="button"
            onClick={() => onSelect(vehicle.id)}
          >
            <span className="block">{vehicle.name}</span>
            <span className="mt-1 block text-[10px] text-slate-500">{vehicle.year} / {vehicle.type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default VehicleSwitcher