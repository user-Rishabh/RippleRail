import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Train, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  ChevronDown, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  Activity,
  Layers,
  ChevronRight,
  Gauge,
  BatteryCharging
} from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress);
        setCount(Math.floor(easeProgress * value));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Landing({ onEnter }: LandingProps) {
  // Cascading Delay Radar State
  const [cascadeStep, setCascadeStep] = useState(-1);
  const [isCascading, setIsCascading] = useState(false);

  // Risk Gauge States
  const [transferBuffer, setTransferBuffer] = useState(45);
  const [inboundDelay, setInboundDelay] = useState(30);

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Train Interactive Speed Controls
  const [trainSpeedMode, setTrainSpeedMode] = useState<"brake" | "cruise" | "hyper">("cruise");
  
  // Live Telemetry Physics States
  const [telemetry, setTelemetry] = useState({
    speed: 240,
    power: 3200,
    distance: 14.80,
    station: "NK MAIN",
    stationIdx: 0,
  });

  const trackPath = "M -150 150 C 200 30, 450 270, 700 150 C 950 30, 1200 270, 1550 150";

  // Telemetry Engine loop (Physics ticks)
  useEffect(() => {
    const stations = ["NK MAIN", "BSL JUNCTION", "BPL CENTRAL", "NZM TERMINUS"];
    
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        let targetSpeed = 240;
        let targetPower = 3200;
        let accelRate = 18;
        let powerRate = 300;
        
        if (trainSpeedMode === "brake") {
          targetSpeed = 0;
          targetPower = 45; // Idle auxiliary power
          accelRate = 35; // Brake decelerates faster
          powerRate = 600;
        } else if (trainSpeedMode === "cruise") {
          targetSpeed = 240;
          targetPower = 3200;
        } else if (trainSpeedMode === "hyper") {
          targetSpeed = 482;
          targetPower = 7950;
        }

        // Smoothly interpolate speed
        let currentSpeed = prev.speed;
        if (prev.speed < targetSpeed) {
          currentSpeed = Math.min(targetSpeed, prev.speed + accelRate);
        } else if (prev.speed > targetSpeed) {
          currentSpeed = Math.max(targetSpeed, prev.speed - accelRate);
        } else if (targetSpeed > 0) {
          // Micro fluctuations
          currentSpeed = targetSpeed + Math.floor((Math.random() - 0.5) * 3);
        }

        // Smoothly interpolate power
        let currentPower = prev.power;
        if (prev.power < targetPower) {
          currentPower = Math.min(targetPower, prev.power + powerRate);
        } else if (prev.power > targetPower) {
          currentPower = Math.max(targetPower, prev.power - powerRate);
        } else if (targetSpeed > 0) {
          currentPower = targetPower + Math.floor((Math.random() - 0.5) * 40);
        }

        // Distance countdown
        // Speed determines decay speed of distance
        const decayFactor = (currentSpeed / 3600) * 0.45; // Convert km/h to step delta
        let nextDistance = prev.distance - decayFactor;
        let nextStationIdx = prev.stationIdx;
        let nextStationName = prev.station;

        if (nextDistance <= 0) {
          nextDistance = 15.0 + parseFloat((Math.random() * 10).toFixed(2));
          nextStationIdx = (prev.stationIdx + 1) % stations.length;
          nextStationName = stations[nextStationIdx];
        }

        return {
          speed: currentSpeed,
          power: currentPower,
          distance: parseFloat(nextDistance.toFixed(2)),
          station: nextStationName,
          stationIdx: nextStationIdx,
        };
      });
    }, 120);

    return () => clearInterval(interval);
  }, [trainSpeedMode]);

  // Determine actual SVG CSS animation speed duration based on mode
  let animDuration = 18;
  if (trainSpeedMode === "brake") animDuration = 0; // Handled by play-state paused
  else if (trainSpeedMode === "cruise") animDuration = 18;
  else if (trainSpeedMode === "hyper") animDuration = 7;

  const animPlayState = trainSpeedMode === "brake" ? "paused" : "running";

  // Simulate the cascaded delays step-by-step
  useEffect(() => {
    let interval: any;
    if (isCascading) {
      interval = setInterval(() => {
        setCascadeStep((prev) => {
          if (prev >= 4) {
            setIsCascading(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isCascading]);

  const triggerCascade = () => {
    setCascadeStep(-1);
    setIsCascading(true);
  };

  // Connection Risk Calculator Logic
  const netBuffer = transferBuffer - inboundDelay;
  let riskStatus: "safe" | "caution" | "critical" = "safe";
  let riskLabel = "Safe Connection";
  let riskColorText = "text-emerald-400";
  let riskBg = "bg-emerald-500/10 border-emerald-500/30";
  
  if (netBuffer >= 20) {
    riskStatus = "safe";
    riskLabel = "Safe Connection";
    riskColorText = "text-emerald-400";
    riskBg = "bg-emerald-500/10 border-emerald-500/30";
  } else if (netBuffer >= 0 && netBuffer < 20) {
    riskStatus = "caution";
    riskLabel = "High Alert / Tight Connection";
    riskColorText = "text-amber-400";
    riskBg = "bg-amber-500/10 border-amber-500/30";
  } else {
    riskStatus = "critical";
    riskLabel = "Connection Missed";
    riskColorText = "text-rose-400";
    riskBg = "bg-rose-500/10 border-rose-500/30";
  }

  // Calculate gauge parameters
  const riskPercent = Math.min(100, Math.max(0, 50 - (netBuffer * 1.5)));
  const needleRotation = (riskPercent / 100) * 180 - 90;

  // Radar Stations Definition
  const radarStations = [
    { code: "MMCT", name: "Mumbai Central", delay: cascadeStep >= 0 ? 15 : 0, status: cascadeStep >= 0 ? "slight" : "on-time" },
    { code: "NK", name: "Nashik Road", delay: cascadeStep >= 1 ? 45 : 0, status: cascadeStep >= 1 ? "moderate" : "on-time" },
    { code: "BSL", name: "Bhusaval Jn", delay: cascadeStep >= 2 ? 75 : 0, status: cascadeStep >= 2 ? "high" : "on-time" },
    { code: "BPL", name: "Bhopal Jn", delay: cascadeStep >= 3 ? 90 : 0, status: cascadeStep >= 3 ? "high" : "on-time" },
    { code: "NZM", name: "Hazrat Nizamuddin", delay: cascadeStep >= 4 ? 110 : 0, status: cascadeStep >= 4 ? "missed" : "on-time" },
  ];

  return (
    <div className="min-h-screen bg-[#06080c] text-[#e2e8f0] font-sans relative overflow-x-hidden selection:bg-violet-600/30">
      
      {/* Inline styles for custom path-following Shinkansen bullet train */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes trainMove-engine {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes trainMove-car1 {
          0% { offset-distance: -2.8%; }
          100% { offset-distance: 97.2%; }
        }
        @keyframes trainMove-car2 {
          0% { offset-distance: -5.6%; }
          100% { offset-distance: 94.4%; }
        }
        .train-engine {
          offset-path: path('${trackPath}');
          offset-rotate: auto;
          animation: trainMove-engine ${animDuration}s linear infinite;
          animation-play-state: ${animPlayState};
        }
        .train-car1 {
          offset-path: path('${trackPath}');
          offset-rotate: auto;
          animation: trainMove-car1 ${animDuration}s linear infinite;
          animation-play-state: ${animPlayState};
        }
        .train-car2 {
          offset-path: path('${trackPath}');
          offset-rotate: auto;
          animation: trainMove-car2 ${animDuration}s linear infinite;
          animation-play-state: ${animPlayState};
        }
        .bg-grid-glow {
          background: radial-gradient(circle 800px at 50% 200px, rgba(139,92,246,0.06), transparent 70%);
        }
        .shinkansen-nose {
          clip-path: polygon(0% 100%, 100% 100%, 100% 50%, 40% 40%, 0% 100%);
        }
      ` }} />

      {/* Blueprint grid patterns (re-themed with Amethyst) */}
      <div className="absolute inset-0 bg-stitch-grid bg-blueprint-dots pointer-events-none opacity-90" />
      <div className="absolute top-0 inset-x-0 h-[850px] bg-grid-glow pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#06080c]/80 backdrop-blur-md border-b border-dashed border-violet-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600/10 border border-stitch rounded-xl flex items-center justify-center glow-amethyst">
              <Train className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-300">
                RIPPLE RAIL
              </span>
              <span className="block text-[9px] font-mono text-violet-500 uppercase tracking-widest mt-0.5">AMETHYST CORE v2.2</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-violet-400 transition-colors">How it Works</a>
            <a href="#delay-radar" className="hover:text-violet-400 transition-colors">Cascading Radar</a>
            <a href="#risk-calculator" className="hover:text-violet-400 transition-colors">Simulator</a>
            <a href="#faqs" className="hover:text-violet-400 transition-colors">FAQs</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-950/80 border border-dashed border-emerald-500/30 rounded-full text-[11px] font-mono text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM STATUS: NOMINAL
            </div>
            <button 
              id="btn-nav-enter"
              onClick={onEnter}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold text-sm transition-all border border-violet-400/30 shadow-md shadow-violet-900/30 cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-950/30 border border-stitch rounded-full text-xs font-mono text-violet-400 mb-6 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-fuchsia-400" /> AMETHYST ENGINE DELAY PREDICTORS
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Train Delay <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Ripple Calculator
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
            Predict missed connections before they happen. Our intelligent mapping models live delay propagation cascading across major stations to protect your itinerary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              id="btn-hero-dashboard"
              onClick={onEnter}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-base font-bold rounded-xl shadow-lg shadow-violet-500/10 hover:shadow-fuchsia-500/20 border border-violet-400/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Enter Delay Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#delay-radar"
              className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-base font-bold rounded-xl border border-dashed border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
            >
              Test Live Radar
            </a>
          </div>

          {/* Metrics Panel */}
          <div className="grid grid-cols-3 gap-6 mt-14 border-t border-dashed border-violet-900/20 pt-8 w-full max-w-lg">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-violet-400 font-mono">
                <CountUp value={10000} suffix="+" />
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Routes Analyzed</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-fuchsia-400 font-mono">
                <CountUp value={98} suffix="%" />
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">ML Accuracy</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono">
                <CountUp value={500} suffix="+" />
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Stations Covered</div>
            </div>
          </div>
        </div>

        {/* Enhanced SVG Bullet Train Track & Telemetry Dashboard */}
        <div className="lg:col-span-5 relative w-full flex flex-col gap-4">
          
          {/* Main Visualizer screen */}
          <div className="h-[260px] lg:h-[300px] w-full border border-stitch rounded-2xl bg-[#090c13]/70 backdrop-blur-md overflow-hidden shadow-2xl relative flex items-center justify-center">
            
            {/* Landscape blueprint background layers inside visualizer */}
            <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
              {/* Star grid */}
              <svg width="100%" height="100%">
                {/* Background blueprint mountains */}
                <path d="M 0 240 L 120 160 L 250 240 M 200 240 L 380 120 L 520 240 M 450 240 L 620 140 L 800 240 M 750 240 L 980 130 L 1150 240 M 1100 240 L 1250 150 L 1400 240" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1.5" />
                {/* Calibration crosshairs */}
                <circle cx="100" cy="80" r="1.5" fill="rgba(139, 92, 246, 0.3)" />
                <circle cx="1100" cy="180" r="1.5" fill="rgba(139, 92, 246, 0.3)" />
                <circle cx="600" cy="60" r="1.5" fill="rgba(139, 92, 246, 0.3)" />
                <line x1="100" y1="70" x2="100" y2="90" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
                <line x1="90" y1="80" x2="110" y2="80" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
                {/* Grid line indicator details */}
                <text x="120" y="85" fill="rgba(139, 92, 246, 0.2)" fontSize="8" fontFamily="monospace">[AZM-73]</text>
              </svg>
            </div>

            <div className="absolute top-4 left-4 font-mono text-[9px] text-violet-500 tracking-wider flex items-center gap-2 z-10">
              <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              DYNAMIC VECTOR TELEMETRY
            </div>

            {/* Winding tracks and high-speed Shinkansen */}
            <svg viewBox="0 0 1400 300" className="w-full h-full overflow-visible z-10 relative">
              <defs>
                <linearGradient id="headlight-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#fef08a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="shinkansen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Signals along the tracks */}
              {/* Signal 1 (X = 300) */}
              <circle cx="280" cy="88" r="4.5" fill={trainSpeedMode === "brake" ? "#f43f5e" : "#10b981"} />
              <line x1="280" y1="88" x2="280" y2="120" stroke="#475569" strokeWidth="2" />
              
              {/* Signal 2 (X = 900) */}
              <circle cx="950" cy="80" r="4.5" fill={trainSpeedMode === "hyper" ? "#a855f7" : "#10b981"} className={trainSpeedMode === "hyper" ? "animate-pulse" : ""} />
              <line x1="950" y1="80" x2="950" y2="105" stroke="#475569" strokeWidth="2" />

              {/* Track Ties */}
              <path d={trackPath} fill="none" stroke="#1e1b4b" strokeWidth="8" strokeDasharray="3,8" className="opacity-60" />

              {/* Glowing Neon Rails */}
              <path d={trackPath} fill="none" stroke="#2e1065" strokeWidth="4.5" />
              <path d={trackPath} fill="none" stroke="url(#shinkansen-grad)" strokeWidth="1.5" className="opacity-80" />

              {/* Shinkansen Carriage 2 */}
              <g className="train-car2" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <line x1="-30" y1="0" x2="-26" y2="0" stroke="#64748b" strokeWidth="3" />
                {/* Carriage body */}
                <rect x="-26" y="-7.5" width="52" height="15" rx="3" fill="#f8fafc" stroke="#7c3aed" strokeWidth="1" />
                <rect x="-26" y="2" width="52" height="2" fill="#7c3aed" /> {/* Violet cabin line */}
                {/* Windows row */}
                <rect x="-20" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="-10" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="0" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="10" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="20" y="-3.5" width="6" height="3" fill="#0f172a" />
                {/* Wheels */}
                <circle cx="-16" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                <circle cx="16" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
              </g>

              {/* Shinkansen Carriage 1 */}
              <g className="train-car1" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <line x1="-30" y1="0" x2="-26" y2="0" stroke="#64748b" strokeWidth="3" />
                {/* Carriage body */}
                <rect x="-26" y="-7.5" width="52" height="15" rx="3" fill="#f8fafc" stroke="#7c3aed" strokeWidth="1" />
                <rect x="-26" y="2" width="52" height="2" fill="#7c3aed" />
                {/* Windows row */}
                <rect x="-20" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="-10" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="0" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="10" y="-3.5" width="6" height="3" fill="#0f172a" />
                <rect x="20" y="-3.5" width="6" height="3" fill="#0f172a" />
                {/* Wheels */}
                <circle cx="-16" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                <circle cx="16" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
              </g>

              {/* Shinkansen Sleek Locomotive Engine */}
              <g className="train-engine" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                {/* Dynamic Headlight Glow */}
                <polygon points="26,0 140,-45 140,45" fill="url(#headlight-beam)" opacity={trainSpeedMode === "brake" ? 0.2 : 0.8} />
                
                {/* Locomotive main body */}
                <rect x="-26" y="-7.5" width="52" height="15" rx="3" fill="#f8fafc" stroke="#06b6d4" strokeWidth="1" />
                <rect x="-26" y="2" width="52" height="2" fill="#06b6d4" /> {/* Cyan accent stripe */}

                {/* Elongated aerodynamic cabin front */}
                <path d="M 16 -7.5 Q 26 -7.5 29 -2.5 L 34 7.5 L 16 7.5 Z" fill="#f8fafc" stroke="#06b6d4" strokeWidth="0.5" />
                {/* Aerodynamic windshield */}
                <path d="M 18 -4.5 C 23 -4.5 24 -2.5 25 1 L 18 1 Z" fill="#0f172a" />

                {/* Driver Cabin Window side */}
                <rect x="-2" y="-3.5" width="8" height="3" rx="0.5" fill="#0f172a" />
                <rect x="-14" y="-3.5" width="8" height="3" rx="0.5" fill="#0f172a" />
                
                {/* Wheels */}
                <circle cx="-16" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                <circle cx="12" cy="9.5" r="3.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
              </g>
            </svg>

            {/* Glowing active outline */}
            <div className={`absolute inset-0 border rounded-2xl pointer-events-none transition-all duration-300 ${
              trainSpeedMode === "brake" 
                ? "border-rose-500/20 shadow-[inset_0_0_15px_rgba(244,63,94,0.06)]"
                : trainSpeedMode === "hyper"
                ? "border-fuchsia-500/30 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"
                : "border-violet-500/20 shadow-[inset_0_0_15px_rgba(124,58,237,0.06)]"
            }`} />
          </div>

          {/* Dynamic Interactive Telemetry Panel & Speed Controls */}
          <div className="bg-[#090c13]/70 backdrop-blur-md border border-stitch rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl relative stitch-corner stitch-corner-br">
            
            {/* Speed & telemetry numerical indicators */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Gauge className="w-2.5 h-2.5 text-cyan-400" /> Velocity
                </span>
                <span className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                  {telemetry.speed} <span className="text-[10px] font-normal text-slate-500">km/h</span>
                </span>
              </div>

              <div className="px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <BatteryCharging className="w-2.5 h-2.5 text-fuchsia-400" /> Power Draw
                </span>
                <span className="text-lg font-bold font-mono text-fuchsia-400 mt-0.5">
                  {telemetry.power} <span className="text-[10px] font-normal text-slate-500">kW</span>
                </span>
              </div>

              <div className="px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1 col-span-2">
                  <Clock className="w-2.5 h-2.5 text-violet-400" /> Next Hub
                </span>
                <span className="text-sm font-bold font-mono text-violet-400 mt-0.5 leading-tight truncate">
                  {telemetry.station}
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {telemetry.distance} km away
                </span>
              </div>
            </div>

            {/* Interactive controls */}
            <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-900 p-1.5 rounded-xl self-center shrink-0">
              <button 
                id="btn-speed-brake"
                onClick={() => setTrainSpeedMode("brake")}
                className={`px-3 py-2 text-[10px] font-bold font-mono rounded-lg transition-all cursor-pointer uppercase ${
                  trainSpeedMode === "brake"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Brake
              </button>

              <button 
                id="btn-speed-cruise"
                onClick={() => setTrainSpeedMode("cruise")}
                className={`px-3 py-2 text-[10px] font-bold font-mono rounded-lg transition-all cursor-pointer uppercase ${
                  trainSpeedMode === "cruise"
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Cruise
              </button>

              <button 
                id="btn-speed-hyper"
                onClick={() => setTrainSpeedMode("hyper")}
                className={`px-3 py-2 text-[10px] font-bold font-mono rounded-lg transition-all cursor-pointer uppercase ${
                  trainSpeedMode === "hyper"
                    ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 shadow-fuchsia-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Boost
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Walkthrough Section */}
      <section id="how-it-works" className="relative py-20 px-6 border-y border-dashed border-violet-950/40 bg-slate-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-violet-500 uppercase tracking-widest mb-3">System Architecture</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold">Stitching the Journey</h3>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              How RippleRail computes dynamic bottleneck ripples to project exact arrival and safety margins.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
            {/* Background dashed connecting line on desktop */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 border-t border-dashed border-violet-800/20 -translate-y-1/2 hidden md:block z-0" />

            {/* Step 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#090c13]/80 border border-stitch rounded-2xl p-6 relative stitch-corner stitch-corner-tl stitch-corner-br flex flex-col justify-between h-full z-10 shadow-lg"
            >
              <div>
                <div className="w-12 h-12 bg-violet-600/10 border border-stitch rounded-xl flex items-center justify-center text-violet-400 font-mono font-bold text-lg mb-6 shadow-sm">
                  01
                </div>
                <h4 className="text-xl font-bold mb-3">Input Route Matrix</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Provide your target train schedule details, connection points, and layover buffer windows to compile your active tracking nodes.
                </p>
              </div>
              <div className="border-t border-dashed border-violet-900/20 pt-4 mt-6 text-xs text-violet-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-fuchsia-400" /> Real-time Sync
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#090c13]/80 border border-stitch rounded-2xl p-6 relative stitch-corner stitch-corner-tr stitch-corner-bl flex flex-col justify-between h-full z-10 shadow-lg"
            >
              <div>
                <div className="w-12 h-12 bg-fuchsia-600/10 border border-stitch rounded-xl flex items-center justify-center text-fuchsia-400 font-mono font-bold text-lg mb-6 shadow-sm">
                  02
                </div>
                <h4 className="text-xl font-bold mb-3">Ripple Propagation Model</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our system traces down-line train dependencies, weather patterns, and hub occupancy logs to simulate cascaded delays across the track lines.
                </p>
              </div>
              <div className="border-t border-dashed border-violet-900/20 pt-4 mt-6 text-xs text-fuchsia-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-fuchsia-400" /> Multi-Layer Calculus
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-[#090c13]/80 border border-stitch rounded-2xl p-6 relative stitch-corner stitch-corner-tl stitch-corner-br flex flex-col justify-between h-full z-10 shadow-lg"
            >
              <div>
                <div className="w-12 h-12 bg-cyan-600/10 border border-stitch rounded-xl flex items-center justify-center text-cyan-400 font-mono font-bold text-lg mb-6 shadow-sm">
                  03
                </div>
                <h4 className="text-xl font-bold mb-3">Alternative Action Plan</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  If risk bounds are broken, receive immediate alternative trains, bus connections, or cab estimations to keep your travel on track.
                </p>
              </div>
              <div className="border-t border-dashed border-violet-900/20 pt-4 mt-6 text-xs text-cyan-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Guarantee Route
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Section 1: Live Cascading Delay Radar */}
      <section id="delay-radar" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Live Cascadence Visualizer</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Watch Delays Cascade in Real Time
            </h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Trains don't run in isolation. A delay at a primary terminal ripples across the entire network. Click the button to inject a simulated delay at Mumbai Central and watch the ripple propagate down to Hazrat Nizamuddin.
            </p>

            <button
              id="btn-trigger-cascade"
              onClick={triggerCascade}
              disabled={isCascading}
              className="px-6 py-3.5 bg-slate-900 border border-stitch text-slate-100 hover:bg-violet-950/40 hover:text-violet-400 disabled:opacity-50 transition-all font-semibold rounded-xl flex items-center gap-3 shadow-md group cursor-pointer"
            >
              {isCascading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
                  Propagating Cascades...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                  Inject delay at Mumbai (+15m)
                </>
              )}
            </button>

            {cascadeStep >= 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl border border-dashed border-rose-500/30 bg-rose-950/20 text-xs flex gap-3 max-w-md animate-pulse"
              >
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold text-rose-400 block mb-0.5">CASCADE ALERT REPORTED</span>
                  Inbound delay at Mumbai has compounded over subsequent hubs. Connecting trains at Hazrat Nizamuddin are now marked at extreme risk of failure.
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Node Path Graph */}
          <div className="lg:col-span-7 bg-[#090c13]/80 border border-stitch rounded-2xl p-8 relative stitch-corner stitch-corner-tr stitch-corner-bl shadow-2xl">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              SIMULATED RADAR FEED
            </div>
            
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-500" />
              Mumbai-Delhi Express Corridor Cascade
            </h4>

            {/* Nodes Wrapper */}
            <div className="flex flex-col gap-8 relative">
              {/* Vertical link line behind on mobile */}
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 border-l border-dashed border-slate-800/40 md:hidden z-0" />

              {radarStations.map((station, idx) => {
                const isDelayed = station.delay > 0;
                let circleColor = "bg-slate-900 border-slate-700 text-slate-500";
                let badgeStyle = "bg-slate-950 text-slate-500 border-slate-850";
                
                if (station.status === "slight") {
                  circleColor = "bg-emerald-950/80 border-emerald-500 text-emerald-400 glow-emerald";
                  badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                } else if (station.status === "moderate") {
                  circleColor = "bg-amber-950/80 border-amber-500 text-amber-400 glow-amber";
                  badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                } else if (station.status === "high" || station.status === "missed") {
                  circleColor = "bg-rose-950/80 border-rose-500 text-rose-400 glow-red animate-pulse";
                  badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                }

                return (
                  <div key={station.code} className="flex items-center justify-between z-10 relative">
                    
                    {/* Node circle & details */}
                    <div className="flex items-center gap-4">
                      {/* Circle indicator */}
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-500 ${circleColor}`}>
                        {station.code}
                      </div>

                      {/* Station Name */}
                      <div>
                        <span className="font-bold block text-sm md:text-base">{station.name}</span>
                        <span className="text-xs text-slate-500">Scheduled Stop</span>
                      </div>
                    </div>

                    {/* Delay & Risk status details */}
                    <div className="flex items-center gap-4">
                      {/* Connection arrow between nodes on desktop */}
                      {idx < radarStations.length - 1 && (
                        <div className="hidden md:flex items-center gap-1 opacity-40">
                          <span className={`w-1.5 h-1.5 rounded-full ${cascadeStep >= idx ? "bg-rose-500 animate-ping" : "bg-slate-700"}`} />
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </div>
                      )}

                      {/* Output details */}
                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${badgeStyle} transition-all duration-500`}>
                          {isDelayed ? `+${station.delay}m delay` : "On Time"}
                        </span>
                        
                        <span className="block text-[10px] text-slate-500 font-mono mt-1">
                          {idx === 0 && isDelayed && "Inbound Impact"}
                          {idx > 0 && idx < 3 && isDelayed && "Casading Ripple"}
                          {idx >= 3 && isDelayed && "Connection Missed!"}
                          {!isDelayed && "Clear Runway"}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick reset */}
            {cascadeStep >= 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCascadeStep(-1)}
                  className="text-xs font-mono text-slate-500 hover:text-slate-350 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear Simulation
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Interactive Section 2: Journey Buffer & Risk Simulator Widget */}
      <section id="risk-calculator" className="py-20 px-6 bg-[#07090e] border-t border-dashed border-violet-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Hands-On Playground</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold">Instant Connection Risk Gauge</h3>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Simulate travel timings. Adjust transfer windows and delayed arrivals to see how safe your connection is.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Input Sliders Column */}
            <div className="lg:col-span-7 bg-[#090c13]/80 border border-stitch rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-500" />
                  Parameters Config Panel
                </h4>

                {/* Slider 1: Transfer Window */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-violet-400" /> Planned Transfer Window
                    </span>
                    <span className="font-mono text-sm text-violet-400 font-bold px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-md">
                      {transferBuffer} mins
                    </span>
                  </div>
                  <input
                    id="slider-transfer"
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={transferBuffer}
                    onChange={(e) => setTransferBuffer(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>15 MINS (TIGHT)</span>
                    <span>60 MINS</span>
                    <span>120 MINS (RELAXED)</span>
                  </div>
                </div>

                {/* Slider 2: Inbound Delay */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Inbound Train Delay
                    </span>
                    <span className="font-mono text-sm text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                      {inboundDelay} mins
                    </span>
                  </div>
                  <input
                    id="slider-delay"
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={inboundDelay}
                    onChange={(e) => setInboundDelay(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0 MINS (ON TIME)</span>
                    <span>60 MINS</span>
                    <span>120 MINS (SEVERE)</span>
                  </div>
                </div>
              </div>

              {/* Summary details */}
              <div className="border-t border-dashed border-violet-900/20 pt-6 mt-6">
                <h5 className="text-xs font-mono text-violet-500 uppercase tracking-widest mb-3">Live Risk Projection</h5>
                <div className={`p-4 rounded-xl border ${riskBg} transition-all duration-300`}>
                  <span className={`text-base font-bold flex items-center gap-2 ${riskColorText}`}>
                    {riskStatus === "safe" && <ShieldCheck className="w-5 h-5 shrink-0" />}
                    {riskStatus === "caution" && <AlertTriangle className="w-5 h-5 shrink-0" />}
                    {riskStatus === "critical" && <ShieldAlert className="w-5 h-5 shrink-0" />}
                    {riskLabel}
                  </span>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {riskStatus === "safe" && `Your transfer timeline is completely secure. You will arrive with a comfortable buffer margin of ${netBuffer} minutes before the outgoing connection departs.`}
                    {riskStatus === "caution" && `Extremely tight connection window! A net buffer of only ${netBuffer} minutes remains. A slight delay hike could result in missing the train. Monitor live radar updates.`}
                    {riskStatus === "critical" && `Warning! Outgoing train departed ${Math.abs(netBuffer)} minutes before your inbound arrival. RippleRail recommends routing through alternatives immediately.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Gauge Dial Panel */}
            <div className="lg:col-span-5 bg-[#090c13]/80 border border-stitch rounded-2xl p-6 md:p-8 flex flex-col items-center justify-between text-center relative stitch-corner stitch-corner-tl stitch-corner-br shadow-xl">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500">
                GAUGE FEED: ANALOG OUT
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">Calculated Risk Factor</h4>
                <p className="text-xs text-slate-500">Dynamic Risk Margin Indicator</p>
              </div>

              {/* Arc Dial SVG */}
              <div className="relative w-64 h-36 mt-4">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" /> {/* Green */}
                      <stop offset="50%" stopColor="#f59e0b" /> {/* Amber */}
                      <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
                    </linearGradient>
                  </defs>

                  {/* Dial Arc */}
                  <path 
                    d="M 20 90 A 80 80 0 0 1 180 90" 
                    fill="none" 
                    stroke="url(#gauge-grad)" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    className="opacity-95"
                  />

                  {/* Background Track support */}
                  <path 
                    d="M 20 90 A 80 80 0 0 1 180 90" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="2.5" 
                    strokeDasharray="4,6"
                    className="opacity-40"
                  />

                  {/* Center Hub */}
                  <circle cx="100" cy="90" r="6" fill="#7c3aed" />
                  <circle cx="100" cy="90" r="3" fill="#0f172a" />

                  {/* Indicator Needle */}
                  <g transform={`rotate(${needleRotation} 100 90)`} className="transition-transform duration-500 ease-out">
                    <line 
                      x1="100" 
                      y1="90" 
                      x2="100" 
                      y2="15" 
                      stroke="#f8fafc" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      className="shadow-md"
                    />
                    <polygon points="100,10 97,18 103,18" fill="#f8fafc" />
                  </g>
                </svg>

                {/* Risk Percentage Display */}
                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {Math.round(riskPercent)}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Risk Level</span>
                </div>
              </div>

              {/* Dashboard redirection link */}
              <div className="w-full mt-4">
                <button
                  onClick={onEnter}
                  className="w-full px-4 py-3 bg-slate-900 hover:bg-violet-600 hover:text-white transition-all text-xs font-mono border border-stitch rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  Analyze with Real Schedules
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Advanced Features Spotlight */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-violet-500 uppercase tracking-widest mb-3">Enterprise Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold">Engineered for Rail Resilience</h3>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Deep scheduling data combined with localized predictive graphs to give you maximum travel assurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#090c13]/80 border border-stitch p-6 rounded-2xl relative stitch-corner stitch-corner-tl hover:border-violet-500/50 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6 glow-amethyst">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-3">Predictive Delay Models</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              We compile regional congestion data, buffer thresholds, and layout structures to estimate real cascades in minutes, not estimates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#090c13]/80 border border-stitch p-6 rounded-2xl relative stitch-corner stitch-corner-tr hover:border-fuchsia-500/50 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6 shadow-md shadow-fuchsia-500/5">
              <Layers className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-3">Ripple Propagation Maps</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualize how delays propagate through visual maps using node networks to trace cascade warnings down individual trains.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#090c13]/80 border border-stitch p-6 rounded-2xl relative stitch-corner hover:border-cyan-500/50 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 glow-cyan">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-3">Mitigation & Safety Buffers</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Get alert notification triggers and automated backup alternatives recommendations for other routes, buses, or cabs instantly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 px-6 bg-[#07090e] border-t border-dashed border-violet-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Support & Information</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does RippleRail calculate risk percentages?",
                a: "Our algorithm compiles inbound delay times, checks layover buffer windows, and cross-references historical terminal platforms times (e.g., standard layout transition times between platform 1 and 12 at New Delhi). It then processes this through our risk model to deliver a real-time danger rating."
              },
              {
                q: "Where does the live location data come from?",
                a: "RippleRail aggregates live GPS feed markers, railway network sensors, and station dispatcher notes. This ensures our node cascades are calculated from actual grid coordinates every 30 seconds."
              },
              {
                q: "Are alternative transport costs estimated?",
                a: "Yes. Taxi costs, alternative train fares, and intercity Volvo bus pricing are pulled dynamically from partner APIs and regional directories to give you an accurate budget mapping for your backup journey."
              },
              {
                q: "Can I use RippleRail on mobile devices?",
                a: "Absolutely. RippleRail is designed with a fully responsive layout. The map interfaces, dashboards, and simulators adjust seamlessly to provide optimal resolution on standard smartphone screens."
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#090c13]/80 border border-stitch-muted rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base hover:bg-slate-950/30 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-violet-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-400" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-slate-400 leading-relaxed border-t border-dashed border-violet-900/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dashed border-violet-950/40 bg-[#06080c] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600/10 border border-stitch rounded-lg flex items-center justify-center animate-pulse">
              <Train className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-slate-200">RIPPLE RAIL</span>
              <span className="block text-[8px] font-mono text-slate-500 uppercase">Route Safety Engine</span>
            </div>
          </div>

          <div className="flex gap-8 text-xs font-mono text-slate-500">
            <span>© 2026 RIPPLE RAIL LABS</span>
            <span>LICENSED BY RAIL OPERATIONS</span>
            <button 
              onClick={onEnter}
              className="hover:text-violet-400 transition-colors underline cursor-pointer"
            >
              LAUNCH CONSOLE
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
