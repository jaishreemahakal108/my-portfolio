// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import {
  SiReact, SiJavascript, SiHtml5, SiCss3, SiTailwindcss, SiBootstrap, SiGreensock, SiThreedotjs,
  SiNodedotjs, SiExpress, SiMongoose,
  SiGooglegemini, SiOpenai,
  SiMongodb, SiSupabase, SiMysql, SiRedis,
  SiGit, SiGithub, SiOpenjdk,
  SiClaude, SiGithubcopilot,
} from 'react-icons/si'
import { SKILL_GROUPS } from '../data'
import { staggerContainer, fadeUp } from '../motion'

const SKILL_ICONS = {
  React: SiReact, JavaScript: SiJavascript, HTML5: SiHtml5, CSS: SiCss3, 'Tailwind CSS': SiTailwindcss,
  Bootstrap: SiBootstrap, GSAP: SiGreensock, 'Three.js': SiThreedotjs,
  'Node.js': SiNodedotjs, 'Express.js': SiExpress, Mongoose: SiMongoose,
  'Gemini API': SiGooglegemini, 'OpenAI / ChatGPT API': SiOpenai,
  MongoDB: SiMongodb, Supabase: SiSupabase, MySQL: SiMysql, Redis: SiRedis,
  Git: SiGit, GitHub: SiGithub, Java: SiOpenjdk,
  Claude: SiClaude, 'GitHub Copilot': SiGithubcopilot, 'ChatGPT / Codex': SiOpenai,
}

const chipVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 22 } },
}

function SkillChip({ label }) {
  const Icon = SKILL_ICONS[label]
  return (
    <motion.span className="rzw-skill-chip" variants={chipVariants} whileHover={{ y: -3, scale: 1.06 }}>
      {Icon && <Icon className="rzw-skill-icon" />}
      {label}
    </motion.span>
  )
}

export default function SkillsApp() {
  return (
    <div className="rzw-app-content">
      <span className="rzw-eyebrow">Skills</span>
      <h2>Capabilities, grouped by domain</h2>
      <p className="rzw-lede">Only tools actually used — grouped so it reads as capability, not a logo wall.</p>
      <motion.div className="rzw-stack" variants={staggerContainer} initial="hidden" animate="show">
        {SKILL_GROUPS.map((g, i) => (
          <motion.details className="rzw-details" key={g.key} open={i < 2} variants={fadeUp} whileHover={{ y: -2 }}>
            <summary>{g.title}</summary>
            <div className="rzw-details-inner">
              <motion.div className="rzw-row" variants={staggerContainer} initial="hidden" animate="show">
                {g.skills.map((s) => <SkillChip key={s} label={s} />)}
              </motion.div>
            </div>
          </motion.details>
        ))}
      </motion.div>
    </div>
  )
}
