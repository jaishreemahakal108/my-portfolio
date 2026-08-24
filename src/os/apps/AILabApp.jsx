import { AI_LAB, PROJECTS } from '../data'

export default function AILabApp() {
  return (
    <div className="rzw-app-content">
      <span className="rzw-eyebrow">AI Lab</span>
      <h2>AI work &amp; experiments</h2>
      <p className="rzw-lede">How AI is actually integrated across real projects — not just calling an API once.</p>
      <div className="rzw-stack">
        {AI_LAB.map((item, i) => {
          const project = PROJECTS.find((p) => p.id === item.project)
          return (
            <details className="rzw-details" key={item.title} open={i === 0}>
              <summary>{item.title}</summary>
              <div className="rzw-details-inner">
                <span className="rzw-field-label">Problem</span><p>{item.problem}</p>
                <span className="rzw-field-label">Model / API</span><p>{item.model}</p>
                <span className="rzw-field-label">Integration</span><p>{item.integration}</p>
                {project && <span className="rzw-field-label">Part of</span>}
                {project && <p>{project.name} — see Projects.</p>}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
