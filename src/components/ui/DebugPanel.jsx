function DebugPanel({ data }) {
  const rows = [
    ['MODEL', data.model?.replace('/models/', '') || 'NONE'],
    ['MODEL STATUS', data.status || 'WAITING'],
    ['MESH COUNT', data.meshCount ?? '-'],
    ['MODEL WIDTH', data.width ? data.width.toFixed(2) : '-'],
    ['MODEL HEIGHT', data.height ? data.height.toFixed(2) : '-'],
    ['MODEL DEPTH', data.depth ? data.depth.toFixed(2) : '-'],
    ['CURRENT SCALE', data.currentScale ?? '-'],
    ['AUTO ROTATE', data.autoRotate ? 'ON' : 'OFF'],
    ['WEBGL STATUS', data.webgl || 'AVAILABLE'],
  ]

  return (
    <aside className="border border-slate-800 bg-slate-900/60 p-4 text-[10px] uppercase tracking-[0.15em] text-slate-400">
      <h2 className="mb-3 text-xs text-slate-200">Debug information</h2>
      <dl className="space-y-2">
        {rows.map(([label, value]) => <div className="flex justify-between gap-4" key={label}><dt>{label}</dt><dd className="max-w-[55%] truncate text-right text-cyan-200">{value}</dd></div>)}
      </dl>
    </aside>
  )
}

export default DebugPanel