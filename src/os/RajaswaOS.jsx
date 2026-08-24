import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import {
  AnimatePresence, MotionConfig,
  useMotionValue, useReducedMotion, useSpring, useTransform, useDragControls,
} from 'framer-motion'
// `motion` is only referenced via JSX member tags (<motion.div>), which this
// project's ESLint setup (no eslint-plugin-react) doesn't trace as a usage.
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import './rajaswa-os.css'
import { AppIcon, SearchIcon, SunIcon, MoonIcon } from './icons'
import { APP_TITLES, ICON_COLOR, DOCK_APPS, WINDOW_APPS, SPOTLIGHT_INDEX, mobileAppTitle } from './data'
import { staggerContainer, fadeUp } from './motion'

import ConstellationGrid from './ConstellationGrid'
import CodeTicker from './CodeTicker'
import MobileHome from './MobileHome'
import AboutApp from './apps/AboutApp'
import ProjectsApp from './apps/ProjectsApp'
import ExperienceApp from './apps/ExperienceApp'
import SkillsApp from './apps/SkillsApp'
import AILabApp from './apps/AILabApp'
import ArchitectureApp from './apps/ArchitectureApp'
import ResumeApp from './apps/ResumeApp'
import ContactApp from './apps/ContactApp'
import TerminalApp from './apps/TerminalApp'
import AssistantApp from './apps/AssistantApp'
import SafariApp from './apps/SafariApp'

const WINDOW_SIZE = {
  about: [520, 540], projects: [680, 540], experience: [560, 480], skills: [520, 460],
  ailab: [560, 500], architecture: [620, 560], resume: [640, 600], contact: [560, 560],
  terminal: [560, 400], assistant: [400, 540], safari: [560, 520],
}

const EASE = [0.32, 0.72, 0, 1]

function AppBody({ id, onOpenApp }) {
  switch (id) {
    case 'about': return <AboutApp />
    case 'projects': return <ProjectsApp />
    case 'experience': return <ExperienceApp />
    case 'skills': return <SkillsApp />
    case 'ailab': return <AILabApp />
    case 'architecture': return <ArchitectureApp />
    case 'resume': return <ResumeApp />
    case 'contact': return <ContactApp />
    case 'terminal': return <TerminalApp onOpenApp={onOpenApp} />
    case 'assistant': return <AssistantApp onOpenApp={onOpenApp} />
    case 'safari': return <SafariApp />
    default: return null
  }
}

// A phone is small on BOTH axes, in either orientation (e.g. 430x932 held
// sideways is still 430 on its short side). A laptop/monitor window can be
// short (unmaximized, small screen) without being phone-sized on its long
// side, and a tablet's short side stays well above a phone's — checking only
// one dimension misclassifies one of those. Requiring both keeps phones on
// the iOS shell and tablets/laptops/monitors on the macOS shell.
const PHONE_MAX_SHORT_SIDE = 520
const PHONE_MAX_LONG_SIDE = 1000

