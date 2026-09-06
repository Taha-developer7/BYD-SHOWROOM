import { useEffect, useRef } from 'react'

function ThreeScene({ onMount, className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return undefined
    return onMount(containerRef.current)
  }, [onMount])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}

export default ThreeScene