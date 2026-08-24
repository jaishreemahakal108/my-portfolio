import { useEffect, useState } from 'react'
import {
  useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import RajaswaOS from './RajaswaOS'
import FluidTextMorph from './FluidTextMorph'
import './landing.css'

const WORD_PAIRS = [
  ['Design', 'Develop'],
  ['Backend', 'AI'],
  ['Build', 'Ship'],
  ['Full-Stack', 'Engineer'],
]

function ScrollChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// The hero morph text and Rajaswa OS are both plain `position:fixed` full-
// viewport layers stacked by z-index — never `position:sticky` — so scroll
// only ever drives their opacity/transform via whole-page scrollYProgress.
// A separate invisible spacer below them supplies the scroll distance. This
// sidesteps the sticky "un-pin near the end of its track" edge case, where a
// sticky reveal container starts scrolling away right as it hands off to the
// locked-in OS, flashing a half-scrolled frame (menu bar gone, dock still
// visible) before settling — exactly the bug a real scroll gesture hit here.
function IntroScroll({ onDone, children }) {
  const { scrollYProgress } = useScroll()

  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -40])
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.94])
  const osOpacity = useTransform(scrollYProgress, [0.25, 0.7], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.85) onDone()
  })

  return (
    <>
      <motion.div className="rzw-landing-os-layer" style={{ opacity: osOpacity }}>
        {children}
      </motion.div>

      <motion.div
        className="rzw-landing-hero-layer"
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
      >
        <span className="rzw-landing-eyebrow">Hi, I&apos;m Rajaswa Anand</span>
        <FluidTextMorph wordPairs={WORD_PAIRS} className="rzw-landing-morph" autoCycle />
        <span className="rzw-landing-sub">Full-Stack Developer &middot; AI &amp; Backend Engineer</span>
        <div className="rzw-landing-hint">
          <span>Scroll to enter</span>
          <ScrollChevron />
        </div>
      </motion.div>

      <div className="rzw-landing-spacer" aria-hidden="true" />
    </>
  )
}

export default function Landing({ initialApp }) {
  const reduceMotion = useReducedMotion()
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    if (introDone) window.scrollTo(0, 0)
  }, [introDone])

  if (introDone || reduceMotion) return <RajaswaOS initialApp={initialApp} />

  return (
    <IntroScroll onDone={() => setIntroDone(true)}>
      <RajaswaOS initialApp={initialApp} />
    </IntroScroll>
  )
}
