import { motion, useReducedMotion } from 'motion/react'

export function SpringCheck({ label, checked, onChange, disabled = false }) {
  const reduceMotion = useReducedMotion()

  return (
    <label className={`spring-check${checked ? ' is-checked' : ''}${disabled ? ' is-disabled' : ''}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <motion.span
        className="spring-check-box"
        aria-hidden="true"
        animate={{ scale: checked && !reduceMotion ? [1, 1.18, .94, 1] : 1 }}
        transition={{ duration: .42, times: [0, .38, .72, 1] }}
      >
        <motion.svg viewBox="0 0 24 24" animate={{ opacity: checked ? 1 : 0, pathLength: checked ? 1 : 0 }}>
          <motion.path d="M5 12.5 9.5 17 19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : .25, delay: checked ? .08 : 0 }} />
        </motion.svg>
      </motion.span>
      <span>{label}</span>
    </label>
  )
}
