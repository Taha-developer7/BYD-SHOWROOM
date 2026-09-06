import { useEffect, useState } from 'react'

function ScrollTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 700); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  return <button className={`scroll-top ${visible ? 'is-visible' : ''}`} type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
}

export default ScrollTop