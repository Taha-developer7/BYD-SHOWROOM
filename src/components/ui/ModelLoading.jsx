function ModelLoading({ progress = 0 }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center justify-between text-[10px] tracking-[0.26em] uppercase text-zinc-400">
          <span>INITIALIZING 3D ASSETS</span>
          <span className="font-mono text-red-500 font-semibold">{progress}%</span>
        </div>
        <div className="h-[2px] w-full overflow-hidden bg-zinc-800/80 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200 shadow-[0_0_12px_rgba(230,0,18,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
          CALIBRATING LIGHTING &amp; MATERIALS
        </p>
      </div>
    </div>
  )
}

export default ModelLoading