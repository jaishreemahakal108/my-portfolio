import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { PROJECTS } from '../data'

export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id)
  const project = PROJECTS.find((p) => p.id === selectedId) || PROJECTS[0]

  return (
    <div className="rzw-proj-layout">
      <div className="rzw-proj-sidebar" role="listbox" aria-label="Projects">
        {PROJECTS.map((p) => (
          <button
            key={p.id} type="button" role="option" aria-selected={p.id === selectedId}
            aria-pressed={p.id === selectedId} onClick={() => setSelectedId(p.id)}
          >
            {p.categories.includes('featured') && <span className="rzw-proj-star">★</span>}
            {p.name}
          </button>
        ))}
      </div>
      <div className="rzw-proj-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="rzw-eyebrow">Projects</span>
            <div className="pt" style={{ marginBottom: 2 }}>
              <h2 style={{ display: 'inline' }}>{project.name}</h2>
              {project.categories.includes('featured') && (
                <span className="rzw-featured-tag" style={{ marginLeft: 8 }}>Featured</span>
              )}
            </div>
            <p className="rzw-lede" style={{ marginBottom: 14 }}>{project.tag}</p>

            <span className="rzw-field-label">Overview</span><p>{project.overview}</p>
            <span className="rzw-field-label">Problem</span><p>{project.problem}</p>
            <span className="rzw-field-label">Solution</span><p>{project.solution}</p>
            <span className="rzw-field-label">My Role</span><p>{project.role}</p>
            <span className="rzw-field-label">Key Features</span>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)' }}>
              {project.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <span className="rzw-field-label">Tech Stack</span>
            <div className="rzw-row">{project.stack.map((t) => <span className="rzw-chip" key={t}>{t}</span>)}</div>
            <span className="rzw-field-label">Challenges</span><p>{project.challenges}</p>
            {project.note && <><span className="rzw-field-label">Note</span><p>{project.note}</p></>}
            {project.links.length > 0 && (
              <div className="rzw-row" style={{ marginTop: 14 }}>
                {project.links.map((l) => (
                  <a className="rzw-btn" key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
