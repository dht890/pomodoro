import Card from './components/card.jsx'
import { Routes, Route } from 'react-router-dom'
import './css/App.css'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Card/>} />
      </Routes>
    </main>
  )
}

export default App 