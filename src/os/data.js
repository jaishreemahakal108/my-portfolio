// Real content only — sourced from Rajaswa_Anand.pdf (resume) and the existing
// AboutMe / Projects / Contact pages. No invented employers, metrics or projects.

export const PROFILE = {
  name: 'Rajaswa Anand',
  role: 'Full-Stack Developer · MERN & AI',
  tagline:
    "I build AI-powered web apps, real-time interview platforms, and full-stack products with React, Node.js and MongoDB.",
  summary:
    'Ambitious software developer with hands-on experience building intelligent, modern web applications — currently completing a B.E. in Artificial Intelligence & Machine Learning.',
  email: 'rajaswaanand108@gmail.com',
  phone: '+91 9123498156',
  github: 'jaishreemahakal108',
  githubUrl: 'https://github.com/jaishreemahakal108',
  linkedin: 'rajaswa-anand',
  linkedinUrl: 'https://www.linkedin.com/in/rajaswa-anand',
  leetcode: 'jaishreemahakal108',
  leetcodeUrl: 'https://leetcode.com/u/jaishreemahakal108/',
  resumeUrl: '/Rajaswa_Anand.pdf',
  photo: '/profile.png',
}

export const EDUCATION = [
  {
    year: '2022 – 2026',
    title: 'B.E. Artificial Intelligence & Machine Learning',
    place: 'RNS Institute of Technology, Bengaluru (VTU)',
    meta: 'CGPA 7.6 / 10',
  },
  {
    year: '2020 – 2022',
    title: 'Senior Secondary (Class 12)',
    place: 'Chauhan Public School, Bhagalpur (CBSE)',
    meta: '72%',
  },
  {
    year: '2019 – 2020',
    title: 'Secondary (Class 10)',
    place: 'Happy Valley School, Bhagalpur (CBSE)',
    meta: '81%',
  },
]

export const EXPERIENCE = [
  {
    role: 'Intern – SaaS FSD Development Engineer',
    company: 'Vibrantix Solutions Pvt Ltd',
    companyUrl: 'https://vibrantix.ai/',
    bullets: [
      'Worked on full-stack SaaS product development for compliance and audit management platforms.',
      'Developed responsive frontend interfaces and backend APIs using modern web technologies.',
      'Contributed to workflow automation systems, reporting dashboards, and scalable platform modules.',
      'Collaborated with engineering teams to build production-ready features and optimize application performance.',
      'Gained hands-on experience with real-world startup workflows, debugging, testing, and deployment practices.',
    ],
  },
]

export const ACHIEVEMENTS = [
  'Won a Gold Medal in state-level under-14 district cricket tournaments.',
  'Organized the cultural fest and technical events for the ENLIGHTERA Club.',
  'Participated in the Bharatiya Antariksh Hackathon, powered by Hack2Skill (2025).',
]

export const CERTIFICATIONS = [
  {
    title: 'Bharatiya Antariksh Hackathon 2025',
    issuer: 'ISRO & Hack2Skill',
    description:
      'Submitted an idea for the Bharatiya Antariksh Hackathon 2025, a national space-tech challenge organized by ISRO and powered by Hack2Skill. Recognized for innovation, curiosity and commitment to solving real-world problems in space and technology. Certificate code 2025H2S06BAH25-P15108.',
    image: '/certificates/hackathon-2025.jpg',
    file: '/certificates/hackathon-2025.jpg',
  },
  {
    title: 'Web Development Certificate',
    issuer: '100xdevs',
    description:
      "Completed the 0–100 Full Stack Web Development course by 100xdevs, founded by Harkirat Singh. Covers full-stack fundamentals from first principles through to shipping production applications. Verified certificate No. MVX21X2Y, completed August 2025.",
    image: '/certificates/web-dev-certificate.png',
    file: '/certificates/web-dev-certificate.pdf',
  },
  {
    title: 'Front-End Development Certificate',
    issuer: 'Sheryians Coding School',
    description:
      'Completed "Front-End Domination" at Sheryians Coding School under Harsh Sharma. In-depth coverage of HTML, CSS, JavaScript, GSAP, Locomotive Scroll, ScrollTrigger, React.js, Tailwind CSS and Redux, with a focus on modern web development and design thinking.',
    file: '/certificates/front-end-certificate.pdf',
  },
]

