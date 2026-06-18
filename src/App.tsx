import { useState } from 'react'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className="min-h-screen dark bg-background text-foreground transition-colors duration-500">
      {showDashboard ? (
        <Dashboard onBack={() => setShowDashboard(false)} />
      ) : (
        <Landing onEnter={() => setShowDashboard(true)} />
      )}
    </div>
  )
}

export default App
