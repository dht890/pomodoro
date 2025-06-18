import { useState } from 'react';
import Stopwatch from './components/Stopwatch.jsx'
import Timer from './components/Timer.jsx'
import Settings from './components/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ModeProvider } from './contexts/ModeContext.jsx'
import { TimerProvider } from './contexts/TimerContext.jsx'
import './css/App.css'

function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <TimerProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Timer />} />
              <Route path="/stopwatch" element={<Stopwatch />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </TimerProvider>
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App 