export const SKILL_GROUPS = [
  {
    key: 'frontend',
    title: 'Frontend Engineering',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS', 'Tailwind CSS', 'Bootstrap', 'GSAP', 'Three.js'],
  },
  {
    key: 'backend',
    title: 'Backend Engineering',
    skills: ['Node.js', 'Express.js', 'Mongoose', 'REST APIs'],
  },
  {
    key: 'ai',
    title: 'AI & Integrations',
    skills: ['Gemini API', 'OpenAI / ChatGPT API', 'VAPI (voice AI)', 'Prompt-driven workflows'],
  },
  {
    key: 'data',
    title: 'Databases & Infra',
    skills: ['MongoDB', 'Supabase', 'MySQL', 'SQL', 'Redis'],
  },
  {
    key: 'core',
    title: 'Tools & Fundamentals',
    skills: ['Git', 'GitHub', 'Java', 'DSA', 'OOP'],
  },
  {
    key: 'ai-tools',
    title: 'AI-Assisted Development',
    skills: ['Claude', 'GitHub Copilot', 'ChatGPT / Codex'],
  },
]

export const PROJECTS = [
  {
    id: 'screening',
    name: 'Screening',
    tag: 'AI-powered interview platform',
    categories: ['featured', 'ai', 'fullstack'],
    overview:
      'An end-to-end AI-driven interview automation platform with two modules: fully AI-led interviews, and human-led real-time video interviews with live collaborative coding.',
    problem:
      'Running first-round technical interviews manually does not scale and is inconsistent across candidates and interviewers.',
    solution:
      'Split into two modules on purpose. The AI Interview Scheduler lets Gemini and ChatGPT generate and evaluate interview questions end to end, backed by Supabase. The Video Calling module gives interviewers real, live-led sessions — Stream SDK for the call, Clerk and Google Auth for access, Convex for reactive real-time state (participant status, live feedback, shared session data) so nothing needs polling or manual refresh.',
    role: 'Solo build — frontend, backend APIs, both real-time data layers, and the AI question/analysis pipeline.',
    features: [
      'Real-time video interviews via Stream SDK with multi-interviewer support and auto-recording',
      'Live collaborative code editor for technical interviews, multiple languages',
      'AI question generation & evaluation via Gemini + ChatGPT, shown in interviewer dashboards',
      'Multi-interviewer collaboration — shared editor and synced feedback panel',
      'Structured feedback system — pass/fail, star rating, comments',
      'Automated, shareable interview links with email invitations',
    ],
    stack: [
      'Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Express.js',
      'Supabase', 'Convex', 'Clerk', 'Google Auth', 'Stream SDK', 'Gemini', 'ChatGPT',
    ],
    challenges:
      'Running two genuinely different real-time data models side by side — Supabase\'s structured Postgres backend for the AI module, and Convex\'s reactive queries/mutations for the low-latency video-call module — and keeping both under one unified dashboard.',
    links: [
      { label: 'Live Demo', url: 'https://screening-au2f.vercel.app/' },
      { label: 'Code Editor Demo', url: 'https://screening-xphh.vercel.app/' },
    ],
  },
  {
    id: 'brain-hunter',
    name: 'Brain Hunter',
    tag: 'Sudoku solver & generator',
    categories: ['featured', 'fullstack'],
    overview: 'A Sudoku solver and generator with an interactive, animated interface.',
    problem: 'Wanted a tool that could both generate solvable puzzles and solve them visually, with immediate error feedback.',
    solution:
      'Built the solver and generator around a backtracking algorithm, with an interactive UI that detects entry errors as you play and supports light/dark mode.',
    role: 'Solo build — algorithm, UI and animation.',
    features: [
      'Backtracking-based solver & generator', 'Real-time error detection',
      'Difficulty levels', 'Light / dark mode', 'GSAP & Three.js-driven interface',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Three.js'],
    challenges: 'Making the backtracking solver fast enough to run client-side without blocking the animated UI.',
    links: [
      { label: 'Live Demo', url: 'https://brain-hunters.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/jaishreemahakal108/BRAIN-HUNTERS' },
    ],
  },
  {
    id: 'yatri-car-rental',
    name: 'Yatri Car Rental',
    tag: 'Car rental & booking platform',
    categories: ['fullstack'],
    overview: 'A car rental and cab booking platform with a map-driven booking flow.',
    problem: 'Wanted a clean, map-based way for a user to browse available cars and book one, instead of a clunky multi-step form.',
    solution:
      'A Next.js + TypeScript app: Redux Toolkit manages cars and booking state, an interactive Leaflet map handles pickup-location selection, Clerk handles authentication, and Framer Motion drives the interface animation.',
    role: 'Solo build — frontend, state management, map integration and auth.',
    features: [
      'Interactive Leaflet map for browsing and booking cars',
      'Redux Toolkit-managed cars and booking state',
      'Clerk-based authentication',
      'Framer Motion-animated interface',
      'Home, About, Book Now and Contact pages',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Leaflet', 'Clerk', 'Framer Motion'],
    challenges: 'Keeping map state, booking state and auth in sync through one smooth booking flow.',
    links: [{ label: 'GitHub', url: 'https://github.com/jaishreemahakal108/Yatri-Car-Rental' }],
  },
  {
    id: 'ai-assistant',
    name: 'AI Virtual Assistant',
    tag: 'Gemini-powered voice assistant',
    categories: ['ai'],
    overview: 'An intelligent, voice-based assistant built around the Gemini API.',
    problem: 'Explored what a conversational, voice-driven assistant needs beyond the model call itself.',
    solution: 'A React/Node app wiring Gemini into a voice interface, with user authentication, session handling and cloud uploads.',
    role: 'Solo build — full stack, auth and AI integration.',
    features: ['Voice-based interaction', 'Gemini AI integration', 'Authentication & session handling', 'Cloud uploads'],
    stack: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Gemini AI'],
    challenges: 'Handling session state and cloud uploads cleanly around a streaming voice/AI interaction loop.',
    links: [],
    note: 'Not publicly deployed — demo available on request.',
  },
]

export const AI_LAB = [
  {
    title: 'AI Interview Question Generation & Analysis',
    problem: 'Generating fair, role-relevant interview questions and scoring answers consistently.',
    model: 'Gemini + ChatGPT, used together for question generation and response analysis.',
    integration: 'Part of the Screening platform — questions are generated per session and candidate responses are analysed for the reviewer dashboard.',
    project: 'screening',
  },
  {
    title: 'Gemini Voice Assistant',
    problem: 'Building a conversational assistant that goes beyond a single request/response call.',
    model: 'Gemini API.',
    integration: 'Drives a voice-based assistant with authentication, session handling and cloud uploads.',
    project: 'ai-assistant',
  },
]

// Per-project architecture, derived from each project's real, documented
// stack and features above — not invented. `layers` describes the diagram
// shape top-to-bottom; a layer with more than one id renders as a branch.
export const ARCHITECTURES = {
  // Screening splits into two independently-built modules past the shared
  // frontend — an AI-led interview pipeline and a human-led video-call
  // pipeline — each with its own backend and its own database, chosen for
  // what that module actually needs. A branch entry that's itself an array
  // of ids renders as a small vertical mini-chain within that column, so
  // both module pipelines can be shown end-to-end side by side.
  screening: {
    title: 'Screening — AI-Powered Interview Platform',
    layers: [
      { nodes: ['user'] },
      { nodes: ['frontend'] },
      { nodes: [['ai-api', 'gemini', 'supabase'], ['stream', 'clerk', 'convex']] },
    ],
    nodes: [
      { id: 'user', label: 'User (Candidate / Interviewer)', responsibility: 'Joins either an AI-led interview or a human-led video call.', tech: '—', link: 'Talks to the frontend over HTTPS.' },
      { id: 'frontend', label: 'Frontend — Next.js + Tailwind', responsibility: 'Unified dashboard that routes a session into whichever module it needs.', tech: 'Next.js, React, Tailwind CSS, TypeScript', link: 'Routes into the AI module or the video-call module.' },
      { id: 'ai-api', label: 'AI Interview Backend — Node/Express', responsibility: 'Orchestrates AI-led interviews: builds prompts, requests questions, stores evaluations.', tech: 'Node.js, Express.js', link: 'Calls Gemini/ChatGPT, reads/writes Supabase.' },
      { id: 'gemini', label: 'Gemini + ChatGPT', responsibility: 'Generates domain-specific questions and evaluates candidate answers in real time.', tech: 'Gemini API, OpenAI API', link: 'Called by the AI interview backend per session.' },
      { id: 'supabase', label: 'Supabase (AI module)', responsibility: 'Stores candidate profiles, AI evaluations, interview results and feedback.', tech: 'Supabase (Postgres)', link: 'Read/written by the AI interview backend.' },
      { id: 'stream', label: 'Stream SDK', responsibility: 'Real-time video calls with multi-interviewer support, live code editor, and recording.', tech: 'Stream SDK', link: 'Streams to/from the frontend during a live call.' },
      { id: 'clerk', label: 'Clerk + Google Auth', responsibility: 'Authenticates interviewers and candidates before a call can start.', tech: 'Clerk, Google Auth', link: 'Gatekeeps the video-call module.' },
      { id: 'convex', label: 'Convex (Video-call module)', responsibility: 'Reactive real-time sync for participant status, live feedback and shared session state — no polling.', tech: 'Convex', link: 'Read/written live throughout the call.' },
    ],
  },
  'brain-hunter': {
    title: 'Brain Hunter — Sudoku Solver & Generator',
    layers: [
      { nodes: ['user'] },
      { nodes: ['ui'] },
      { nodes: ['solver', 'renderer'] },
    ],
    nodes: [
      { id: 'user', label: 'User (Player)', responsibility: 'Enters/edits Sudoku cells, requests a new puzzle.', tech: '—', link: 'Interacts directly with the UI in the browser.' },
      { id: 'ui', label: 'UI — HTML / CSS / JS', responsibility: 'Renders the grid, handles input and real-time entry-error detection.', tech: 'HTML, CSS, JavaScript', link: 'Calls the solver engine and the renderer.' },
      { id: 'solver', label: 'Solver / Generator Engine', responsibility: 'Backtracking algorithm that both solves and generates valid puzzles.', tech: 'JavaScript (backtracking)', link: 'Returns board state to the UI layer.' },
      { id: 'renderer', label: 'Animated Renderer', responsibility: 'Animates cell fills and transitions, and drives the light/dark theme.', tech: 'GSAP, Three.js', link: 'Reads board state from the UI layer.' },
    ],
  },
  'ai-assistant': {
    title: 'AI Virtual Assistant',
    layers: [
      { nodes: ['user'] },
      { nodes: ['frontend'] },
      { nodes: ['api'] },
      { nodes: ['gemini', 'storage'] },
    ],
    nodes: [
      { id: 'user', label: 'User', responsibility: 'Speaks or types requests, receives voice responses.', tech: '—', link: 'Talks to the frontend via mic/browser.' },
      { id: 'frontend', label: 'Frontend — React + Tailwind', responsibility: 'Voice capture, chat UI, and authentication screens.', tech: 'React, Tailwind CSS', link: 'Calls the API layer.' },
      { id: 'api', label: 'API — Node.js', responsibility: 'Handles authentication and session state, routes requests to Gemini.', tech: 'Node.js', link: 'Routes to Gemini and storage.' },
      { id: 'gemini', label: 'Gemini AI', responsibility: 'Generates conversational responses from user input.', tech: 'Gemini API', link: 'Called by the API layer per user message.' },
      { id: 'storage', label: 'Database — MongoDB', responsibility: 'Stores user sessions and cloud-uploaded content.', tech: 'MongoDB', link: 'Read/written by the API layer.' },
    ],
  },
  'yatri-car-rental': {
    title: 'Yatri Car Rental — Cab Booking Platform',
    layers: [
      { nodes: ['user'] },
      { nodes: ['frontend'] },
      { nodes: ['redux', 'map', 'auth'] },
    ],
    nodes: [
      { id: 'user', label: 'User', responsibility: 'Browses available cars, picks a location, books a ride.', tech: '—', link: 'Interacts with the Next.js frontend.' },
      { id: 'frontend', label: 'Frontend — Next.js + Tailwind', responsibility: 'Home, About, Book Now and Contact pages; renders the booking flow.', tech: 'Next.js, React, TypeScript, Tailwind CSS', link: 'Reads/writes Redux state, renders the map.' },
      { id: 'redux', label: 'Redux Toolkit', responsibility: 'Manages cars and booking state (carsSlice, bookingSlice) across the app.', tech: 'Redux Toolkit, react-redux', link: 'Shared state read by the booking UI.' },
      { id: 'map', label: 'Leaflet Map', responsibility: 'Interactive map for picking pickup locations and viewing available cars.', tech: 'Leaflet, react-leaflet', link: 'Feeds location data into the booking flow.' },
      { id: 'auth', label: 'Clerk Authentication', responsibility: 'Signs users in before they can complete a booking.', tech: 'Clerk (@clerk/nextjs)', link: 'Gatekeeps the Book Now flow via middleware.' },
    ],
  },
}

export const TERMINAL_HELP = `Available commands:
  help        show this list
  whoami      who I am
  skills      technical skills
  projects    project list
  education   education timeline
  resume      open Resume
  contact     how to reach me
  clear       clear the screen`

export const SPOTLIGHT_INDEX = [
  { label: 'About — Who I Am', app: 'about', kw: 'about who intro profile summary' },
  { label: 'Projects — Screening (AI Interview Platform)', app: 'projects', kw: 'screening ai interview platform gemini chatgpt vapi featured' },
  { label: 'Projects — Brain Hunter', app: 'projects', kw: 'brain hunter sudoku solver generator backtracking' },
  { label: 'Projects — AI Virtual Assistant', app: 'projects', kw: 'ai virtual assistant gemini voice' },
  { label: 'Experience — Vibrantix Solutions Internship', app: 'experience', kw: 'vibrantix solutions saas fsd intern experience work' },
  { label: 'Experience — Education & Achievements', app: 'experience', kw: 'rns institute vtu education achievements hackathon' },
  { label: 'Skills — MongoDB & Supabase', app: 'skills', kw: 'mongodb supabase database' },
  { label: 'Skills — Gemini & ChatGPT', app: 'skills', kw: 'gemini chatgpt openai ai vapi' },
  { label: 'AI Lab — Interview Question Generation', app: 'ailab', kw: 'ai lab rag gemini chatgpt experiments' },
  { label: 'Architecture — Screening System Diagram', app: 'architecture', kw: 'architecture system diagram backend ai realtime' },
  { label: 'Resume', app: 'resume', kw: 'resume cv download pdf' },
  { label: 'Contact', app: 'contact', kw: 'contact email github linkedin leetcode reach hire' },
  { label: 'Terminal', app: 'terminal', kw: 'terminal command line shell' },
]

export const APP_TITLES = {
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  ailab: 'AI Lab',
  architecture: 'Architecture',
  resume: 'Resume',
  contact: 'Contact',
  terminal: 'Terminal',
  assistant: 'RZW Assistant',
  safari: 'Safari',
}

// Distinct iOS/macOS-style system colors per app icon.
export const ICON_COLOR = {
  about: '#0A84FF',
  projects: '#5E5CE6',
  experience: '#FF9F0A',
  skills: '#40C8E0',
  ailab: '#BF5AF2',
  architecture: '#FF453A',
  resume: '#30D158',
  contact: '#32ADE6',
  terminal: '#3A3A3C',
  assistant: '#FF375F',
  safari: '#12A5F4',
}

// The desktop identity for 'safari' is a deliberate reveal gag — CodeTicker's
// "View Output" opens what looks like a plain browser window (title
// "Safari", compass icon) that turns out to be a playable Rock-Paper-
// Scissors game. The phone UI has no such setup (it's just an icon in the
// app grid/library/Dynamic Island), so it gets an honest game identity
// instead of an unexplained "Safari" label sitting under a gamepad glyph.
export const MOBILE_APP_TITLES = { safari: 'RPS Game' }
export const mobileAppTitle = (id) => MOBILE_APP_TITLES[id] || APP_TITLES[id]

export const DOCK_APPS = ['about', 'projects', 'experience', 'skills', 'ailab', 'architecture', 'contact', 'terminal', 'assistant', 'resume']
export const WINDOW_APPS = ['about', 'projects', 'experience', 'skills', 'ailab', 'architecture', 'resume', 'contact', 'terminal', 'assistant', 'safari']

// Default two-screen mobile home layout — screen 0 is the clean "main" home
// screen (4 icons only, alongside the hero+search), screen 1 holds the rest.
// The actual on-device layout the user sees is persisted separately (see
// MobileHome.jsx) and starts from this default only the first time.
export const MOBILE_DEFAULT_LAYOUT = [
  ['about', 'projects', 'contact', 'assistant'],
  ['experience', 'skills', 'ailab', 'architecture', 'resume', 'safari'],
]
// Every app id the mobile shell knows how to show — used to validate/merge
// a persisted layout (e.g. if a future app is added, it gets appended
// automatically instead of silently vanishing from Settings/Library).
export const MOBILE_ALL_APPS = MOBILE_DEFAULT_LAYOUT.flat()

// Purely a presentational grouping for the App Library screen — it always
// shows every app regardless of how the user has arranged their home
// screens, same as real iOS.
export const MOBILE_APP_LIBRARY_SECTIONS = [
  { title: 'Portfolio', apps: ['about', 'experience', 'projects', 'skills', 'resume', 'contact'] },
  { title: 'AI & Systems', apps: ['ailab', 'architecture', 'assistant'] },
  { title: 'Games', apps: ['safari'] },
]
