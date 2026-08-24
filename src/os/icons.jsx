import {
  User, FolderKanban, Briefcase, Gauge, Sparkles, Boxes,
  FileText, TerminalSquare, Bot, Mail, Search, Sun, Moon, Compass, Gamepad2,
} from 'lucide-react'

const APP_ICON_MAP = {
  about: User,
  projects: FolderKanban,
  experience: Briefcase,
  skills: Gauge,
  ailab: Sparkles,
  architecture: Boxes,
  resume: FileText,
  contact: Mail,
  terminal: TerminalSquare,
  assistant: Bot,
  safari: Compass,
}

// The phone UI shows an honest game controller glyph for the RPS game
// instead of the desktop's misdirecting Compass/"Safari" disguise — see
// MOBILE_APP_TITLES in data.js for the matching title override.
const MOBILE_ICON_OVERRIDES = { safari: Gamepad2 }

export function AppIcon({ id, size = 20, className = '', mobile = false }) {
  const Icon = (mobile && MOBILE_ICON_OVERRIDES[id]) || APP_ICON_MAP[id] || User
  return <Icon size={size} className={className} strokeWidth={1.8} />
}

export function SearchIcon(props) { return <Search {...props} /> }
export function SunIcon(props) { return <Sun {...props} /> }
export function MoonIcon(props) { return <Moon {...props} /> }
