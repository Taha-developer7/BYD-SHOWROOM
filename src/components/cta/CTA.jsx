import Button from '../common/Button'
import Container from '../common/Container'

function CTA() {
  return <section className="cta-section"><div className="cta-glow" /><Container><p className="eyebrow">THE NEXT TURN / 07</p><h2>READY TO<br /><em>MOVE FORWARD?</em></h2><p>Explore the next generation of electric mobility through an original interactive demo.</p><div className="cta-actions"><Button href="#vehicles">EXPLORE VEHICLES</Button><Button href="#home" variant="secondary">START EXPLORING</Button></div></Container></section>
}

export default CTA