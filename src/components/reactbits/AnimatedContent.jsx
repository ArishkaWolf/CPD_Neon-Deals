import { motion, useReducedMotion } from 'motion/react'

export function AnimatedContent({ children, className = '', delay = 0, distance = 24 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={`animated-content ${className}`.trim()}
      initial={reduceMotion ? false : { opacity: 0, y: distance, scale: .985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: .16 }}
      transition={{ duration: .58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
