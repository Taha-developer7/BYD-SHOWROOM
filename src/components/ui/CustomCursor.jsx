import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    gsap.set([dotRef.current, ringRef.current], { autoAlpha: 0 })
    const move = (event) => { gsap.to(dotRef.current, { x: event.clientX, y: event.clientY, autoAlpha: 1, duration: 0.08 }); gsap.to(ringRef.current, { x: event.clientX, y: event.clientY, autoAlpha: 1, duration: 0.35, ease: 'power3.out' }) }
    const hover = (event) => event.target.closest('a, button') && gsap.to(ringRef.current, { scale: 1.8, borderColor: '#e60012', duration: 0.2 })
    const leave = (event) => event.target.closest('a, button') && gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(255,255,255,.45)', duration: 0.2 })
    window.addEventListener('pointermove', move); window.addEventListener('mouseover', hover); window.addEventListener('mouseout', leave)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('mouseover', hover); window.removeEventListener('mouseout', leave) }
  }, [])
  return <><span ref={dotRef} className="cursor-dot" /><span ref={ringRef} className="cursor-ring" /></>
}

export default CustomCursor