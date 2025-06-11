import Card from './components/card.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import './css/App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Card/>} />
          <Route path="/stats" element={<div className="page">Statistics Page</div>} />
          <Route path="/settings" element={<div className="page">Settings Page</div>} />
        </Routes>
      </main>
    </>
  )
}

export default App 