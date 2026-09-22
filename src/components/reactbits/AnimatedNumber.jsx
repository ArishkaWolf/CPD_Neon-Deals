import { useEffect, useState } from 'react'
import { useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'

export function AnimatedNumber({ value, format = (number) => Math.round(number).toString() }) {
  const reduceMotion = useReducedMotion()
  const source = useMotionValue(reduceMotion ? value : 0)
  const spring = useSpring(source, { stiffness: 92, damping: 20, mass: .7 })
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useMotionValueEvent(spring, 'change', setDisplay)
  useEffect(() => source.set(value), [source, value])

  return <>{format(display)}</>
}
