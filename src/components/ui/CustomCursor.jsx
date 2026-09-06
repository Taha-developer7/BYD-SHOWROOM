import { useEffect, useRef } from 'react'

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isHovered = false
    let isVisible = false
    let rafId

    const onPointerMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
    }

    const onPointerLeave = () => {
      isVisible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        isHovered = true
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        isHovered = false
      }
    }

    const tick = () => {
      // Instant direct update for core dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      // Smooth buttery lerp for outer ring
      ringX += (mouseX - ringX) * 0.22
      ringY += (mouseY - ringY) * 0.22

      if (ringRef.current) {
        const scale = isHovered ? 1.7 : 1
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`
        ringRef.current.style.borderColor = isHovered ? '#e60012' : 'rgba(255, 255, 255, 0.45)'
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mouseout', onMouseOut, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <span ref={dotRef} className="cursor-dot" style={{ opacity: 0, willChange: 'transform' }} />
      <span ref={ringRef} className="cursor-ring" style={{ opacity: 0, willChange: 'transform' }} />
    </>
  )
}

export default CustomCursor