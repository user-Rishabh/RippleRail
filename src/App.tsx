import { useState } from 'react'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className={`min-h-screen ${showDashboard ? 'dark bg-[#0a0c10] text-[#f1f5f9]' : 'bg-[#dfd2bc] text-slate-800'} selection:bg-violet-600/30 transition-colors duration-500`}>
      {showDashboard ? (
        <Dashboard onBack={() => setShowDashboard(false)} />
      ) : (
        <Landing onEnter={() => setShowDashboard(true)} />
      )}
    </div>
  )
}

export default App