function computeDevice() {
  if (typeof window === 'undefined') return 'desktop'
  const shortSide = Math.min(window.innerWidth, window.innerHeight)
  const longSide = Math.max(window.innerWidth, window.innerHeight)
  return (shortSide < PHONE_MAX_SHORT_SIDE && longSide < PHONE_MAX_LONG_SIDE) ? 'mobile' : 'desktop'
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function RajaswaOS({ initialApp }) {
  const [searchParams] = useSearchParams()
  const now = useClock()

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rzw-theme') || 'dark' } catch { return 'dark' }
  })
  const [device, setDevice] = useState(computeDevice)

  const [winState, setWinState] = useState({})
  const zCounter = useRef(10)
  const [activeAppId, setActiveAppId] = useState(null)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [mobileActive, setMobileActive] = useState(null)

  useEffect(() => {
    const onChange = () => setDevice(computeDevice())
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('rzw-theme', theme) } catch { /* ignore */ }
  }, [theme])

  // Cinematic left-to-right wipe between themes via the View Transitions API:
  // the browser snapshots the current (old) and post-update (new) paint, and
  // our CSS animates the new snapshot's clip-path from 0% to 100% width so it
  // visibly sweeps across and reveals the new theme, rather than everything
  // flipping in one frame. flushSync forces the theme's DOM update to commit
  // synchronously inside the transition callback, which the API requires to
  // capture an accurate "after" snapshot. Falls back to a plain, instant
  // switch when the API or motion isn't available (older browsers, or the
  // user's OS-level reduced-motion preference) and ignores re-clicks while a
  // wipe is already mid-flight so rapid toggling can't overlap or glitch.
  const themeWipeBusy = useRef(false)
  const toggleTheme = () => {
    if (themeWipeBusy.current) return
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof document === 'undefined' || !document.startViewTransition || reduceMotion) {
      setTheme(next)
      return
    }
    themeWipeBusy.current = true
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    transition.finished.catch(() => {}).finally(() => { themeWipeBusy.current = false })
  }

  const openDesktopWindow = (id) => {
    let willMinimize = false
    setWinState((prev) => {
      const wasFocused = !!prev[id]?.focused
      const next = {}
      for (const k of Object.keys(prev)) next[k] = { ...prev[k], focused: false }

      const cur = prev[id]
      if (!cur || !cur.open) {
        const idx = Object.keys(prev).filter((k) => prev[k]?.open).length
        const [w, h] = WINDOW_SIZE[id] || [520, 480]
        next[id] = {
          open: true, minimized: false, focused: true, z: ++zCounter.current, maxed: false,
          x: 90 + (idx % 5) * 34, y: 64 + (idx % 5) * 28, w, h,
        }
      } else if (cur.minimized) {
        next[id] = { ...cur, minimized: false, focused: true, z: ++zCounter.current }
      } else if (wasFocused) {
        willMinimize = true
        next[id] = { ...cur, minimized: true, focused: false }
      } else {
        next[id] = { ...cur, focused: true, z: ++zCounter.current }
      }
      return next
    })
    setActiveAppId(willMinimize ? null : id)
  }

  const openApp = (id) => {
    if (device === 'desktop') openDesktopWindow(id)
    else setMobileActive(id)
  }

  const closeApp = (id) => {
    setWinState((prev) => ({ ...prev, [id]: { ...prev[id], open: false, minimized: false, focused: false } }))
    setActiveAppId((cur) => (cur === id ? null : cur))
  }
  const minimizeApp = (id) => setWinState((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true, focused: false } }))
  const focusApp = (id) => {
    setWinState((prev) => {
      const next = {}
      for (const k of Object.keys(prev)) next[k] = { ...prev[k], focused: k === id }
      next[id] = { ...next[id], z: ++zCounter.current }
      return next
    })
    setActiveAppId(id)
  }
  const toggleMaximize = (id) => {
    setWinState((prev) => {
      const cur = prev[id]
      if (!cur.maxed) {
        return { ...prev, [id]: { ...cur, maxed: true, prevRect: { x: cur.x, y: cur.y, w: cur.w, h: cur.h } } }
      }
      const r = cur.prevRect || { x: 90, y: 64, w: 520, h: 480 }
      return { ...prev, [id]: { ...cur, maxed: false, ...r } }
    })
  }
  const moveWindow = (id, x, y) => setWinState((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], x, y } } : prev))

  // deep-link via legacy route (initialApp) or ?app=id — delayed briefly so it
  // doesn't open mid page-transition
  useEffect(() => {
    const id = initialApp || searchParams.get('app')
    if (id && WINDOW_APPS.includes(id)) {
      const t = setTimeout(() => openApp(id), 1400)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSpotlightOpen(true) }
      else if (e.key === 'Escape' && spotlightOpen) setSpotlightOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [spotlightOpen])

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: EASE }}>
      <div className="rzw-os" data-theme={theme}>
        <Toaster position="bottom-center" />
        {device === 'desktop' ? (
          <Desktop
            theme={theme} onToggleTheme={toggleTheme} now={now}
            winState={winState} openApp={openApp} closeApp={closeApp}
            minimizeApp={minimizeApp} focusApp={focusApp} toggleMaximize={toggleMaximize}
            moveWindow={moveWindow} activeAppId={activeAppId}
            spotlightOpen={spotlightOpen} setSpotlightOpen={setSpotlightOpen}
          />
        ) : (
          <Mobile
            theme={theme} onToggleTheme={toggleTheme} now={now}
            mobileActive={mobileActive} setMobileActive={setMobileActive}
            spotlightOpen={spotlightOpen} setSpotlightOpen={setSpotlightOpen}
          />
        )}
      </div>
    </MotionConfig>
  )
}

/* ============================= DESKTOP ============================= */

// Each letter reacts only to its own hover — never a word-wide wave — via
// Framer Motion's per-element whileHover gesture. The rest position (color/
// lift) still comes from a variants object so it participates in the
// parent's fadeUp entrance propagation like any other child.
const heroLetterRest = { show: { y: 0, scale: 1, color: 'var(--text-primary)' } }
const heroLetterHover = { y: -10, scale: 1.15, color: 'var(--accent)' }
const heroLetterHoverTransition = { type: 'spring', stiffness: 420, damping: 14 }

const heroSubLetterRest = { show: { y: 0, opacity: 0.85 } }
const heroSubLetterHover = { y: -4, opacity: 1 }
const heroSubLetterHoverTransition = { type: 'spring', stiffness: 420, damping: 16 }

function AnimatedLetters({ text, restVariants, whileHover, transition }) {
  return text.split('').map((ch, i) => (
    <motion.span
      key={i} variants={restVariants} whileHover={whileHover} transition={transition}
      style={{ display: 'inline-block' }}
    >
      {ch.charCodeAt(0) === 32 ? ' ' : ch}
    </motion.span>
  ))
}

function Desktop({
  theme, onToggleTheme, now, winState, openApp, closeApp, minimizeApp, focusApp,
  toggleMaximize, moveWindow, activeAppId, spotlightOpen, setSpotlightOpen,
}) {
  const desktopRef = useRef(null)
  const reduceMotion = useReducedMotion()

  return (
    <div className="rzw-desktop" ref={desktopRef}>
      {!reduceMotion && <ConstellationGrid dark={theme === 'dark'} />}
      {!reduceMotion && <CodeTicker onOpenOutput={() => openApp('safari')} />}

      <motion.div
        className="rzw-desktop-hero" aria-hidden="true"
        variants={staggerContainer} initial="hidden" animate="show"
      >
        <motion.h1 variants={fadeUp}>
          <AnimatedLetters
            text="Rajaswa Anand" restVariants={heroLetterRest}
            whileHover={heroLetterHover} transition={heroLetterHoverTransition}
          />
        </motion.h1>
        <motion.p variants={fadeUp}>
          <AnimatedLetters
            text="Welcome to my portfolio" restVariants={heroSubLetterRest}
            whileHover={heroSubLetterHover} transition={heroSubLetterHoverTransition}
          />
        </motion.p>
      </motion.div>

      <MenuBar
        theme={theme} onToggleTheme={onToggleTheme} now={now} activeAppId={activeAppId}
        openApp={openApp} onSearch={() => setSpotlightOpen(true)} winState={winState}
        closeApp={closeApp} minimizeApp={minimizeApp} toggleMaximize={toggleMaximize} focusApp={focusApp}
      />

      <AnimatePresence>
        {WINDOW_APPS.map((id) => {
          const w = winState[id]
          if (!w || !w.open) return null
          return (
            <WindowFrame
              key={id} id={id} state={w} desktopRef={desktopRef}
              onClose={() => closeApp(id)} onMinimize={() => minimizeApp(id)}
              onMaximize={() => toggleMaximize(id)} onFocus={() => focusApp(id)}
              onMove={(x, y) => moveWindow(id, x, y)}
            >
              <AppBody id={id} onOpenApp={openApp} />
            </WindowFrame>
          )
        })}
      </AnimatePresence>

      <div className="rzw-dock-wrap">
        <Dock winState={winState} openApp={openApp} />
      </div>

      <AnimatePresence>
        {spotlightOpen && <Spotlight onClose={() => setSpotlightOpen(false)} onOpen={openApp} />}
      </AnimatePresence>
    </div>
  )
}

function MenuBar({
  theme, onToggleTheme, now, activeAppId, openApp, onSearch,
  winState, closeApp, minimizeApp, toggleMaximize, focusApp,
}) {
  const [openMenu, setOpenMenu] = useState(null)
  const barRef = useRef(null)
  const clock = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' +
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    if (!openMenu) return
    const onDocClick = (e) => { if (!barRef.current?.contains(e.target)) setOpenMenu(null) }
    const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu])

  const openIds = WINDOW_APPS.filter((id) => winState[id]?.open)
  const run = (fn) => () => { fn(); setOpenMenu(null) }

  const menus = {
    File: [
      { label: 'Search Everything…', shortcut: '⌘K', action: onSearch },
      { sep: true },
      {
        label: 'Close Window', shortcut: '⌘W', disabled: !activeAppId,
        action: () => activeAppId && closeApp(activeAppId),
      },
      {
        label: 'Close All Windows', disabled: openIds.length === 0,
        action: () => openIds.forEach((id) => closeApp(id)),
      },
    ],
    Edit: [
      { label: 'Find…', shortcut: '⌘K', action: onSearch },
    ],
    View: [
      { label: theme === 'dark' ? 'Switch to Light Appearance' : 'Switch to Dark Appearance', action: onToggleTheme },
      { sep: true },
      {
        label: 'Zoom Window', disabled: !activeAppId,
        action: () => activeAppId && toggleMaximize(activeAppId),
      },
    ],
    Window: [
      {
        label: 'Minimize', shortcut: '⌘M', disabled: !activeAppId,
        action: () => activeAppId && minimizeApp(activeAppId),
      },
      {
        label: 'Zoom', disabled: !activeAppId,
        action: () => activeAppId && toggleMaximize(activeAppId),
      },
      ...(openIds.length ? [{ sep: true }] : []),
      ...openIds.map((id) => ({
        label: APP_TITLES[id], active: id === activeAppId,
        action: () => focusApp(id),
      })),
    ],
    Help: [
      { label: 'About Rajaswa', action: () => openApp('about') },
      { label: 'Contact Rajaswa', action: () => openApp('contact') },
    ],
  }

  return (
    <div className="rzw-menubar" ref={barRef}>
      <div className="brand"><span className="dot" /> RZW.dev</div>
      <div className="active-app">{activeAppId ? APP_TITLES[activeAppId] : 'Finder'}</div>
      <div className="rzw-menubar-fake">
        {Object.entries(menus).map(([label, items]) => (
          <div className="rzw-menu-wrap" key={label}>
            <button
              type="button" className={`rzw-menu-btn${openMenu === label ? ' active' : ''}`}
              onClick={() => setOpenMenu((m) => (m === label ? null : label))}
            >
              {label}
            </button>
            <AnimatePresence>
              {openMenu === label && (
                <motion.div
                  className="rzw-menu-dropdown" role="menu"
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -2, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.14 }}
                >
                  {items.map((item, i) => item.sep
                    ? <div className="rzw-menu-sep" key={i} />
                    : (
                      <button
                        type="button" key={item.label} role="menuitem" className="rzw-menu-item"
                        disabled={item.disabled} onClick={run(item.action)}
                      >
                        <span>{item.active ? '● ' : ''}{item.label}</span>
                        {item.shortcut && <span className="rzw-menu-shortcut">{item.shortcut}</span>}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="rzw-menubar-nav">
        {['about', 'projects', 'experience', 'skills', 'resume'].map((id) => (
          <button key={id} type="button" onClick={() => openApp(id)}>{APP_TITLES[id]}</button>
        ))}
      </div>
      <div className="rzw-menubar-right">
        <span className="clock">{clock}</span>
        <button className="rzw-menubar-btn" type="button" aria-label="Search (Ctrl/Cmd+K)" title="Spotlight (Ctrl/Cmd+K)" onClick={onSearch}>
          <SearchIcon size={15} />
        </button>
        <button className="rzw-menubar-btn" type="button" aria-label="Toggle theme" onClick={onToggleTheme}>
          {theme === 'dark' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
        </button>
      </div>
    </div>
  )
}

function Dock({ winState, openApp }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <div className="rzw-dock" onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}>
      {DOCK_APPS.map((id) => (
        <span key={id} style={{ display: 'contents' }}>
          {id === 'terminal' && <div className="rzw-dock-sep" />}
          <DockIcon id={id} mouseX={mouseX} open={!!winState[id]?.open} onOpen={() => openApp(id)} />
        </span>
      ))}
    </div>
  )
}

function DockIcon({ id, mouseX, open, onOpen }) {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect()
    // Bounds aren't measurable yet on the very first evaluation (the ref
    // hasn't attached before this initial render commits). Falling back to
    // 0 read as "cursor sitting exactly on this icon", pinning every icon at
    // peak magnification until the first real dock mousemove/mouseleave
    // forced a recompute — Infinity reads as "cursor is nowhere near",
    // which is what an unmeasured icon actually is.
    if (!bounds) return Infinity
    return val - (bounds.left + bounds.width / 2)
  })
  const scaleTarget = useTransform(distance, [-110, 0, 110], [1, 1.55, 1])
  const liftTarget = useTransform(distance, [-110, 0, 110], [0, -8, 0])
  const scale = useSpring(scaleTarget, { mass: 0.1, stiffness: 170, damping: 12 })
  const lift = useSpring(liftTarget, { mass: 0.1, stiffness: 170, damping: 12 })

  return (
    <motion.button
      type="button" className="rzw-dock-item" aria-label={`Open ${APP_TITLES[id]}`}
      onClick={onOpen} whileTap={{ scale: 0.9 }}
    >
      <motion.span
        ref={ref} className="rzw-glyph" style={reducedMotion ? { '--icon-c': ICON_COLOR[id] } : { '--icon-c': ICON_COLOR[id], scale, y: lift }}
      >
        <AppIcon id={id} size={22} />
      </motion.span>
      <span className="dtip">{APP_TITLES[id]}</span>
      <span className="indicator" style={{ opacity: open ? 1 : 0 }} />
    </motion.button>
  )
}

function WindowFrame({ id, state, desktopRef, onClose, onMinimize, onMaximize, onFocus, onMove, children }) {
  const elRef = useRef(null)
  const dragRef = useRef(null)
  const draggingRef = useRef(false)

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    if (state.maxed) { onFocus(); return }
    onFocus()
    const rect = elRef.current.getBoundingClientRect()
    dragRef.current = { offX: e.clientX - rect.left, offY: e.clientY - rect.top }
    draggingRef.current = true
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }
  const onPointerMove = (e) => {
    if (!dragRef.current || !desktopRef.current) return
    const stageR = desktopRef.current.getBoundingClientRect()
    let x = e.clientX - stageR.left - dragRef.current.offX
    let y = e.clientY - stageR.top - dragRef.current.offY
    x = Math.max(4, Math.min(x, stageR.width - 120))
    y = Math.max(30, Math.min(y, stageR.height - 60))
    onMove(x, y)
  }
  const onPointerUp = () => {
    dragRef.current = null
    draggingRef.current = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  // Framer Motion animates numeric values, not calc() strings — resolve the
  // maximized size against the actual desktop rect so it can tween smoothly.
  const stageR = desktopRef.current?.getBoundingClientRect()
  const rect = state.maxed
    ? { left: 16, top: 50, width: stageR ? stageR.width - 32 : 800, height: stageR ? stageR.height - 100 : 500 }
    : { left: state.x, top: state.y, width: state.w, height: state.h }

  const posDuration = draggingRef.current ? 0 : 0.22

  return (
    <motion.div
      ref={elRef}
      className={`rzw-window${state.focused ? ' focused' : ''}`}
      style={{ position: 'absolute', zIndex: state.z, display: state.minimized ? 'none' : 'flex' }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1, ...rect }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14, ease: EASE } }}
      transition={{
        opacity: { duration: 0.16 }, scale: { duration: 0.16 },
        left: { duration: posDuration, ease: EASE }, top: { duration: posDuration, ease: EASE },
        width: { duration: 0.22, ease: EASE }, height: { duration: 0.22, ease: EASE },
      }}
      onMouseDown={onFocus}
    >
      <div className="rzw-titlebar" onPointerDown={onPointerDown}>
        <span className="rzw-traffic">
          <button type="button" className="close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M1.4 1.4l5.2 5.2M6.6 1.4L1.4 6.6" /></svg>
          </button>
          <button type="button" className="min" aria-label="Minimize" onClick={onMinimize}>
            <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M1.2 4h5.6" /></svg>
          </button>
          <button type="button" className="max" aria-label={state.maxed ? 'Restore' : 'Maximize'} onClick={onMaximize}>
            <svg viewBox="0 0 8 8" fill="currentColor"><polygon points="1,4.2 1,6.6 3.4,6.6" /><polygon points="7,3.8 7,1.4 4.6,1.4" /></svg>
          </button>
        </span>
        <span className="rzw-twin-title">
          <span className="rzw-twin-icon" style={{ '--icon-c': ICON_COLOR[id] }}><AppIcon id={id} size={11} /></span>
          <span className="rzw-ttitle">{APP_TITLES[id]}</span>
        </span>
        <span />
      </div>
      <div className="rzw-window-body">{children}</div>
    </motion.div>
  )
}

function Spotlight({ onClose, onOpen }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const results = SPOTLIGHT_INDEX.filter((it) => !q || (it.label + ' ' + it.kw).toLowerCase().includes(q.toLowerCase()))

  const commit = (i) => { const it = results[i]; if (it) { onClose(); onOpen(it.app) } }

  return (
    <motion.div
      className="rzw-spotlight-overlay" role="dialog" aria-modal="true" aria-label="Spotlight search"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <motion.div
        className="rzw-spotlight-box"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
        transition={{ duration: 0.18, ease: EASE }}
      >
        <div className="rzw-spotlight-input-row">
          <SearchIcon size={16} style={{ color: 'var(--text-muted)', flex: '0 0 auto' }} />
          <input
            ref={inputRef} type="text" placeholder="Search Rajaswa OS…" value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0) }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
              else if (e.key === 'Enter') { e.preventDefault(); commit(sel) }
              else if (e.key === 'Escape') onClose()
            }}
          />
          <kbd style={{ fontSize: 11, color: 'var(--text-muted)', border: '1px solid var(--border-strong)', padding: '2px 6px', borderRadius: 5 }}>esc</kbd>
        </div>
        <div className="rzw-spotlight-results">
          {results.length === 0 && <div className="rzw-spotlight-empty">No results for "{q}"</div>}
          <AnimatePresence initial={false}>
            {results.map((it, i) => (
              <motion.button
                key={it.label} type="button" className="rzw-spotlight-row" aria-selected={i === sel} onClick={() => commit(i)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                layout
              >
                <span className="kicker">{APP_TITLES[it.app]}</span><span>{it.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ============================= MOBILE ============================= */

function Mobile({ theme, onToggleTheme, now, mobileActive, setMobileActive, spotlightOpen, setSpotlightOpen }) {
  const clock = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')
  const reduceMotion = useReducedMotion()

  // Tracks which home-screen surface (grid vs dock) a tap opened an app
  // from, so the panel's topbar icon can share a layoutId with that exact
  // icon — giving Framer Motion enough to morph the panel visually out of
  // the tapped icon instead of just sliding a sheet up. `null` means "opened
  // via something with no on-screen icon to morph from" (hero buttons,
  // search/spotlight, or in-app navigation), which just skips the morph.
  const [openSource, setOpenSource] = useState(null)
  // Every app id that's actually running — foreground (mobileActive) or
  // minimized to the background — most-recent-first, deduped, capped. A
  // panel only ever leaves this array by being force-quit (closeApp); simply
  // minimizing (mobileActive -> null) keeps it here, and its <MobilePanel>
  // stays mounted the whole time so its component state (scroll position,
  // form input, the RPS score...) survives the round trip, same as a real
  // backgrounded iOS app.
  const [openApps, setOpenApps] = useState([])
  const [islandOpen, setIslandOpen] = useState(false)
  useEffect(() => {
    if (mobileActive) setOpenApps((prev) => [mobileActive, ...prev.filter((x) => x !== mobileActive)].slice(0, 6))
  }, [mobileActive])
  // Only relevant to the transition that just foregrounded `mobileActive`;
  // clearing it after the transition settles means restoring a minimized app
  // later just un-minimizes it in place instead of re-morphing from a home
  // icon that may no longer even be on screen.
  useEffect(() => {
    if (!mobileActive) return
    const t = setTimeout(() => setOpenSource(null), 500)
    return () => clearTimeout(t)
  }, [mobileActive])

  const openApp = (id, source = null) => {
    setOpenSource(source)
    setMobileActive(id)
    setIslandOpen(false)
  }
  // Minimize: drop to the home screen, keep the app alive in the background.
  const minimizeApp = () => setMobileActive(null)
  // Force-quit: actually unmount it, losing its in-memory state — only
  // reachable from the Dynamic Island's switcher (the "×" on the current app
  // or on a backgrounded one), mirroring iOS's swipe-away-to-quit.
  const closeApp = (id) => {
    setOpenApps((prev) => prev.filter((x) => x !== id))
    if (mobileActive === id) setMobileActive(null)
  }

  // One-shot Dynamic-Island pulse: replays whenever the open app changes
  // (opening OR closing), keyed by a nonce so AnimatePresence always sees a
  // fresh element to animate in rather than a no-op prop change.
  const prevActiveRef = useRef(mobileActive)
  const [pulseNonce, setPulseNonce] = useState(0)
  useEffect(() => {
    if (mobileActive !== prevActiveRef.current) setPulseNonce((n) => n + 1)
    prevActiveRef.current = mobileActive
  }, [mobileActive])

  const backgroundApps = openApps.filter((id) => id !== mobileActive)
  const islandTappable = openApps.length > 0

  return (
    <div className="rzw-mobile">
      {!reduceMotion && <ConstellationGrid dark={theme === 'dark'} spacing={70} lineOpacityScale={0.55} />}

      <div className="rzw-phone-status">
        <span className="time">{clock}</span>
        {islandOpen && (
          <motion.div
            className="rzw-island-scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setIslandOpen(false)}
          />
        )}
        <motion.div
          className={`rzw-dynamic-island${mobileActive ? ' has-app' : ''}${islandOpen ? ' expanded' : ''}`}
          layout
          transition={{ layout: { type: 'spring', stiffness: 340, damping: 30 } }}
          role="button" tabIndex={islandTappable ? 0 : -1}
          aria-label={mobileActive ? `Now open: ${mobileAppTitle(mobileActive)}. Tap to see running apps.` : 'Running apps'}
          onClick={() => !islandOpen && islandTappable && setIslandOpen(true)}
          onKeyDown={(e) => { if (!islandOpen && islandTappable && (e.key === 'Enter' || e.key === ' ')) setIslandOpen(true) }}
        >
          {!islandOpen ? (
            <span className="rzw-dynamic-island-inner">
              {mobileActive && (
                <motion.span
                  className="rzw-dynamic-island-app" style={{ '--icon-c': ICON_COLOR[mobileActive] }}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <AppIcon id={mobileActive} size={13} mobile />
                </motion.span>
              )}
              <span className="rzw-dynamic-island-cam" />
            </span>
          ) : (
            <motion.div
              className="rzw-dynamic-island-content"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.08 } }} exit={{ opacity: 0 }}
            >
              {mobileActive ? (
                <div className="rzw-island-now">
                  <span className="rzw-glyph rzw-island-now-icon" style={{ '--icon-c': ICON_COLOR[mobileActive] }}>
                    <AppIcon id={mobileActive} size={16} mobile />
                  </span>
                  <span className="rzw-island-now-meta">
                    <span className="k">Now Open</span>
                    <span className="t">{mobileAppTitle(mobileActive)}</span>
                  </span>
                  <motion.button
                    type="button" className="rzw-island-x" aria-label="Close app" whileTap={{ scale: 0.82 }}
                    onClick={(e) => { e.stopPropagation(); closeApp(mobileActive) }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </motion.button>
                </div>
              ) : (
                <p className="rzw-island-heading">Background Apps</p>
              )}
              {backgroundApps.length > 0 && (
                <div className="rzw-island-bg">
                  {mobileActive && <span className="rzw-island-bg-label">Running</span>}
                  <div className="rzw-island-bg-row">
                    {backgroundApps.map((id) => (
                      <span className="rzw-island-bg-item" key={id}>
                        <motion.button
                          type="button" className="rzw-island-bg-open" whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); openApp(id, 'island') }}
                        >
                          <span className="rzw-glyph" style={{ '--icon-c': ICON_COLOR[id] }}>
                            <AppIcon id={id} size={16} mobile />
                          </span>
                          <span className="l">{mobileAppTitle(id)}</span>
                        </motion.button>
                        <button
                          type="button" className="rzw-island-bg-x" aria-label={`Quit ${mobileAppTitle(id)}`}
                          onClick={(e) => { e.stopPropagation(); closeApp(id) }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {!mobileActive && backgroundApps.length === 0 && (
                <p className="rzw-island-empty">No apps running</p>
              )}
            </motion.div>
          )}
          {!reduceMotion && (
            <AnimatePresence>
              {pulseNonce > 0 && (
                <motion.span
                  key={pulseNonce}
                  className={mobileActive === 'assistant' ? 'rzw-island-glow assistant' : 'rzw-island-glow'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, times: [0, 0.35, 1], ease: EASE }}
                  onAnimationComplete={() => setPulseNonce(0)}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>
        <span className="sicons">
          <motion.button type="button" className="rzw-status-theme" aria-label="Toggle theme" whileTap={{ scale: 0.85 }}
            onClick={onToggleTheme}>
            {theme === 'dark' ? <MoonIcon size={13} /> : <SunIcon size={13} />}
          </motion.button>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="0.5" /><rect x="4.5" y="4" width="3" height="7" rx="0.5" /><rect x="9" y="1.5" width="3" height="9.5" rx="0.5" /></svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 4a10 8 0 0 1 13 0" /><path d="M3.2 6.6a6.5 5 0 0 1 8.6 0" /><path d="M5.6 9a3 2.3 0 0 1 3.8 0" /><circle cx="7.5" cy="10.4" r="0.9" fill="currentColor" stroke="none" /></svg>
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.5" y="0.8" width="17" height="9.4" rx="2.4" /><rect x="18" y="3.5" width="1.6" height="4" rx="0.8" fill="currentColor" stroke="none" /><rect x="2" y="2.3" width="13" height="6.4" rx="1.2" fill="currentColor" stroke="none" /></svg>
        </span>
      </div>

      <div className="rzw-phone-screen">
        <MobileHome
          mobileActive={mobileActive} openSource={openSource} onOpen={openApp}
          onSearch={() => setSpotlightOpen(true)}
        />

        <AnimatePresence>
          {openApps.map((id) => (
            <MobilePanel
              key={id} id={id} active={id === mobileActive}
              openSource={id === mobileActive ? openSource : null}
              onMinimize={minimizeApp} onOpenApp={(nid) => openApp(nid)}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {spotlightOpen && <Spotlight onClose={() => setSpotlightOpen(false)} onOpen={(id) => { setSpotlightOpen(false); openApp(id) }} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// One instance per running app (foreground or backgrounded), and it never
// unmounts just from being minimized — only closeApp (force-quit) removes it
// from `openApps` and lets it actually exit. `active` toggles it between a
// full-screen foreground state and a hidden-but-alive background state, so
// AppBody's own component state (scroll position, form input, game score...)
// survives the round trip exactly like a real backgrounded iOS app.
function MobilePanel({ id, active, openSource, onMinimize, onOpenApp }) {
  const dragControls = useDragControls()
  return (
    <motion.div
      className="rzw-mobile-panel"
      style={{ zIndex: active ? 20 : 10, pointerEvents: active ? 'auto' : 'none' }}
      initial={{ y: 34, opacity: 0, scale: 0.95 }}
      animate={active ? { y: 0, opacity: 1, scale: 1 } : { y: 34, opacity: 0, scale: 0.95 }}
      exit={{ y: 34, opacity: 0, scale: 0.95, transition: { duration: 0.16, ease: EASE } }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.22, bottom: 0 }}
      onDragEnd={(e, info) => {
        if (active && (info.offset.y > 100 || info.velocity.y > 650)) onMinimize()
      }}
    >
      <div className="rzw-mobile-grabber-row" onPointerDown={(e) => dragControls.start(e)}>
        <span className="rzw-mobile-grabber" aria-hidden="true" />
      </div>
      <div className="rzw-mobile-topbar">
        <motion.button className="rzw-mobile-back" type="button" aria-label="Minimize" whileTap={{ scale: 0.88 }} onClick={onMinimize}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 9l-7 7-7-7" /></svg>
        </motion.button>
        {openSource && openSource !== 'island' ? (
          <motion.span
            className="rzw-glyph rzw-panel-icon" style={{ '--icon-c': ICON_COLOR[id] }}
            layoutId={`app-icon-${openSource}-${id}`}
          >
            <AppIcon id={id} size={16} mobile />
          </motion.span>
        ) : (
          <span className="rzw-glyph rzw-panel-icon" style={{ '--icon-c': ICON_COLOR[id] }}>
            <AppIcon id={id} size={16} mobile />
          </span>
        )}
        <span className="mtitle">{mobileAppTitle(id)}</span>
      </div>
      <div className="rzw-mobile-body">
        <AppBody id={id} onOpenApp={onOpenApp} />
      </div>
    </motion.div>
  )
}
