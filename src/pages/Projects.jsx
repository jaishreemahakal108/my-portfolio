// Projects.jsx
import { useGSAP } from '@gsap/react'
import ProjectCard from '../components/projects/ProjectCard'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useRef, useEffect } from 'react'

const Projects = () => {
  gsap.registerPlugin(ScrollTrigger)
  const titleRef = useRef(null)
  const shimmerRef = useRef(null)
  const auraRef = useRef(null)

  const projects = [
    {
      video1: '/prg-1.mp4',
      title: 'Brain Hunters',
      link: 'https://brain-hunters.vercel.app/',
    },
    {
      video1: '/prg-2.mp4',
      title: 'Screening',
      link: 'https://screening-au2f.vercel.app/',
    },
    {
      video1: '/prg-3.mp4',
      title: 'Code Editor',
      link: 'https://screening-xphh.vercel.app/',
    },
    { video1: '/more-to-come.mp4', title: '', link: '' },
    { video1: '/more-to-come.mp4', title: '', link: '' },
    { video1: '/more-to-come.mp4', title: '', link: '' },
  ]

  useEffect(() => {
    // 🔹 Title reveal
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    )

    // 🔁 Shimmer sweep loop (3s)
    gsap.to(shimmerRef.current, {
      left: '150%',
      duration: 3,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: false,
      delay: 0.5,
      onRepeat: () => gsap.set(shimmerRef.current, { left: '-50%' }),
    })

    // 🪶 Firefly animation
    const particles = gsap.utils.toArray('.firefly')
    particles.forEach((f) => {
      gsap.to(f, {
        x: 'random(-30, 30)',
        y: 'random(-40, 40)',
        opacity: 'random(0.3, 1)',
        duration: 'random(6, 10)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    // 🌟 Aura breathing pulse
    gsap.to(auraRef.current, {
      scale: 1.2,
      opacity: 0.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return (
    <section className='relative min-h-screen bg-[#0a0a0a] text-white py-[12vh] overflow-hidden'>
      {/* ✨ Title + Effects */}
      <div className='text-center mb-20 relative'>
        {/* Glowing Aura */}
        <div
          ref={auraRef}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[50vw] h-[50vw] rounded-full bg-gradient-to-r 
                     from-yellow-500/10 via-amber-400/20 to-yellow-500/10 
                     blur-[120px] z-0'
        ></div>

        {/* PROJECTS Title */}
        <h2
          ref={titleRef}
          className='relative font-[font2] text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[110px] uppercase tracking-wider leading-none
                     text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600
                     drop-shadow-[0_0_25px_rgba(255,200,80,0.6)] z-10'
        >
          PROJECTS
          {/* Shimmer effect */}
          <span
            ref={shimmerRef}
            className='absolute top-0 left-[-50%] h-full w-[35%] 
                       bg-gradient-to-tr from-transparent via-yellow-200/70 to-transparent 
                       blur-[3px] mix-blend-screen'
          ></span>
        </h2>

        {/* Fireflies */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className='firefly absolute bg-yellow-300/70 blur-[4px] rounded-full'
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          ></span>
        ))}
      </div>

      {/* 🧱 Projects Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-8 md:px-12 lg:px-16'>
        {projects.map((proj, idx) => (
          <ProjectCard key={idx} video={proj.video1} title={proj.title} link={proj.link} />
        ))}
      </div>
    </section>
  )
}

export default Projects