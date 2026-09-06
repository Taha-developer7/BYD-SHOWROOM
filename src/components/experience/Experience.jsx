import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const cards = [
  ['01', 'SILENT POWER', 'Performance that arrives without the noise.'],
  ['02', 'INTELLIGENT CONTROL', 'Technology that feels present when you need it.'],
  ['03', 'CONNECTED LIVING', 'A vehicle that moves with the rhythm of your life.'],
]

function Experience() {
  const sectionRef = useRef(null)
  useEffect(() => {
    const context = gsap.context(() => gsap.from('.experience-card', { y: 55, autoAlpha: 0, stagger: 0.12, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true } }), sectionRef)
    return () => context.revert()
  }, [])
  return <section id="experience" ref={sectionRef} className="section section--experience"><Container><SectionHeading eyebrow="THE EXPERIENCE / 03" title={<>MOVE<br /><em>DIFFERENTLY.</em></>} copy="A more considered relationship with the road, the city and the moment." /><div className="experience-grid">{cards.map(([number, title, copy]) => <article className="experience-card" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><b>↗</b></article>)}</div></Container></section>
}

export default Experience