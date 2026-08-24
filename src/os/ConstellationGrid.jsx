import { useEffect, useRef } from 'react'

// Interactive canvas mesh: a spring-damped grid of nodes that get repelled by
// the cursor and spring back to their anchor point, with proximity
// connections, radar rings, and hex-coordinate readouts drawn each frame.
// Ported from a pasted TypeScript/Next "use client" component — types
// dropped, and colors now derive from the `dark` prop (the OS's own theme
// state) instead of a separate prefers-color-scheme listener, so it always
// matches the in-app light/dark toggle rather than the OS-level preference.
export default function ConstellationGrid({ dark = true, spacing = 55, lineOpacityScale = 1 }) {
  const canvasRef = useRef(null)
  const darkRef = useRef(dark)
  darkRef.current = dark

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId
    let width = 0
    let height = 0

    const mouse = { x: -1000, y: -1000, prevX: -1000, prevY: -1000, vx: 0, vy: 0, radius: 220 }
    let nodes = []

    const initNodes = () => {
      nodes = []
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing
          const y = j * spacing
          nodes.push({
            x, y, vx: 0, vy: 0, baseX: x, baseY: y, homeX: x, homeY: y,
            radius: Math.random() * 1.2 + 1.2,
            label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
            pulse: Math.random() * Math.PI * 2,
            driftPhaseX: Math.random() * Math.PI * 2,
            driftPhaseY: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    // Sized against the canvas's own container rather than the window, so it
    // fits correctly both as the full-viewport desktop wallpaper and inside
    // the smaller, centered phone frame on mobile.
    const container = canvas.parentElement
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      initNodes()
    }

    const setPointerFromClient = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = clientX - rect.left
      mouse.y = clientY - rect.top
    }
    const handleMouseMove = (e) => setPointerFromClient(e.clientX, e.clientY)
    const handlePointerLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    // Passive touch tracking only — never preventDefault, so normal page
    // scroll (e.g. the mobile home screen's app list) keeps working; this is
    // an ambient visual accent, not something worth blocking a gesture for.
    const handleTouchMove = (e) => {
      const t = e.touches[0]
      if (t) setPointerFromClient(t.clientX, t.clientY)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    handleResize()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handlePointerLeave)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handlePointerLeave)
    window.addEventListener('touchcancel', handlePointerLeave)

    let lastTime = performance.now()

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1)
      mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1)
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y
      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy)

      const isDark = darkRef.current
      const bgColor = isDark ? '#1e1e1e' : '#e9e9ee'
      const nodeColor = isDark ? '245, 245, 247' : '29, 29, 31'
      const accentColor = isDark ? '10, 132, 255' : '0, 122, 255'

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      const SPRING_K = 18
      const DAMPING = 0.82
      const DRIFT_AMPLITUDE = spacing * 0.12

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.pulse += dt * 3

        // The anchor itself wanders slowly rather than the node position
        // directly — the spring below then eases toward that moving target
        // for free, giving idle nodes organic drift with no separate motion
        // system, on top of (and undisturbed by) the touch/cursor repulsion.
        n.baseX = n.homeX + Math.sin(now * 0.00018 + n.driftPhaseX) * DRIFT_AMPLITUDE
        n.baseY = n.homeY + Math.cos(now * 0.00014 + n.driftPhaseY) * DRIFT_AMPLITUDE

        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius && dist > 0) {
          const power = 1 - dist / mouse.radius
          const force = power * (1500 + speed * 150)
          const angle = Math.atan2(dy, dx)
          n.vx -= Math.cos(angle) * force * dt
          n.vy -= Math.sin(angle) * force * dt
        }

        const homeDx = n.baseX - n.x
        const homeDy = n.baseY - n.y
        n.vx += homeDx * SPRING_K * dt
        n.vy += homeDy * SPRING_K * dt

        n.vx *= DAMPING
        n.vy *= DAMPING

        n.x += n.vx * dt * 60
        n.y += n.vy * dt * 60
      }

      const MAX_CONN_DIST = 75
      const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const ndx = n.x - n2.x
          const ndy = n.y - n2.y
          const distSq = ndx * ndx + ndy * ndy
          if (distSq < MAX_CONN_DIST_SQ) {
            const nDist = Math.sqrt(distSq)
            const alpha = (1 - nDist / MAX_CONN_DIST) * (isDark ? 0.18 : 0.08) * lineOpacityScale
            ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNear = dist < mouse.radius

        const baseAlpha = isNear ? 0.95 : 0.25 + Math.sin(n.pulse) * 0.1
        ctx.fillStyle = isNear ? `rgba(${accentColor}, ${baseAlpha})` : `rgba(${nodeColor}, ${baseAlpha})`
        const currentRadius = isNear ? n.radius * 2.2 : n.radius + Math.sin(n.pulse) * 0.3

        ctx.beginPath()
        ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2)
        ctx.fill()

        if (dist < 90) {
          const pulseRing = ((n.pulse * 20) % 30) + 4
          const ringAlpha = (1 - pulseRing / 34) * 0.4
          ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2)
          ctx.stroke()

          ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace'
          ctx.fillStyle = `rgba(${accentColor}, 0.85)`
          ctx.fillText(n.label, n.x + 10, n.y - 10)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handlePointerLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handlePointerLeave)
      window.removeEventListener('touchcancel', handlePointerLeave)
    }
    // spacing/lineOpacityScale are fixed per call site (desktop vs. mobile
    // pass different constants) and never change for a mounted instance —
    // only `dark` needs live updates, handled via darkRef instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="rzw-constellation-canvas" />
}
