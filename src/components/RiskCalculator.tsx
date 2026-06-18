import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle, Link, Download, Share2 } from "lucide-react";

interface RiskResult {
  catchProbability: number;
  expectedDelay: number;
  riskLevel: "Safe" | "Moderate" | "High Risk";
  recommendation: string;
}

export default function RiskCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Shared prediction banner state
  const [showSharedBanner, setShowSharedBanner] = useState(false);

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

  const runCalculation = (t1: string, bStn: string, t2: string, cStn: string) => {
    setLoading(true);
    
    // Simulate API call and calculation delay
    setTimeout(() => {
      const computedResult = calculateConnectionRisk(t1, bStn, t2, cStn);
      setResult(computedResult);
      setLoading(false);
    }, 1200);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runCalculation(currentTrain, boardingStation, connectingTrain, connectionStation);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load shared prediction on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t1 = params.get("t1");
    const stn1 = params.get("stn1");
    const t2 = params.get("t2");
    const stn2 = params.get("stn2");

    if (t1 && stn1 && t2 && stn2) {
      setCurrentTrain(t1);
      setBoardingStation(stn1);
      setConnectingTrain(t2);
      setConnectionStation(stn2);
      setShowSharedBanner(true);
      
      const timer = setTimeout(() => {
        runCalculation(t1, stn1, t2, stn2);
      }, 500);

      const bannerTimer = setTimeout(() => {
        setShowSharedBanner(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(bannerTimer);
      };
    }
  }, []);

  const generateShareUrl = () => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const params = new URLSearchParams();
    params.set("t1", currentTrain);
    params.set("stn1", boardingStation);
    params.set("t2", connectingTrain);
    params.set("stn2", connectionStation);
    return `${origin}${path}?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    try {
      const url = generateShareUrl();
      await navigator.clipboard.writeText(url);
      showToast("Copied!", "success");
    } catch (err) {
      console.error("Failed to copy link:", err);
      showToast("Failed to copy link", "error");
    }
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const timestamp = new Date().toLocaleString();
    const content = `=========================================
RippleRail Connection Risk Assessment
=========================================
Generated on: ${timestamp}

[TRIP INFORMATION]
Current Train:      ${currentTrain}
Boarding Station:   ${boardingStation}
Connecting Train:   ${connectingTrain}
Connection Station: ${connectionStation}

[ASSESSMENT RESULTS]
Risk Level:         ${result.riskLevel.toUpperCase()}
Catch Probability:  ${result.catchProbability}%
Expected Delay:     ${result.expectedDelay} minutes

[RECOMMENDATION]
${result.recommendation}

=========================================
Thank you for using RippleRail.
Safe travels!
=========================================`;

    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `RippleRail_Risk_Assessment_${currentTrain}_to_${connectingTrain}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Downloaded assessment summary", "success");
    } catch (err) {
      console.error("Failed to download file:", err);
      showToast("Failed to download assessment summary", "error");
    }
  };

  const handleShare = async () => {
    const url = generateShareUrl();
    const title = "RippleRail Connection Risk Assessment";
    const text = `Check out this connection risk assessment for Train ${currentTrain} to Train ${connectingTrain} via RippleRail!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        showToast("Shared successfully!", "success");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          showToast("Failed to share", "error");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Helper for dynamic colors
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Safe": return "text-[#1D9E75]";
      case "Moderate": return "text-yellow-500";
      case "High Risk": return "text-red-500";
      default: return "text-[#7F77DD]";
    }
  };

  const RiskIcon = ({ level }: { level: string }) => {
    if (level === "Safe") return <ShieldCheck className="w-5 h-5 text-[#1D9E75]" />;
    if (level === "Moderate") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <ShieldAlert className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-[#7F77DD]" />
        <h2 className="text-xl font-bold">Connection Risk Calculator</h2>
      </div>

      <AnimatePresence>
        {showSharedBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm rounded-lg p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Shared prediction loaded</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] transition-all" 
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading || !currentTrain || !connectingTrain || !boardingStation || !connectionStation}
            className="w-full bg-[#7F77DD] hover:bg-[#534AB7] text-white font-semibold rounded-lg p-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, mass: 0.8 }}
          className="mt-8 p-5 bg-background border border-border rounded-lg shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h3 className="text-lg font-semibold">Prediction Results</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
              <span className={`font-bold text-sm ${getRiskColor(result.riskLevel)}`}>{result.riskLevel}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:gap-4 md:grid-cols-4">
            <div className="bg-[#13102A]/50 p-3 rounded-lg border border-border/50 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Catch Probability</p>
                <p className={`text-3xl font-bold ${getRiskColor(result.riskLevel)}`}>{result.catchProbability}%</p>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    className={
                      result.catchProbability > 70
                        ? "stroke-[#1D9E75]"
                        : result.catchProbability >= 40
                        ? "stroke-yellow-500"
                        : "stroke-red-500"
                    }
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 20}
                    initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 20 - (result.catchProbability / 100) * (2 * Math.PI * 20) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-[#13102A]/50 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected Delay</p>
              <p className="text-3xl font-bold text-orange-500">{result.expectedDelay}<span className="text-sm font-medium text-muted-foreground ml-1">mins</span></p>
            </div>
            <div className="col-span-2 bg-[#13102A]/50 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recommendation</p>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <RiskIcon level={result.riskLevel} />
                </div>
                <p className="text-sm font-medium text-foreground/90 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Share & Export action buttons row */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-secondary/80 hover:text-foreground text-muted-foreground transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
            >
              <Link className="w-3.5 h-3.5" />
              Copy Link
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-secondary/80 hover:text-foreground text-muted-foreground transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Download Summary
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-secondary/80 hover:text-foreground text-muted-foreground transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-semibold pointer-events-none"
            style={{
              backgroundColor: toast.type === "success" ? "rgba(29, 158, 117, 0.95)" : "rgba(239, 68, 68, 0.95)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              border: toast.type === "success" ? "1px solid rgba(29, 158, 117, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {toast.type === "success" ? (
              <ShieldCheck className="w-4 h-4 text-white" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-white" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
