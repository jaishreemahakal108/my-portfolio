import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useContext, useEffect, useRef } from 'react'
import { NavbarContext } from '../../context/NavContext'
import { useNavigate } from 'react-router-dom'

const FullScreenNav = () => {
  const fullNavLinksRef = useRef(null)
  const fullScreenRef = useRef(null)
  const [navOpen, setNavOpen] = useContext(NavbarContext)
  const navigate = useNavigate();

  // ✅ GSAP open animation
  function gsapAnimation() {
    const tl = gsap.timeline()
    tl.to('.fullscreennav', { display: 'block' })
    tl.to('.stairing', {
      delay: 0.2,
      height: '100%',
      stagger: { amount: -0.3 },
      ease: 'power3.inOut',
    })
    tl.to('.link', {
      opacity: 1,
      rotateX: 0,
      stagger: { amount: 0.3 },
      ease: 'power3.out',
    })
    tl.to('.navlink', { opacity: 1, ease: 'power3.out' })
  }

  // ✅ GSAP close animation
  function gsapAnimationReverse() {
    const tl = gsap.timeline()
    tl.to('.link', {
      opacity: 0,
      rotateX: 90,
      stagger: { amount: 0.1 },
      ease: 'power3.in',
    })
    tl.to('.stairing', {
      height: 0,
      stagger: { amount: 0.1 },
      ease: 'power3.inOut',
    })
    tl.to('.navlink', { opacity: 0 })
    tl.to('.fullscreennav', { display: 'none' })
  }

  useGSAP(() => {
    if (navOpen) gsapAnimation()
    else gsapAnimationReverse()
  }, [navOpen])

  // ✅ Hover animation (image + text movement)
  useEffect(() => {
    const moveLinks = document.querySelectorAll('.moveLink')

    moveLinks.forEach((moveLink) => {
      const moveX = moveLink.querySelector('.moveX')
      const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true })

      tl.to(moveX, {
        xPercent: -50,
        duration: 8,
        ease: 'power1.inOut',
      })

      moveLink.animation = tl

      moveLink.addEventListener('mouseenter', () => {
        tl.play()
        gsap.to(moveLink, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
      moveLink.addEventListener('mouseleave', () => {
        tl.pause()
        gsap.to(moveLink, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      })
    })

    return () => {
      moveLinks.forEach((m) => {
        m.animation?.kill()
      })
    }
  }, [])

  // ✅ Updated menu items with hover taglines
  const menuItems = [
    { title: 'Projects', hoverText: 'Code. Design. Create.', route: '/projects' }, 
    { title: 'About Me', hoverText: 'Dream. Build. Inspire.', route: '/aboutMe' }, 
    { title: 'Contact', hoverText: 'Let’s Connect and Build Together.', route: '/contact' },
    // { title: 'Blogs', hoverText: 'Think. Write. Share.' },
  ]

   
  const handleNavigation = (path) => {
    setNavOpen(false) 
    setTimeout(() => {
      navigate(path) 
    }, 800) 
  }

  return (
    <div
      ref={fullScreenRef}
      id="fullscreennav"
      className="fullscreennav hidden text-white overflow-hidden h-screen w-full z-50 absolute"
    >
      {/* BG "stairs" animation */}
      <div className="h-screen w-full fixed">
        <div className="h-full w-full flex">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="stairing h-full w-1/5 bg-black"></div>
          ))}
        </div>
      </div>

      {/* Foreground navigation content */}
      <div ref={fullNavLinksRef} className="relative">
        {/* Header row (logo + close) */}
        <div className="navlink flex w-full justify-between items-start opacity-0">
          <div className='lg:p-5 p-2 cursor-pointer' onClick={() => handleNavigation('/')}>
            <div className='h-20 w-20'>
              <img
                src="/logo.png"
                alt="Logo"
                className='w-full h-full border rounded-full object-cover'
              />
            </div>
          </div>

          <div
            onClick={() => setNavOpen(false)}
            className="lg:h-32 h-20 w-20 lg:w-32 relative cursor-pointer"
          >
            <div className="lg:h-44 h-28 lg:w-1 w-0.5 -rotate-45 origin-top absolute bg-[#D3FD50]"></div>
            <div className="lg:h-44 h-28 lg:w-1 w-0.5 right-0 rotate-45 origin-top absolute bg-[#D3FD50]"></div>
          </div>
        </div>

        {/* Menu links */}
        <div className="py-36">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigation(item.route)}
              className={`link origin-top relative cursor-pointer ${
                idx === menuItems.length - 1 ? 'border-y border-white' : 'border-t border-white'
              } border-white`}
            >
              <h1 className="font-[font2] text-5xl lg:text-[8vw] text-center lg:leading-[0.8] lg:pt-10 pt-3 uppercase">
                {item.title}
              </h1>

              {/* Hover motion layer */}
              <div className="moveLink absolute text-black flex top-0 bg-[#D3FD50] opacity-0">
                <div className="moveX flex items-center">
                  {[1, 2].map((j) => (
                    <React.Fragment key={j}>
                      <h2 className="whitespace-nowrap font-[font2] lg:text-[8vw] text-5xl text-center lg:leading-[0.8] lg:pt-10 pt-4 uppercase">
                        {item.hoverText}
                      </h2>
                      <img
                        className="lg:h-36 h-14 rounded-full shrink-0 lg:w-96 w-32 object-cover"
                        src={
                          j === 1
                            ? 'https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---MenuThumbnail-640x290.jpg'
                            : 'https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290-640x290.jpg'
                        }
                        alt=""
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FullScreenNav