import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { ARCHITECTURES, PROJECTS } from '../data'

export default function ArchitectureApp() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id)
  const [active, setActive] = useState('user')
  const arch = ARCHITECTURES[projectId]
  const node = arch.nodes.find((n) => n.id === active) || arch.nodes[0]

  const selectProject = (id) => {
    setProjectId(id)
    setActive(ARCHITECTURES[id].layers[0].nodes[0])
  }

  const NodeButton = ({ id }) => {
    const n = arch.nodes.find((x) => x.id === id)
    return (
      <button type="button" className="rzw-arch-node" aria-pressed={active === id} onClick={() => setActive(id)}>
        {n.label}
      </button>
    )
  }

  return (
    <div className="rzw-app-content" style={{ maxWidth: 660 }}>
      <span className="rzw-eyebrow">Architecture</span>
      <h2>{arch.title}</h2>
      <p className="rzw-lede">Click a component to see its role. Switch projects below to compare architectures.</p>

      <div className="rzw-arch-switcher" role="tablist" aria-label="Project">
        {PROJECTS.map((p) => (
          <button
            key={p.id} type="button" role="tab" className="rzw-arch-tab"
            aria-pressed={projectId === p.id} onClick={() => selectProject(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={projectId}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="rzw-arch-diagram">
            {arch.layers.map((layer, i) => (
              <div key={i} style={{ display: 'contents' }}>
                {i > 0 && <div className="rzw-arch-connector">↓</div>}
                {layer.nodes.length > 1 ? (
                  <div className="rzw-arch-branch">
                    {layer.nodes.map((entry, ci) => {
                      const chain = Array.isArray(entry) ? entry : [entry]
                      return (
                        <div key={ci} className="rzw-arch-branch-col">
                          {chain.map((id, ni) => (
                            <div key={id} style={{ display: 'contents' }}>
                              {ni > 0 && <div className="rzw-arch-connector rzw-arch-connector-small">↓</div>}
                              <NodeButton id={id} />
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <NodeButton id={layer.nodes[0]} />
                )}
              </div>
            ))}
          </div>
          <div className="rzw-card">
            <span className="rzw-field-label">Responsibility</span><p>{node.responsibility}</p>
            <span className="rzw-field-label">Tech</span><p>{node.tech}</p>
            <span className="rzw-field-label">Communicates with</span><p>{node.link}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
