import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

function Technology({ items }) {
  const sectionRef = useRef(null)
  useEffect(() => {
    const context = gsap.context(() => gsap.from('.tech-card', { y: 70, autoAlpha: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true } }), sectionRef)
    return () => context.revert()
  }, [])
  return <section id="technology" ref={sectionRef} className="section section--technology"><Container><SectionHeading eyebrow="THE SYSTEM / 04" title={<>BUILT FOR<br /><em>WHAT'S NEXT.</em></>} copy="Intelligent technology meets electric performance in a platform designed for the everyday future." /><div className="tech-grid">{items.map((item) => <article className="tech-card" key={item.number}><span className="tech-number">{item.number}</span><span className="tech-mark">{item.mark}</span><h3>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3><p>{item.copy}</p><b>↗</b></article>)}</div></Container></section>
}

export default Technology