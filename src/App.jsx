import Stopwatch from './components/Stopwatch.jsx'
import Timer from './components/Timer.jsx'
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
          <Route path="/timer" element={<Timer />} />
          <Route path="/settings" element={<div className="page">Settings Page</div>} />
        </Routes>
      </main>
    </>
  )
}

export default App 