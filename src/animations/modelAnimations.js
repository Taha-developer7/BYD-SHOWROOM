import { gsap } from './gsap'

export function animateModelOut(model) {
  return new Promise((resolve) => {
    const currentScale = { x: model.scale.x, y: model.scale.y, z: model.scale.z }
    gsap.to(model.scale, {
      x: currentScale.x * 0.92,
      y: currentScale.y * 0.92,
      z: currentScale.z * 0.92,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: resolve,
    })
  })
}

export function animateModelIn(model) {
  const targetScale = { x: model.scale.x, y: model.scale.y, z: model.scale.z }
  return gsap.fromTo(
    model.scale,
    {
      x: targetScale.x * 0.92,
      y: targetScale.y * 0.92,
      z: targetScale.z * 0.92,
    },
    {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: 0.45,
      ease: 'power2.out',
    },
  )
}