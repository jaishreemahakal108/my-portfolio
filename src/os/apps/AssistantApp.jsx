import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { PROFILE } from '../data'

const QUICK_ACTIONS = [
  ['View Best Project', 'show me his best project'],
  ['Experience', 'tell me about his work experience'],
  ['AI & Gemini Work', 'tell me about his AI and Gemini experience'],
  ['Skills', 'what technologies does he use'],
  ['View Resume', 'show me his resume'],
  ['Contact Rajaswa', 'how can I contact him'],
]

function respond(text) {
  const t = text.toLowerCase()
  if (/resume|cv/.test(t)) {
    return {
      reply: "Rajaswa's resume covers his B.E. in AI & Machine Learning at RNS Institute of Technology, his internship at Vibrantix Solutions, and his key projects — Screening, Brain Hunter and the AI Virtual Assistant. It's downloadable as a PDF.",
      open: 'resume', openLabel: 'Open Resume',
    }
  }
  if (/project/.test(t)) {
    return {
      reply: 'His strongest project is Screening — an AI-powered interview platform with Gemini/ChatGPT question generation, live multi-interviewer video calls and an in-browser code editor. He also built Brain Hunter, a backtracking Sudoku solver/generator, and an AI Virtual Assistant built on the Gemini API.',
      open: 'projects', openLabel: 'View all Projects',
    }
  }
  if (/gemini|chatgpt|\bai\b|vapi/.test(t)) {
    return {
      reply: "He integrates Gemini, ChatGPT and VAPI voice AI into real products — Screening's question generation & analysis, real-time voice interviewing, and a standalone Gemini-powered voice assistant.",
      open: 'ailab', openLabel: 'Open AI Lab',
    }
  }
  if (/backend|node|express|api/.test(t)) {
    return {
      reply: 'Yes — Node.js, Express.js, MongoDB and Supabase power the backend of his projects, and he built backend APIs and workflow automation professionally during his internship at Vibrantix Solutions.',
      open: 'skills', openLabel: 'Open Skills',
    }
  }
  if (/architecture|system|diagram/.test(t)) {
    return {
      reply: "The Screening platform runs a React frontend, a Node/Express API layer, and three backend services — an AI service (Gemini/ChatGPT), a realtime interview engine (VAPI), and a Supabase database.",
      open: 'architecture', openLabel: 'Open Architecture',
    }
  }
  if (/vibrantix|internship|work experience|job/.test(t)) {
    return {
      reply: 'He interned as a SaaS Full-Stack Development Engineer at Vibrantix Solutions Pvt Ltd — building frontend interfaces and backend APIs for compliance/audit platforms, workflow automation, and reporting dashboards.',
      open: 'experience', openLabel: 'Open Experience',
    }
  }
  if (/education|college|degree|rns|vtu/.test(t)) {
    return {
      reply: "He's completing a B.E. in AI & Machine Learning at RNS Institute of Technology (VTU), 2022–2026, alongside his internship at Vibrantix Solutions.",
      open: 'experience', openLabel: 'Open Experience',
    }
  }
  if (/contact|email|reach|hire/.test(t)) {
    return {
      reply: `You can reach him at ${PROFILE.email}, or on GitHub (@${PROFILE.github}) and LinkedIn (@${PROFILE.linkedin}).`,
      open: 'contact', openLabel: 'Open Contact',
    }
  }
  if (/skill|tech|stack/.test(t)) {
    return {
      reply: 'Frontend (React, Tailwind, GSAP), backend (Node.js, Express, MongoDB, Supabase), and AI integrations (Gemini, ChatGPT, VAPI) — grouped by domain in Skills.',
      open: 'skills', openLabel: 'Open Skills',
    }
  }
  if (/who|about/.test(t)) {
    return {
      reply: `${PROFILE.name} is a ${PROFILE.role}. ${PROFILE.summary}`,
      open: 'about', openLabel: 'Open About',
    }
  }
  return { reply: 'I can help with his projects, experience, skills, AI work, resume, or contact info — try a quick action below.' }
}

const bubbleVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

export default function AssistantApp({ onOpenApp }) {
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi, I'm RZW — ask me anything about Rajaswa's work, or tap a suggestion below." }])
  const [value, setValue] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef(null)

  const scrollDown = () => requestAnimationFrame(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight })

  const handle = (text) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user', text }])
    setValue('')
    setTyping(true)
    scrollDown()
    const res = respond(text)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { from: 'bot', text: res.reply, open: res.open, openLabel: res.openLabel }])
      scrollDown()
    }, 420)
  }

  return (
    <div className="rzw-chat">
      <div className="rzw-chat-quick">
        {QUICK_ACTIONS.map(([label, q]) => (
          <motion.button key={label} type="button" whileTap={{ scale: 0.94 }} onClick={() => handle(q)}>{label}</motion.button>
        ))}
      </div>
      <div className="rzw-chat-log" ref={logRef}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              className={`rzw-msg ${m.from}`} key={i}
              variants={bubbleVariants} initial="initial" animate="animate" exit="exit"
            >
              <div>{m.text}</div>
              {m.open && (
                <button type="button" className="rzw-msg-action" onClick={() => onOpenApp?.(m.open)}>
                  {m.openLabel || 'View full details'} →
                </button>
              )}
            </motion.div>
          ))}
          {typing && (
            <motion.div className="rzw-msg bot rzw-msg-typing" key="typing" variants={bubbleVariants} initial="initial" animate="animate" exit="exit">
              <span className="rzw-typing-dot" /><span className="rzw-typing-dot" /><span className="rzw-typing-dot" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="rzw-chat-in-row">
        <input
          type="text"
          placeholder="Ask about projects, skills, experience…"
          aria-label="Message RZW Assistant"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handle(value) }}
        />
        <motion.button className="rzw-chat-send" type="button" aria-label="Send" whileTap={{ scale: 0.88 }} onClick={() => handle(value)}>➤</motion.button>
      </div>
    </div>
  )
}
