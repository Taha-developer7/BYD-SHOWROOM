import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

function Performance({ items }) {
  const sectionRef = useRef(null)
  useEffect(() => {
    const context = gsap.context(() => gsap.from('.performance-metric', { x: -30, autoAlpha: 0, stagger: 0.1, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true } }), sectionRef)
    return () => context.revert()
  }, [])
  return <section ref={sectionRef} className="section section--performance"><Container><SectionHeading eyebrow="THE FEELING / 05" title={<>ENGINEERED<br /><em>TO MOVE.</em></>} copy="Conceptual markers for an electric experience that feels immediate, quiet and alive." /><div className="performance-grid">{items.map((item) => <div className="performance-metric" key={item.value}><strong>{item.value}</strong><h3>{item.label.split('\n').map((line) => <span key={line}>{line}</span>)}</h3><p>{item.detail}</p></div>)}</div></Container></section>
}

export default Performance