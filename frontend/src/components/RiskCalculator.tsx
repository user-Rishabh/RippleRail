import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface RiskResult {
  catchProbability: number;
  expectedDelay: number;
  riskLevel: "Safe" | "Moderate" | "High Risk";
  recommendation: string;
}

export default function RiskCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  // Form state
  const [currentTrain, setCurrentTrain] = useState("");
  const [boardingStation, setBoardingStation] = useState("");
  const [connectingTrain, setConnectingTrain] = useState("");
  const [connectionStation, setConnectionStation] = useState("");

  const calculateConnectionRisk = (t1: string, bStn: string, t2: string, cStn: string): RiskResult => {
    // Generate a pseudo-random seed based on inputs to ensure deterministic but varying results
    const combinedString = `${t1.trim().toLowerCase()}-${bStn.trim().toLowerCase()}-${t2.trim().toLowerCase()}-${cStn.trim().toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = (hash << 5) - hash + combinedString.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Normalize hash to a positive number between 0 and 1
    const randomSeed = Math.abs(hash) / 2147483647;

    // Expected delay: 0 to 180 minutes
    const expectedDelay = Math.floor(randomSeed * 181);

    // Probability: 10% to 95%
    // Invert relationship: higher delay = lower probability, but add some noise
    const noise = (Math.abs(Math.sin(hash)) * 20) - 10; // -10 to +10 noise
    let catchProbability = 95 - (expectedDelay / 180) * 85 + noise;
    
    catchProbability = Math.max(10, Math.min(95, Math.round(catchProbability)));

    // Determine Risk Level & Recommendation
    let riskLevel: "Safe" | "Moderate" | "High Risk";
    let recommendation = "";

    if (catchProbability >= 70) {
      riskLevel = "Safe";
      recommendation = `Safe to proceed. Delay is manageable at ${expectedDelay} mins.`;
    } else if (catchProbability >= 40) {
      riskLevel = "Moderate";
      recommendation = `Monitor closely. Delay of ${expectedDelay} mins could tighten your connection buffer.`;
    } else {
      riskLevel = "High Risk";
      recommendation = `High chance of missing connection due to ${expectedDelay} min delay. Consider alternatives.`;
    }

    const calculatedResult: RiskResult = {
      catchProbability,
      expectedDelay,
      riskLevel,
      recommendation
    };

    console.log("--- Risk Calculation Log ---");
    console.log(`Inputs: [${t1}, ${bStn}, ${t2}, ${cStn}]`);
    console.log(`Computed Hash Seed: ${hash}`);
    console.log(`Result:`, calculatedResult);
    console.log("----------------------------");

    return calculatedResult;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call and calculation delay
    setTimeout(() => {
      const computedResult = calculateConnectionRisk(
        currentTrain,
        boardingStation,
        connectingTrain,
        connectionStation
      );
      setResult(computedResult);
      setLoading(false);
    }, 1200);
  };

  // Helper for dynamic colors
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Safe": return "text-green-500";
      case "Moderate": return "text-yellow-500";
      case "High Risk": return "text-red-500";
      default: return "text-primary";
    }
  };

  const RiskIcon = ({ level }: { level: string }) => {
    if (level === "Safe") return <ShieldCheck className="w-5 h-5 text-green-500" />;
    if (level === "Moderate") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <ShieldAlert className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Connection Risk Calculator</h2>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Current Train Number</label>
          <input 
            required 
            value={currentTrain}
            onChange={(e) => setCurrentTrain(e.target.value)}
            type="text" 
            placeholder="e.g. 12951" 
            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Boarding Station</label>
          <input 
            required 
            value={boardingStation}
            onChange={(e) => setBoardingStation(e.target.value)}
            type="text" 
            placeholder="e.g. NDLS" 
            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Connecting Train Number</label>
          <input 
            required 
            value={connectingTrain}
            onChange={(e) => setConnectingTrain(e.target.value)}
            type="text" 
            placeholder="e.g. 12004" 
            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Connection Station</label>
          <input 
            required 
            value={connectionStation}
            onChange={(e) => setConnectionStation(e.target.value)}
            type="text" 
            placeholder="e.g. BPL" 
            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading || !currentTrain || !connectingTrain || !boardingStation || !connectionStation}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg p-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                Calculate Risk <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-5 bg-background border border-border rounded-lg shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h3 className="text-lg font-semibold">Prediction Results</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
              <span className={`font-bold text-sm ${getRiskColor(result.riskLevel)}`}>{result.riskLevel}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:gap-4 md:grid-cols-4">
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Catch Probability</p>
              <p className={`text-3xl font-bold ${getRiskColor(result.riskLevel)}`}>{result.catchProbability}%</p>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected Delay</p>
              <p className="text-3xl font-bold text-orange-500">{result.expectedDelay}<span className="text-sm font-medium text-muted-foreground ml-1">mins</span></p>
            </div>
            <div className="col-span-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recommendation</p>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <RiskIcon level={result.riskLevel} />
                </div>
                <p className="text-sm font-medium text-foreground/90 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
