import React, { useRef, useContext } from 'react'
import { NavbarContext } from '../../context/NavContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navGreenRef = useRef(null)
  const [navOpen, setNavOpen] = useContext(NavbarContext)
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div className='z-50 flex fixed top-0 w-full items-start justify-between'>
      <div className='lg:p-5 p-2 cursor-pointer' onClick={handleLogoClick}>
        <div className='h-20 w-20'>
          <img
            src="/logo.png"
            alt="Logo"
            className='w-full h-full border rounded-full object-cover'
          />
        </div>
      </div>

      <div
        onClick={() => setNavOpen(true)}
        onMouseEnter={() => (navGreenRef.current.style.height = '100%')}
        onMouseLeave={() => (navGreenRef.current.style.height = '0%')}
        className='h-16 w-[16vw] relative bg-black opacity-70 cursor-pointer'
      >
        <div
          ref={navGreenRef}
          className='bg-[#D3FD50] transition-all absolute top-0 h-0 w-full duration-300'
        ></div>
        <div className='relative h-full lg:px-12 px-8 flex flex-col justify-center items-end lg:gap-1.5 gap-0.5'>
          <div className="lg:w-18 w-12 h-0.5 bg-white"></div>
          <div className="lg:w-10 w-6 h-0.5 bg-white"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar