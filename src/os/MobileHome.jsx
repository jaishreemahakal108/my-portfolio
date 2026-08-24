import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, animate, useMotionValue } from 'framer-motion'
import { AppIcon, SearchIcon } from './icons'
import {
  PROFILE, ICON_COLOR, mobileAppTitle,
  MOBILE_DEFAULT_LAYOUT, MOBILE_ALL_APPS, MOBILE_APP_LIBRARY_SECTIONS,
} from './data'
import { staggerContainer, fadeUp } from './motion'

const LAYOUT_KEY = 'rzw-mobile-layout'
const EDGE_ZONE = 30
const EDGE_HOLD_MS = 500
const LONG_PRESS_MS = 480
const EASE = [0.32, 0.72, 0, 1]

const iconListVariants = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }
const iconItemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } } }

// Reads the persisted per-visitor home-screen layout, defensively merging in
// any app id that exists in the app roster but not yet in the saved layout
// (so a future new app never silently disappears) and dropping unknown/
// duplicate ids from a stale or hand-edited save.
function loadLayout() {
  try {
    const raw = JSON.parse(localStorage.getItem(LAYOUT_KEY))
    if (!Array.isArray(raw) || raw.length === 0) throw new Error('empty')
    const known = new Set(MOBILE_ALL_APPS)
    const seen = new Set()
    const cleaned = raw.map((screen) => (Array.isArray(screen) ? screen : []).filter((id) => {
      if (!known.has(id) || seen.has(id)) return false
      seen.add(id)
      return true
    }))
    const missing = MOBILE_ALL_APPS.filter((id) => !seen.has(id))
    if (missing.length) cleaned[cleaned.length - 1] = [...(cleaned.at(-1) || []), ...missing]
    return cleaned.length ? cleaned : MOBILE_DEFAULT_LAYOUT.map((s) => [...s])
  } catch {
    return MOBILE_DEFAULT_LAYOUT.map((s) => [...s])
  }
}

function HomeIcon({ id, size = 24, editMode, isGhostSource, layoutId, onPress, onLongPressStart, onDragPointerDown, iconRef }) {
  return (
    <motion.button
      ref={iconRef}
      type="button" className={`rzw-dicon${editMode ? ' rzw-dicon-editing' : ''}`}
      variants={iconItemVariants}
      style={editMode ? { '--jiggle-delay': `${(id.length * 47) % 300}ms` } : undefined}
      whileTap={!editMode ? { scale: 0.90, transition: { type: 'spring', stiffness: 480, damping: 18, mass: 0.6 } } : undefined}
      onPointerDown={(e) => { if (editMode) onDragPointerDown(e, id); else onLongPressStart(e) }}
      onClick={() => { if (!editMode) onPress(id) }}
    >
      <motion.span
        className="rzw-glyph" style={{ '--icon-c': ICON_COLOR[id], opacity: isGhostSource ? 0 : 1 }}
        layoutId={isGhostSource ? layoutId : undefined}
      >
        <AppIcon id={id} size={size} mobile />
      </motion.span>
      <span className="label">{mobileAppTitle(id)}</span>
    </motion.button>
  )
}

function PageDots({ count, page, onLibraryClick }) {
  if (count <= 1) return null
  return (
    <div className="rzw-page-dots">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`rzw-page-dot${i === page ? ' active' : ''}`} aria-hidden="true" />
      ))}
      <button
        type="button"
        className={`rzw-page-dot-library${page === count ? ' active' : ''}`}
        onClick={onLibraryClick}
        aria-label="Open App Library"
      />
    </div>
  )
}

export default function MobileHome({ mobileActive, openSource, onOpen, onSearch }) {
  const [layout, setLayout] = useState(loadLayout)
  const [page, setPage] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const totalPages = layout.length + 1 // + App Library

  // The pointer-move/edge-paging handlers below are attached once per drag
  // gesture (effect keyed on `drag`, not on every render), so reading `layout`
  // directly would give them a stale snapshot from drag-start after the very
  // first mid-drag reorder. Mirroring it into a ref keeps every hit-test
  // reading the true current arrangement without re-subscribing the effect.
  const layoutRef = useRef(layout)
  useEffect(() => { layoutRef.current = layout }, [layout])

  const screenRef = useRef(null) // the phone-screen viewport, for edge detection
  const trackRef = useRef(null)
  const [pageWidth, setPageWidth] = useState(360)
  const x = useMotionValue(0)
  const iconRefs = useRef(new Map())

  const [drag, setDrag] = useState(null) // { id, w, h }
  const ghostX = useMotionValue(0)
  const ghostY = useMotionValue(0)
  const dragScreenRef = useRef(0)
  const dragRef = useRef(null)
  const edgeTimerRef = useRef(null)
  const longPressTimerRef = useRef(null)

  useEffect(() => { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)) }, [layout])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setPageWidth(el.clientWidth || 360)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const controls = animate(x, -page * pageWidth, { type: 'spring', stiffness: 380, damping: 38 })
    return controls.stop
  }, [page, pageWidth, x])

  const goToPage = (p) => setPage(Math.max(0, Math.min(totalPages - 1, p)))

  const moveIcon = (id, fromScreen, toScreen, toIndex) => {
    setLayout((prev) => {
      const next = prev.map((s) => s.slice())
      if (!next[fromScreen] || !next[toScreen]) return prev
      const fi = next[fromScreen].indexOf(id)
      if (fi !== -1) next[fromScreen].splice(fi, 1)
      const clampedIndex = Math.max(0, Math.min(next[toScreen].length, toIndex))
      next[toScreen].splice(clampedIndex, 0, id)
      return next
    })
  }

  const addScreen = () => setLayout((prev) => [...prev, []])

  // ---------------- icon drag-to-reorder (manual pointer tracking) ----------------
  const startDrag = (e, id) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragScreenRef.current = page
    dragRef.current = { id, w: rect.width, h: rect.height, currentScreen: page }
    ghostX.set(rect.left)
    ghostY.set(rect.top)
    setDrag({ id, w: rect.width, h: rect.height })
  }

  // The single source of truth while a drag is in progress: `dragScreenRef`
  // is whichever screen is currently being *viewed* (updated the instant
  // edge-paging fires), while `dragRef.current.currentScreen` is whichever
  // screen array the dragged id actually *lives in* right now. Reconciling
  // the two on every hit-test — moving the id into the viewed screen the
  // moment they diverge — is what makes both plain same-screen reordering
  // and "drag to the edge, page over, drop" resolve through one code path.
  const hitTestReorder = (clientX, clientY) => {
    const viewedScreen = dragScreenRef.current
    const screenApps = layoutRef.current[viewedScreen]
    if (!screenApps || !dragRef.current) return
    let bestId = null
    let bestDist = Infinity
    // Only compare against icons that actually belong to the screen being
    // viewed — every icon stays registered in iconRefs regardless of page
    // (see getIconRef), but an off-screen neighbor's icon can otherwise sit
    // close enough to the seam to false-match right at the very edge.
    iconRefs.current.forEach((el, id) => {
      if (id === dragRef.current.id || !screenApps.includes(id)) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const d = (cx - clientX) ** 2 + (cy - clientY) ** 2
      if (d < bestDist) { bestDist = d; bestId = id }
    })

    const fromScreen = dragRef.current.currentScreen
    if (bestId && bestDist < 90 * 90) {
      const toIdx = screenApps.indexOf(bestId)
      const alreadyThere = fromScreen === viewedScreen && screenApps.indexOf(dragRef.current.id) === toIdx
      if (!alreadyThere) {
        moveIcon(dragRef.current.id, fromScreen, viewedScreen, toIdx)
        dragRef.current.currentScreen = viewedScreen
      }
    } else if (fromScreen !== viewedScreen && screenApps.length === 0) {
      // Dropped into empty space on a freshly-paged-to (possibly empty) screen.
      moveIcon(dragRef.current.id, fromScreen, viewedScreen, 0)
      dragRef.current.currentScreen = viewedScreen
    }
  }

  const handleEdgePaging = (clientX) => {
    const el = screenRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nearLeft = clientX - rect.left < EDGE_ZONE
    const nearRight = rect.right - clientX < EDGE_ZONE
    if (!nearLeft && !nearRight) {
      if (edgeTimerRef.current) { clearTimeout(edgeTimerRef.current); edgeTimerRef.current = null }
      return
    }
    if (edgeTimerRef.current) return
    edgeTimerRef.current = setTimeout(() => {
      edgeTimerRef.current = null
      const maxHomeScreen = layoutRef.current.length - 1
      const dir = nearLeft ? -1 : 1
      const next = Math.max(0, Math.min(maxHomeScreen, dragScreenRef.current + dir))
      if (next !== dragScreenRef.current) {
        dragScreenRef.current = next
        setPage(next)
      }
    }, EDGE_HOLD_MS)
  }

  useEffect(() => {
    if (!drag) return
    const onMove = (e) => {
      ghostX.set(e.clientX - drag.w / 2)
      ghostY.set(e.clientY - drag.h / 2)
      hitTestReorder(e.clientX, e.clientY)
      handleEdgePaging(e.clientX)
    }
    const onUp = () => {
      if (edgeTimerRef.current) { clearTimeout(edgeTimerRef.current); edgeTimerRef.current = null }
      dragRef.current = null
      setDrag(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag])

  const onLongPressStart = (e) => {
    const el = e.currentTarget
    longPressTimerRef.current = setTimeout(() => setEditMode(true), LONG_PRESS_MS)
    const cancel = () => { clearTimeout(longPressTimerRef.current); el.removeEventListener('pointerup', cancel); el.removeEventListener('pointermove', cancel) }
    el.addEventListener('pointerup', cancel, { once: true })
    el.addEventListener('pointermove', cancel, { once: true })
  }

  // A stable (memoized) callback per id, rather than a fresh closure every
  // render — motion.* components merge an internal ref with the caller's
  // ref, and toggling that external ref between `undefined` and a new
  // function each render isn't reliably re-attached. Icons never truly
  // unmount during a reorder (React matches them by `key={id}` and just
  // repositions them), so a ref set once here stays valid; off-screen pages'
  // icons are harmless to also register since their real (translated-away)
  // positions are far outside any hit-test's 90px radius.
  const refCallbacks = useRef(new Map())
  const getIconRef = (id) => {
    if (!refCallbacks.current.has(id)) {
      refCallbacks.current.set(id, (el) => {
        if (el) iconRefs.current.set(id, el)
        else iconRefs.current.delete(id)
      })
    }
    return refCallbacks.current.get(id)
  }

  return (
    <div className="rzw-mhome" ref={screenRef}>
      {editMode && (
        <div className="rzw-mhome-editbar">
          <span>Edit Home Screen</span>
          <span className="rzw-mhome-editbar-actions">
            <button type="button" onClick={addScreen}>+ Add Screen</button>
            <button type="button" className="done" onClick={() => setEditMode(false)}>Done</button>
          </span>
        </div>
      )}

      <motion.div
        className="rzw-mhome-track" ref={trackRef} style={{ x }}
        drag={drag ? false : 'x'} dragConstraints={{ left: -(totalPages - 1) * pageWidth, right: 0 }}
        dragElastic={0.12} dragMomentum={false}
        onDragEnd={(e, info) => {
          const threshold = pageWidth * 0.18
          if (info.offset.x < -threshold || info.velocity.x < -400) goToPage(page + 1)
          else if (info.offset.x > threshold || info.velocity.x > 400) goToPage(page - 1)
          else goToPage(page)
        }}
      >
        {layout.map((screenApps, screenIdx) => (
          <div className="rzw-mhome-page" key={screenIdx} style={{ width: pageWidth }}>
            {screenIdx === 0 && (
              <motion.div className="rzw-home-hero" variants={staggerContainer} initial="hidden" animate="show">
                <motion.div className="heyebrow" variants={fadeUp}>{PROFILE.role}</motion.div>
                <motion.h2 variants={fadeUp}>{PROFILE.name}</motion.h2>
                <motion.p className="role" variants={fadeUp}>{PROFILE.tagline}</motion.p>
                <motion.div className="rzw-row" variants={fadeUp}>
                  <motion.button className="rzw-btn primary" type="button"
                    whileTap={{ scale: 0.94, transition: { type: 'spring', stiffness: 420, damping: 16 } }}
                    onClick={() => onOpen('projects')}>View Work</motion.button>
                  <motion.button className="rzw-btn" type="button"
                    whileTap={{ scale: 0.94, transition: { type: 'spring', stiffness: 420, damping: 16 } }}
                    onClick={() => onOpen('resume')}>Resume</motion.button>
                </motion.div>
              </motion.div>
            )}
            {screenIdx === 0 && (
              <motion.button className="rzw-home-search" type="button"
                whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 420, damping: 16 } }}
                onClick={onSearch}
              >
                <SearchIcon size={14} /> Search the portfolio
              </motion.button>
            )}
            <motion.div className="rzw-app-grid" variants={iconListVariants} initial="hidden" animate="show">
              {screenApps.map((id) => {
                const source = `page-${screenIdx}`
                const isGhostSource = drag?.id === id || (openSource === source && mobileActive === id)
                return (
                  <HomeIcon
                    key={id} id={id} editMode={editMode}
                    isGhostSource={isGhostSource}
                    layoutId={drag?.id === id ? undefined : `app-icon-${source}-${id}`}
                    onPress={(pid) => onOpen(pid, source)}
                    onLongPressStart={onLongPressStart}
                    onDragPointerDown={startDrag}
                    iconRef={getIconRef(id)}
                  />
                )
              })}
              {editMode && screenApps.length === 0 && <p className="rzw-mhome-empty">Drag icons here</p>}
            </motion.div>
          </div>
        ))}

        <div className="rzw-mhome-page rzw-app-library" style={{ width: pageWidth }}>
          <h3 className="rzw-mhome-library-title">App Library</h3>
          {MOBILE_APP_LIBRARY_SECTIONS.map((section) => (
            <div className="rzw-mhome-library-section" key={section.title}>
              <span className="rzw-mhome-library-heading">{section.title}</span>
              <div className="rzw-app-grid">
                {section.apps.map((id) => (
                  <HomeIcon
                    key={id} id={id} size={22} editMode={false}
                    isGhostSource={openSource === 'library' && mobileActive === id}
                    layoutId={`app-icon-library-${id}`}
                    onPress={(pid) => onOpen(pid, 'library')}
                    onLongPressStart={() => {}}
                    onDragPointerDown={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {drag && (
        <motion.div className="rzw-mhome-ghost" style={{ x: ghostX, y: ghostY, width: drag.w, height: drag.h }}>
          <span className="rzw-glyph" style={{ '--icon-c': ICON_COLOR[drag.id] }}>
            <AppIcon id={drag.id} size={24} mobile />
          </span>
          <span className="label">{mobileAppTitle(drag.id)}</span>
        </motion.div>
      )}

      <div className="rzw-mhome-nav">
        <PageDots count={layout.length} page={page} onLibraryClick={() => goToPage(layout.length)} />
      </div>
    </div>
  )
}
