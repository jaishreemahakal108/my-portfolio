import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const CHOICES = [
  { id: 'Rock', emoji: '✊' },
  { id: 'Paper', emoji: '✋' },
  { id: 'Scissors', emoji: '✌️' },
]
const BEATS = { Rock: 'Scissors', Paper: 'Rock', Scissors: 'Paper' }

function play(choice) {
  const cpu = CHOICES[Math.floor(Math.random() * 3)].id
  const result = choice === cpu ? 'Draw' : BEATS[choice] === cpu ? 'You win!' : 'You lose'
  return { cpu, result }
}

// A tiny, genuinely playable browser preview for the desktop's live-typing
// code ticker's "View Output" button — this is the actual Rock-Paper-
// Scissors game the ticker is shown writing, not just a static mockup.
export default function SafariApp() {
  const [round, setRound] = useState(null) // { you, cpu, result }
  const [score, setScore] = useState({ you: 0, cpu: 0 })

  const choose = (id) => {
    const { cpu, result } = play(id)
    setRound({ you: id, cpu, result })
    if (result === 'You win!') setScore((s) => ({ ...s, you: s.you + 1 }))
    else if (result === 'You lose') setScore((s) => ({ ...s, cpu: s.cpu + 1 }))
  }

  const emojiFor = (id) => CHOICES.find((c) => c.id === id)?.emoji

  return (
    <div className="rzw-safari">
      <div className="rzw-safari-toolbar">
        <span className="rzw-safari-nav">
          <button type="button" aria-label="Back" disabled>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label="Forward" disabled>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </span>
        <span className="rzw-safari-address">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c-4.4-3-8-6.7-8-11a8 8 0 0 1 16 0c0 4.3-3.6 8-8 11Z" /><circle cx="12" cy="11" r="2.6" /></svg>
          localhost:3000/rock-paper-scissors
        </span>
        <button type="button" className="rzw-safari-reload" aria-label="Reload" onClick={() => { setRound(null); setScore({ you: 0, cpu: 0 }) }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" /></svg>
        </button>
      </div>

      <div className="rzw-safari-page">
        <div className="rzw-rps">
          <h3>Rock · Paper · Scissors</h3>
          <div className="rzw-rps-score">
            <span>You <b>{score.you}</b></span>
            <span>CPU <b>{score.cpu}</b></span>
          </div>

          <div className="rzw-rps-arena">
            <AnimatePresence mode="wait">
              <motion.div
                key={round ? `${round.you}-${round.cpu}` : 'empty'}
                className="rzw-rps-faceoff"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <span className="rzw-rps-emoji">{round ? emojiFor(round.you) : '❔'}</span>
                <span className="rzw-rps-vs">vs</span>
                <span className="rzw-rps-emoji">{round ? emojiFor(round.cpu) : '❔'}</span>
              </motion.div>
            </AnimatePresence>
            <p className={`rzw-rps-result${round?.result === 'You win!' ? ' win' : ''}${round?.result === 'You lose' ? ' lose' : ''}`}>
              {round ? round.result : 'Pick a move to start'}
            </p>
          </div>

          <div className="rzw-rps-choices">
            {CHOICES.map((c) => (
              <motion.button
                key={c.id} type="button" className="rzw-rps-choice"
                whileTap={{ scale: 0.9 }} whileHover={{ y: -3 }}
                onClick={() => choose(c.id)}
              >
                <span>{c.emoji}</span>
                {c.id}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
