import { Route, Routes } from 'react-router-dom'
import Landing from './os/Landing'

// Legacy links resolve straight to the matching app window, rendered at their
// original URL — no client-side redirect (a same-tick pathname redirect here
// caused issues with the old page-transition and left the page stuck
// invisible, so each route mounts the OS, via the scroll intro, directly).
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/aboutMe' element={<Landing initialApp='about' />} />
      <Route path='/projects' element={<Landing initialApp='projects' />} />
      <Route path='/contact' element={<Landing initialApp='contact' />} />
      <Route path='*' element={<Landing />} />
    </Routes>
  )
}

export default App
