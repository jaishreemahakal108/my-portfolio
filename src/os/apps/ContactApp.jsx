import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { PROFILE } from '../data'
import { staggerContainer, fadeUp } from '../motion'

export default function ContactApp() {
  const [leetcode, setLeetcode] = useState(null)
  const [github, setGithub] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    fetch(`https://leetcode-stats-api.herokuapp.com/${PROFILE.leetcode}`)
      .then((r) => r.json())
      .then(setLeetcode)
      .catch(() => {})

    fetch(`https://api.github.com/users/${PROFILE.github}`)
      .then((r) => r.json())
      .then(setGithub)
      .catch(() => {})
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields.')

    const body = `Hi Rajaswa,\n\nI'm ${form.name} and wanted to reach out about:\n"${form.message}"\n\nYou can reply to me at ${form.email}.\n\n${form.name}`
    const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      `New message from ${form.name}`
    )}&body=${encodeURIComponent(body)}`

    toast.success('Opening your email app…')
    window.location.href = mailto
    setForm({ name: '', email: '', message: '' })
  }

  const leetPercent = leetcode?.totalQuestions
    ? Math.round((leetcode.totalSolved / leetcode.totalQuestions) * 100)
    : 0

  return (
    <div className="rzw-app-content rzw-contact-embed">
      <span className="rzw-eyebrow">Contact</span>
      <h2>Let's connect</h2>
      <p className="rzw-lede">Open to collaborations and full-stack / AI engineering roles.</p>

      <motion.div className="rzw-row" style={{ marginBottom: 18, alignItems: 'stretch' }} variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="rzw-social-card" style={{ flex: '1 1 150px' }} variants={fadeUp} whileHover={{ y: -3 }}>
          <h3>GitHub</h3>
          <p>@{github?.login ?? PROFILE.github}</p>
          <p style={{ fontSize: 12 }}>Repos: {github?.public_repos ?? '—'} · Followers: {github?.followers ?? '—'}</p>
          <a className="rzw-btn" style={{ marginTop: 10 }} href={PROFILE.githubUrl} target="_blank" rel="noreferrer">Visit Profile</a>
        </motion.div>
        <motion.div className="rzw-social-card" style={{ flex: '1 1 150px' }} variants={fadeUp} whileHover={{ y: -3 }}>
          <h3>LeetCode</h3>
          {leetcode ? (
            <>
              <p>{leetcode.totalSolved} / {leetcode.totalQuestions} solved</p>
              <div style={{ width: '100%', background: 'var(--border)', borderRadius: 999, height: 6, marginTop: 6 }}>
                <motion.div
                  style={{ background: 'var(--accent)', height: 6, borderRadius: 999 }}
                  initial={{ width: 0 }} animate={{ width: `${leetPercent}%` }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12 }}>@{PROFILE.leetcode}</p>
          )}
          <a className="rzw-btn" style={{ marginTop: 10 }} href={PROFILE.leetcodeUrl} target="_blank" rel="noreferrer">View Profile</a>
        </motion.div>
        <motion.div className="rzw-social-card" style={{ flex: '1 1 150px' }} variants={fadeUp} whileHover={{ y: -3 }}>
          <h3>LinkedIn</h3>
          <p>@{PROFILE.linkedin}</p>
          <a className="rzw-btn" style={{ marginTop: 10 }} href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer">Connect</a>
        </motion.div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit} className="rzw-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        <span className="rzw-field-label">Send a message</span>
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
        <textarea name="message" placeholder="Your Message" rows={4} value={form.message} onChange={handleChange} />
        <motion.button type="submit" className="rzw-btn primary" style={{ justifyContent: 'center' }} whileTap={{ scale: 0.97 }}>
          Send via Email Client
        </motion.button>
      </motion.form>
    </div>
  )
}
