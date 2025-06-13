import Stopwatch from './components/Stopwatch.jsx'
import Timer from './components/Timer.jsx'
import Settings from './components/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import './css/App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/timer" element={<Timer duration={5*1000} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  )
}

export default App 