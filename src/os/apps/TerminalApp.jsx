import { useRef, useState } from 'react'
import { TERMINAL_HELP, PROFILE, PROJECTS, EDUCATION } from '../data'

export default function TerminalApp({ onOpenApp }) {
  const [lines, setLines] = useState([{ type: 'text', text: 'Rajaswa OS Terminal — type "help" to get started.' }])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const hIdxRef = useRef(0)
  const outRef = useRef(null)
  const inputRef = useRef(null)

  const print = (text) => setLines((l) => [...l, { type: 'text', text }])
  const printCmd = (cmd) => setLines((l) => [...l, { type: 'cmd', text: cmd }])
  const scrollDown = () => requestAnimationFrame(() => { if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight })

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    printCmd(raw)
    if (cmd === '') { scrollDown(); return }
    setHistory((h) => [...h, raw])
    hIdxRef.current = history.length + 1
    switch (cmd) {
      case 'help': print(TERMINAL_HELP); break
      case 'whoami': print(`${PROFILE.name}\n${PROFILE.role}`); break
      case 'skills': print('Frontend: React, JavaScript, Tailwind CSS, GSAP, Three.js\nBackend: Node.js, Express.js, Mongoose\nAI: Gemini API, ChatGPT/OpenAI API, VAPI\nData: MongoDB, Supabase, MySQL, Redis'); break
      case 'projects': print(PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.tag}`).join('\n') + '\nOpening Projects…'); onOpenApp?.('projects'); break
      case 'education': print(EDUCATION.map((e) => `${e.year} — ${e.title}, ${e.place}`).join('\n')); break
      case 'resume': print('Opening Resume…'); onOpenApp?.('resume'); break
      case 'contact': print(`Email: ${PROFILE.email}\nGitHub: ${PROFILE.githubUrl}\nLinkedIn: ${PROFILE.linkedinUrl}`); break
      case 'clear': setLines([]); break
      default: print(`Command not found: "${cmd}". Type "help" for available commands.`)
    }
    scrollDown()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { const v = value; setValue(''); run(v) }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      hIdxRef.current = Math.max(0, hIdxRef.current - 1)
      setValue(history[hIdxRef.current] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      hIdxRef.current = Math.min(history.length, hIdxRef.current + 1)
      setValue(history[hIdxRef.current] || '')
    }
  }

  return (
    <div className="rzw-term" onClick={() => inputRef.current?.focus()}>
      <div className="rzw-term-out" ref={outRef}>
        {lines.map((l, i) => l.type === 'cmd'
          ? <div className="cmdline" key={i}><span className="prompt">rajaswa@portfolio:~$</span> {l.text}</div>
          : <div key={i}>{l.text}</div>)}
      </div>
      <div className="rzw-term-in-row">
        <span className="prompt">rajaswa@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal input"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  )
}
