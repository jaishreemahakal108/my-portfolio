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
      <div className='p-2 sm:p-3 md:p-4 lg:p-5 cursor-pointer' onClick={handleLogoClick}>
        <div className='h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20'>
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
        className='h-14 w-24 sm:h-16 sm:w-32 md:w-44 lg:w-[16vw] 2xl:w-72 relative bg-black opacity-70 cursor-pointer'
      >
        <div
          ref={navGreenRef}
          className='bg-[#D3FD50] transition-all absolute top-0 h-0 w-full duration-300'
        ></div>
        <div className='relative h-full px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-center items-end gap-0.5 sm:gap-1 lg:gap-1.5'>
          <div className="w-8 sm:w-10 md:w-12 lg:w-18 h-0.5 bg-white"></div>
          <div className="w-5 sm:w-6 md:w-8 lg:w-10 h-0.5 bg-white"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar