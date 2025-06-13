import { useState } from 'react';
import Stopwatch from './components/Stopwatch.jsx'
import Timer from './components/Timer.jsx'
import Settings from './components/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import './css/App.css'

function App() {
  const [duration, setDuration] = useState(10 * 60 * 1000); // Default 10 minutes

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Timer duration={duration} />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/timer" element={<Timer duration={duration} />} />
          <Route path="/settings" element={<Settings setDuration={setDuration} />} />
        </Routes>
      </main>
    </>
  )
}

export default App 