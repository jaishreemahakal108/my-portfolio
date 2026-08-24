// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { PROFILE, EDUCATION, EXPERIENCE } from '../data'
import { staggerContainer, fadeUp } from '../motion'

export default function AboutApp() {
  const currentRole = EXPERIENCE[0]

  return (
    <div className="rzw-app-content">
      <div className="rzw-about-header">
        <div>
          <span className="rzw-eyebrow">About</span>
          <h2>{PROFILE.name}</h2>
          <p className="rzw-lede">{PROFILE.role} — {PROFILE.tagline}</p>
        </div>
        <div className="rzw-about-photo-wrap">
          <span className="rzw-about-photo-ring" />
          <img src={PROFILE.photo} alt={PROFILE.name} />
        </div>
      </div>
      <motion.div className="rzw-stack" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="rzw-card" variants={fadeUp} whileHover={{ y: -2 }}>
          <span className="rzw-field-label">Who I Am</span>
          <p>{PROFILE.summary}</p>
        </motion.div>
        <motion.div className="rzw-card" variants={fadeUp} whileHover={{ y: -2 }}>
          <span className="rzw-field-label">What I Build</span>
          <p>
            Full-stack products end to end, plus the AI layer on top — real-time interview platforms,
            voice-driven assistants, and interactive tools, built with React, Node.js and MongoDB.
          </p>
        </motion.div>
        {currentRole && (
          <motion.div className="rzw-card" variants={fadeUp} whileHover={{ y: -2 }}>
            <span className="rzw-field-label">Currently</span>
            <p>
              {currentRole.role} at{' '}
              <a href={currentRole.companyUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {currentRole.company}
              </a>
              {' '}— {currentRole.bullets[0]}
            </p>
          </motion.div>
        )}
        <motion.div variants={fadeUp}>
          <h3 style={{ marginBottom: 14 }}>Education</h3>
          <div className="rzw-timeline">
            {EDUCATION.map((e) => (
              <div className="rzw-tl-item" key={e.title}>
                <div className="rzw-tl-year">{e.year}</div>
                <p><strong style={{ color: 'var(--text-primary)' }}>{e.title}</strong><br />{e.place} — {e.meta}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="rzw-card" variants={fadeUp} whileHover={{ y: -2 }}>
          <span className="rzw-field-label">Get in Touch</span>
          <div className="rzw-row" style={{ marginTop: 6 }}>
            <a className="rzw-btn primary" href={`mailto:${PROFILE.email}`}>Email Me</a>
            <a className="rzw-btn" href={PROFILE.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            <a className="rzw-btn" href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
