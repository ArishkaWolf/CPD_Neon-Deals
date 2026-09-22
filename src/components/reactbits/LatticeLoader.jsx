import { motion, useReducedMotion } from 'motion/react'

const orbitDelays = [0, 1, 2, 7, null, 3, 6, 5, 4]

export function LatticeLoader({ label = 'Загрузка' }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="lattice-loader" role="status" aria-live="polite">
      <span className="lattice-grid" aria-hidden="true">
        {orbitDelays.map((delay, index) => delay === null ? <span key={index} /> : (
          <motion.span
            key={index}
            animate={reduceMotion ? { opacity: .75 } : { opacity: [.16, 1, .16], scale: [.82, 1.16, .82] }}
            transition={{ duration: 1.25, repeat: Infinity, delay: delay * .09, ease: 'easeInOut' }}
          />
        ))}
      </span>
      <span>{label}</span>
    </div>
  )
}
