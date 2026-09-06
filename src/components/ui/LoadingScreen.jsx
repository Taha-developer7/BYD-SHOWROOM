import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'

function LoadingScreen({ ready }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ready) return undefined
    const tween = gsap.to(ref.current, { yPercent: -100, duration: 0.9, delay: 0.3, ease: 'power4.inOut' })
    return () => tween.kill()
  }, [ready])

  return (
    <div ref={ref} className="loading-screen">
      <p className="wordmark"><span>BYD</span> SHOWROOM</p>
      <div className="loading-line"><i /></div>
      <p>INITIALIZING EXPERIENCE</p>
    </div>
  )
}

export default LoadingScreen
