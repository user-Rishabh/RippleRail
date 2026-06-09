import { useState } from 'react'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
      {showDashboard ? (
        <Dashboard onBack={() => setShowDashboard(false)} />
      ) : (
        <Landing onEnter={() => setShowDashboard(true)} />
      )}
    </div>
  )
}

export default App
