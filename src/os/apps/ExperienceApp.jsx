// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { ACHIEVEMENTS, CERTIFICATIONS, EXPERIENCE } from '../data'
import { staggerContainer, fadeUp } from '../motion'

export default function ExperienceApp() {
  return (
    <div className="rzw-app-content">
      <span className="rzw-eyebrow">Experience</span>
      <h2>Work, certifications & achievements</h2>
      <p className="rzw-lede">
        A SaaS engineering internship, real shipped projects, and the certifications behind them.
      </p>
      <motion.div className="rzw-stack" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <h3 style={{ marginBottom: 14 }}>Experience</h3>
          <div className="rzw-stack">
            {EXPERIENCE.map((exp) => (
              <div className="rzw-card" key={exp.role}>
                <span className="rzw-field-label">{exp.role}</span>
                <p>
                  <a href={exp.companyUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {exp.company}
                  </a>
                </p>
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-secondary)' }}>
                  {exp.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h3 style={{ marginBottom: 14 }}>Certifications</h3>
          <div className="rzw-cert-grid">
            {CERTIFICATIONS.map((c) => (
              <div className="rzw-cert-card-wrap" key={c.title}>
                <span className="rzw-cert-ring" />
                <motion.a className="rzw-cert-card" href={c.file} target="_blank" rel="noreferrer" whileHover={{ y: -3 }}>
                  <div className="rzw-cert-thumb">
                    {c.image
                      ? <img src={c.image} alt={c.title} loading="lazy" />
                      : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
                          <path d="M15 2v5h5" />
                        </svg>
                      )}
                  </div>
                  <div className="rzw-cert-meta">
                    <span className="rzw-cert-title">{c.title}</span>
                    {c.issuer && <span className="rzw-cert-issuer">{c.issuer}</span>}
                    <p className="rzw-cert-desc">{c.description}</p>
                    <span className="rzw-cert-link">View Certificate ↗</span>
                  </div>
                </motion.a>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="rzw-card" variants={fadeUp} whileHover={{ y: -2 }}>
          <span className="rzw-field-label">Achievements</span>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ACHIEVEMENTS.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
