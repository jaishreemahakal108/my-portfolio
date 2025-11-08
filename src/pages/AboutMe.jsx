import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useNavigate } from "react-router-dom"

const AboutMe = () => {
  const navigate = useNavigate()
  gsap.registerPlugin(ScrollTrigger)

  const sectionsRef = useRef([])
  const handRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    // 👋 Wave animation
    gsap.to(handRef.current, {
      rotation: 20,
      yoyo: true,
      repeat: -1,
      transformOrigin: "bottom center",
      duration: 0.5,
      ease: "power1.inOut",
    })

    // Scroll fade-in for sections
    sectionsRef.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      )
    })

    // Worm glowing background for image
    gsap.to(glowRef.current, {
      backgroundPosition: "200% center",
      repeat: -1,
      duration: 6,
      ease: "linear",
    })
  }, [])

  const skillCategories = [
    {
      title: "Front-End",
      skills: [
        "HTML5",
        "CSS",
        "JavaScript",
        "React.js",
        "Tailwind.css",
        "Bootstrap",
        "GSAP",
      ],
    },
    {
      title: "React Tools & Libraries",
      skills: [
        "React Router",
        "Redux",
        "Redux Toolkit",
        "Context API",
        "Axios",
        "Shadcn.ui",
      ],
    },
    {
      title: "Back-End",
      skills: [
        "Node.js & Express.js",
        "RESTful APIs",
        "JWT (JSON Web Token)",
        "Bcrypt.js",
        "Multer / Cloudinary SDK",
      ],
    },
    {
      title: "Database",
      skills: [
        "MongoDB",
        "Mongoose",
        "MongoDB Atlas",
        "Redis",
        "Supabase",
        "Convex",
      ],
    },
    {
      title: "Additional Tools",
      skills: [
        "Git / GitHub",
        "VS Code",
        "Vercel / Netlify",
        "NPM",
      ],
    },
    {
      title: "AI Tools & API",
      skills: ["Gemini API", "OpenAI API", "Custom AI Integrations"],
    },
  ]

  return (
    <div className="w-full bg-[#0a0a0a] text-white overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="min-h-screen flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-10 px-8 md:px-20 pt-24 pb-10 relative"
      >
        {/* 🌀 Worm Glowing Effect */}
        <div
          ref={glowRef}
          className="absolute inset-0 bg-[linear-gradient(90deg,_#06b6d4,_#7c3aed,_#06b6d4)] bg-[length:400%_400%] blur-[150px] opacity-40 animate-worm-glow"
        ></div>

        <div className="md:w-1/2 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Hey, I’m <span className="text-cyan-400">Rajaswa Anand</span>{" "}
            <span ref={handRef} className="inline-block origin-bottom">
              👋
            </span>
          </h1>
          <p className="text-gray-300 max-w-xl text-lg md:text-xl mb-6">
            A passionate Full-Stack Developer who loves crafting fast,
            responsive, and interactive web experiences with modern tech.
          </p>
          <button
            onClick={() =>
              gsap.to(window, {
                scrollTo: "#skills",
                duration: 1.2,
                ease: "power2.inOut",
              })
            }
            className="bg-cyan-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-cyan-300 transition-all"
          >
            Explore More ↓
          </button>
        </div>

        {/* ✅ Image with glowing worm background */}
        <div className="md:w-1/2 flex justify-center relative z-10">
          <div className="relative w-[250px] md:w-[350px] h-[350px] md:h-[450px] overflow-hidden rounded-2xl shadow-[0_0_60px_#06b6d4]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#06b6d455,_transparent_70%)] animate-pulse-slow rounded-2xl" />
            <img
              src="/img-6.jpg"
              alt="Rajaswa Anand"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* ========== TECH STACK & SKILLS ========== */}
      <section
        id="skills"
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 px-6 md:px-20 bg-[#111]"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Tech Stack & Skills
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {skillCategories.map((cat, i) => (
            <div
              key={i}
              className="relative bg-[#1a1a1a] rounded-2xl p-8 transition-all shadow-[0_0_25px_#06b6d4] hover:shadow-[0_0_45px_#06b6d4] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_#06b6d4,_#9333ea,_#06b6d4)] bg-[length:300%_300%] blur-2xl opacity-20 animate-worm-glow" />
              <h3 className="relative text-2xl font-semibold mb-4 text-cyan-400">
                {cat.title}
              </h3>

              {/* 🟦 Floating bubble-style skills */}
              <ul className="relative flex flex-wrap justify-center gap-3 mt-4">
                {cat.skills.map((skill, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 bg-[#111] border border-cyan-500/40 text-cyan-300 rounded-full text-sm
                              hover:bg-cyan-400 hover:text-black transition-all duration-300 floating"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* ========== WHAT I DO ========== */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 px-6 md:px-20"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          What I Do
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Frontend Development",
              desc: "I build responsive, dynamic, and interactive UIs using React, TailwindCSS, and GSAP for animations.",
            },
            {
              title: "Backend Development",
              desc: "I develop robust APIs with Node.js, Express, and connect with MongoDB or Firebase databases.",
            },
            {
              title: "AI & API Integration",
              desc: "I integrate AI models (Gemini, ChatGPT) and APIs for smart, modern user experiences.",
            },
            {
              title: "UI/UX Design",
              desc: "I prioritize seamless UI design, ensuring every interaction feels intuitive and aesthetic.",
            },
            {
              title: "Performance Optimization",
              desc: "I focus on performance — reducing bundle size, caching, and lazy loading for speed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] rounded-2xl p-8 hover:bg-cyan-400 hover:text-black transition-all shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== BEYOND CODE ========== */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="py-20 px-6 md:px-20 bg-[#111]"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Beyond Code
        </h2>
        <div className="max-w-4xl mx-auto text-center text-gray-300 text-lg space-y-4">
          <p>
            When I’m not coding, I enjoy exploring design trends, reading about
            AI innovations, and listening to instrumental music.
          </p>
          <p>
            Also, I’m an avid cricket enthusiast 🏏 — I enjoy playing on weekends
            and find teamwork and strategy in cricket deeply inspiring for tech projects.
          </p>
        </div>
      </section>

      {/* ========== PHILOSOPHY ========== */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="py-20 px-6 md:px-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-6 text-cyan-400">My Philosophy</h2>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg italic">
          “Every line of code is a step toward creating something meaningful —
          simplicity and creativity go hand in hand.”
        </p>
      </section>

      {/* ========== CONTACT ========== */}
      {/* ========== CONTACT ========== */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="py-24 px-6 md:px-20 text-center bg-[#0f0f0f] relative z-10 min-h-[60vh] flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-cyan-400">
          Let’s Build Something Amazing
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Have an idea, project, or collaboration in mind? I’d love to connect
          and bring it to life.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="bg-cyan-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-cyan-300 transition-all shadow-xl hover:scale-105"
        >
          Contact Me 
        </button>
      </section>

    </div>
  )
}

export default AboutMe
