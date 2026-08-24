import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

// Letter-by-letter word morph. Hover swaps to the pair's second word;
// click advances to the next pair. Adapted from a shadcn/tsx original —
// `cn` and hsl(var(--token)) theme vars replaced with this project's
// plain className concat + real CSS custom properties.
export default function FluidTextMorph({
  wordPairs,
  className = '',
  animationProps = {},
  autoCycle = false,
  autoCycleMs = 2200,
}) {
  const [index, setIndex] = useState(0)
  const [word, setWord] = useState(wordPairs[0][0])
  const [hovering, setHovering] = useState(false)
  const {
    initialColor = 'var(--intro-accent)',
    animateColor = 'var(--intro-text)',
    exitColor = 'var(--intro-accent-2)',
  } = animationProps

  useEffect(() => {
    setWord(wordPairs[index][0])
  }, [index, wordPairs])

  useEffect(() => {
    if (!autoCycle || hovering) return
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % wordPairs.length)
    }, autoCycleMs)
    return () => clearInterval(t)
  }, [autoCycle, autoCycleMs, hovering, wordPairs.length])

  const handleHover = () => { setHovering(true); setWord(wordPairs[index][1]) }
  const handleHoverEnd = () => { setHovering(false); setWord(wordPairs[index][0]) }
  const handleClick = () => setIndex((prev) => (prev + 1) % wordPairs.length)

  const letters = word.split('')

  return (
    <div
      className={`relative flex cursor-pointer items-center justify-center text-6xl font-bold sm:text-8xl ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
    >
      <AnimatePresence>
        {letters.map((letter, i) => (
          <motion.span
            key={`letter-${i}`}
            layoutId={`letter-${i}`}
            initial={{ opacity: 0, y: 30, scale: 0.8, color: initialColor }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              color: animateColor,
              transition: { type: 'spring', damping: 15, stiffness: 200, delay: i * 0.05 },
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.8,
              color: exitColor,
              transition: { type: 'spring', damping: 15, stiffness: 200, delay: (letters.length - 1 - i) * 0.05 },
            }}
            className="relative"
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
