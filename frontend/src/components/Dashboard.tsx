import TopCards from "./TopCards";
import RiskCalculator from "./RiskCalculator";
import RippleMap from "./RippleMap";
import AlternativePlanner from "./AlternativePlanner";
import AlertCenter from "./AlertCenter";

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              Operations Dashboard
            </h1>
            <p className="text-muted-foreground">Train Delay Ripple Calculator</p>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border"
          >
            Back to Home
          </button>
        </header>

        {/* Top Stats */}
        <TopCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calculator & Alternatives */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <RiskCalculator />
            <RippleMap />
          </div>

          {/* Right Column: Alerts & Mini Map/Alternatives */}
          <div className="flex flex-col gap-8">
            <AlertCenter />
            <AlternativePlanner />
          </div>

        </div>
      </div>
    </div>
  );
}
