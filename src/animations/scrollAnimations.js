import { gsap, ScrollTrigger } from './gsap'

export function createScrollAnimation(target, vars = {}) {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: target,
        start: 'top 85%',
        once: true,
        ...vars.scrollTrigger,
      },
      ...vars,
    },
  )
}

export { ScrollTrigger }