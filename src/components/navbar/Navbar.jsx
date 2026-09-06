import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../animations/gsap'

const links = [
  ['HOME', '#home'],
  ['VEHICLES', '#vehicles'],
  ['TECHNOLOGY', '#technology'],
  ['EXPERIENCE', '#experience'],
  ['ABOUT', '#about'],
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!menuRef.current) return
    gsap.to(menuRef.current, { autoAlpha: open ? 1 : 0, y: open ? 0 : -20, pointerEvents: open ? 'auto' : 'none', duration: 0.35, ease: 'power3.out' })
  }, [open])

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <a className="wordmark" href="#home" aria-label="BYD Showroom home"><span>BYD</span> SHOWROOM</a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="nav-explore" href="#vehicles">EXPLORE <span>↗</span></a>
      <button className={`menu-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}><i /><i /></button>
      <div ref={menuRef} className="mobile-menu">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="#vehicles" onClick={() => setOpen(false)}>EXPLORE ↗</a>
      </div>
    </header>
  )
}

export default Navbar