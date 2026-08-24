// Shared Framer Motion variants for a staggered card entrance, used by
// About/Skills/Contact so each section fades and rises in one after another
// instead of appearing all at once.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] } },
}
