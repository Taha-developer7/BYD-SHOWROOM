import { useEffect, useRef } from 'react'

function ProgressBar() {
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight
          const progress = max > 0 ? window.scrollY / max : 0
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progress})`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-progress" aria-hidden="true">
      <span ref={barRef} style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
    </div>
  )
}

export default ProgressBar