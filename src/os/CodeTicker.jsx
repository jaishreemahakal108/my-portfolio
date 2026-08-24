import { useEffect, useRef, useState } from 'react'

// Ambient "live coding" ticker for an empty desktop corner — types out one
// small, real, self-contained snippet (a Rock-Paper-Scissors game) character
// by character, including the occasional typo-and-correct, like an actual
// person typing, then loops. "View Output" opens a Safari window where the
// game this code describes is actually playable.
const LINES = [
  "function play(choice) {",
  "  const options = ['Rock', 'Paper', 'Scissors'];",
  "  const cpu = options[Math.floor(Math.random() * 3)];",
  "",
  "  return { cpu, result: getResult(choice, cpu) };",
  "}",
  "",
  "function getResult(you, cpu) {",
  "  if (you === cpu) return 'Draw';",
  "  const beats = { Rock: 'Scissors', Paper: 'Rock', Scissors: 'Paper' };",
  "  return beats[you] === cpu ? 'You win!' : 'You lose';",
  "}",
  "",
  "play('Rock');",
]

const TYPO_POOL = 'asdfghjklqwertyuiopzxcvbnm'
const randomTypoChar = () => TYPO_POOL[Math.floor(Math.random() * TYPO_POOL.length)]

const KEYWORDS = new Set(['function', 'const', 'let', 'var', 'return', 'if', 'else'])
// Tokenizes a (possibly partial, mid-typing) line for lightweight syntax
// coloring — strings and keywords get a class; everything else (identifiers,
// punctuation, numbers) renders as plain text.
function tokenize(line) {
  const regex = /('[^']*'?)|([a-zA-Z_$][\w$]*)/g
  const tokens = []
  let last = 0
  let m
  while ((m = regex.exec(line))) {
    if (m.index > last) tokens.push({ text: line.slice(last, m.index) })
    const [full, str, word] = m
    if (str) tokens.push({ text: full, cls: 'str' })
    else if (word) tokens.push({ text: full, cls: KEYWORDS.has(word) ? 'kw' : undefined })
    last = regex.lastIndex
  }
  if (last < line.length) tokens.push({ text: line.slice(last) })
  return tokens
}

function CodeLine({ text }) {
  return tokenize(text).map((tok, i) => (
    tok.cls ? <span key={i} className={`rzw-tok-${tok.cls}`}>{tok.text}</span> : <span key={i}>{tok.text}</span>
  ))
}

const SCROLL_FOLLOW_THRESHOLD = 10
const TYPO_CHANCE = 0.045

export default function CodeTicker({ onOpenOutput }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [hasTypo, setHasTypo] = useState(false)
  const [history, setHistory] = useState([])
  const bodyRef = useRef(null)

  useEffect(() => {
    const target = LINES[lineIndex]

    if (typedText.length < target.length) {
      if (hasTypo) {
        const t = setTimeout(() => { setTypedText((s) => s.slice(0, -1)); setHasTypo(false) }, 90)
        return () => clearTimeout(t)
      }
      const canTypo = target.trim().length > 3 && typedText.length < target.length - 1
      if (canTypo && Math.random() < TYPO_CHANCE) {
        const t = setTimeout(() => { setTypedText((s) => s + randomTypoChar()); setHasTypo(true) }, 40 + Math.random() * 50)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setTypedText((s) => s + target[s.length]), 28 + Math.random() * 55)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setHistory((prev) => [...prev, target])
      setTypedText('')
      if (lineIndex + 1 < LINES.length) {
        setLineIndex((i) => i + 1)
      } else {
        setTimeout(() => { setHistory([]); setLineIndex(0) }, 900)
      }
    }, target ? 380 : 60)
    return () => clearTimeout(t)
  }, [lineIndex, typedText, hasTypo])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanceFromBottom < SCROLL_FOLLOW_THRESHOLD) el.scrollTop = el.scrollHeight
  }, [history, typedText])

  const isSaved = typedText.length === 0

  return (
    <div className="rzw-code-ticker">
      <div className="rzw-code-ticker-head">
        <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
        <span className="rzw-code-branch">
          <span className={`rzw-code-savedot ${isSaved ? 'saved' : ''}`} />
          main
        </span>
      </div>

      <div className="rzw-code-ticker-body" ref={bodyRef} aria-hidden="true">
        {history.map((line, i) => (
          <div className="rzw-code-line" key={i}>
            <span className="rzw-code-gutter">{i + 1}</span>
            <CodeLine text={line} />
          </div>
        ))}
        <div className="rzw-code-line">
          <span className="rzw-code-gutter">{history.length + 1}</span>
          <CodeLine text={typedText} />
          <span className="rzw-code-cursor" />
        </div>
      </div>

      <button type="button" className="rzw-code-ticker-run" onClick={onOpenOutput}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        View Output
      </button>
    </div>
  )
}
