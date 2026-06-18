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
  ChevronRight
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
  // Entrance Loader states
  const [introActive, setIntroActive] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);

  // Cascading Delay Radar State
  const [cascadeStep, setCascadeStep] = useState(-1);
  const [isCascading, setIsCascading] = useState(false);

  // Risk Gauge States
  const [transferBuffer, setTransferBuffer] = useState(45);
  const [inboundDelay, setInboundDelay] = useState(30);

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Floating Boarding Tickets Mock Data (Themed to colorful glassmorphic boarding passes)
  const mockTickets = [
    {
      id: "t1",
      from: "MUMBAI CENTRAL (MMCT)",
      to: "HAZRAT NIZAMUDDIN (NZM)",
      train: "12951 Rajdhani Exp",
      seat: "AC-1A, Coach H1, Seat 24",
      status: "CRITICAL RISK",
      statusColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      delay: "+110m",
      top: "16%",
      left: "4%",
      rotate: -10,
      scale: 0.9,
      delaySec: 0,
      ticketBg: "rgba(19, 16, 42, 0.75)" // Glassmorphic card surface
    },
    {
      id: "t2",
      from: "NASHIK ROAD (NK)",
      to: "BHOPAL JN (BPL)",
      train: "11057 Amritsar Exp",
      seat: "Sleeper, Coach S3, Seat 47",
      status: "ON TIME",
      statusColor: "text-[#1D9E75] border-[#1D9E75]/30 bg-[#1D9E75]/10",
      delay: "0m",
      top: "30%",
      right: "5%",
      rotate: 8,
      scale: 0.92,
      delaySec: 2,
      ticketBg: "rgba(19, 16, 42, 0.75)" // Glassmorphic card surface
    },
    {
      id: "t3",
      from: "BHUSAVAL JN (BSL)",
      to: "HAZRAT NIZAMUDDIN (NZM)",
      train: "12721 Dakshin Exp",
      seat: "AC-3A, Coach B2, Seat 12",
      status: "CAUTION ALERT",
      statusColor: "text-amber-405 border-amber-500/30 bg-amber-500/10",
      delay: "+45m",
      top: "58%",
      left: "5%",
      rotate: 12,
      scale: 0.88,
      delaySec: 1,
      ticketBg: "rgba(127, 119, 221, 0.2)" // Soft purple 20% opacity tint
    },
    {
      id: "t4",
      from: "MUMBAI CENTRAL (MMCT)",
      to: "BPL JUNCTION",
      train: "12137 Punjab Mail",
      seat: "AC-2A, Coach A1, Seat 32",
      status: "ON TIME",
      statusColor: "text-[#1D9E75] border-[#1D9E75]/30 bg-[#1D9E75]/10",
      delay: "0m",
      top: "76%",
      right: "7%",
      rotate: -8,
      scale: 0.86,
      delaySec: 3,
      ticketBg: "rgba(19, 16, 42, 0.75)" // Glassmorphic card surface
    }
  ];

  // Entrance Loader Progress effect
  useEffect(() => {
    if (introActive) {
      const duration = 2400; // 2.4 seconds
      const startTime = performance.now();
      
      const updateProgress = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setIntroProgress(Math.floor(progress * 100));
        
        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          setIntroActive(false);
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [introActive]);


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
  let riskColorText = "text-emerald-600";
  let riskBg = "bg-emerald-500/10 border-emerald-500/20";
  
  if (netBuffer >= 20) {
    riskStatus = "safe";
    riskLabel = "Safe Connection";
    riskColorText = "text-emerald-600";
    riskBg = "bg-emerald-500/10 border-emerald-500/20";
  } else if (netBuffer >= 0 && netBuffer < 20) {
    riskStatus = "caution";
    riskLabel = "High Alert / Tight Connection";
    riskColorText = "text-amber-600";
    riskBg = "bg-amber-500/10 border-amber-500/20";
  } else {
    riskStatus = "critical";
    riskLabel = "Connection Missed";
    riskColorText = "text-rose-600";
    riskBg = "bg-rose-500/10 border-rose-500/20";
  }

  const riskPercent = Math.min(100, Math.max(0, 50 - (netBuffer * 1.5)));
  const needleRotation = (riskPercent / 100) * 180 - 90;

  const radarStations = [
    { code: "MMCT", name: "Mumbai Central", delay: cascadeStep >= 0 ? 15 : 0, status: cascadeStep >= 0 ? "slight" : "on-time" },
    { code: "NK", name: "Nashik Road", delay: cascadeStep >= 1 ? 45 : 0, status: cascadeStep >= 1 ? "moderate" : "on-time" },
    { code: "BSL", name: "Bhusaval Jn", delay: cascadeStep >= 2 ? 75 : 0, status: cascadeStep >= 2 ? "high" : "on-time" },
    { code: "BPL", name: "Bhopal Jn", delay: cascadeStep >= 3 ? 90 : 0, status: cascadeStep >= 3 ? "high" : "on-time" },
    { code: "NZM", name: "Hazrat Nizamuddin", delay: cascadeStep >= 4 ? 110 : 0, status: cascadeStep >= 4 ? "missed" : "on-time" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary/20">
      
      {/* Entrance Loader Overlay */}
      <AnimatePresence>
        {introActive && (
          <motion.div
            key="intro-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background pointer-events-auto"
          >
            <div className="absolute inset-0 bg-stitch-grid bg-blueprint-dots opacity-40 pointer-events-none" />
            
            {/* Grand Station Terminal Blueprint backdrop girders inside loader */}
            <div className="absolute top-24 inset-x-0 h-[600px] pointer-events-none opacity-10 z-0 overflow-hidden">
              <svg width="100%" height="100%" className="w-full h-full">
                <path d="M -100 600 C 150 160, 550 160, 800 600" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="3" strokeDasharray="6,6" />
                <path d="M 600 600 C 850 160, 1250 160, 1500 600" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="3" strokeDasharray="6,6" />
              </svg>
            </div>

            <div className="w-full max-w-4xl px-8 relative flex flex-col items-center z-10">
              {/* Header text */}
              <div className="text-center mb-16 space-y-3">
                <h2 className="text-3xl font-extrabold tracking-widest text-foreground font-mono">
                  RIPPLE RAIL
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                  AMETHYST CORE v2.2 INITIALIZING
                </div>
              </div>
              
              {/* Track Line */}
              <div className="w-full h-1 bg-muted relative rounded-full overflow-visible mb-8">
                {/* Horizontal sleepers */}
                <div className="absolute -inset-y-1.5 inset-x-0 flex justify-between pointer-events-none opacity-20">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-0.5 h-4 bg-foreground" />
                  ))}
                </div>
                
                 {/* The Train on track */}
                <motion.div
                  style={{
                    position: "absolute",
                    left: `${-25 + (introProgress / 100) * 140}%`, // Goes from -25% to 115%
                    top: "-12px",
                    width: "220px",
                  }}
                  animate={{
                    y: [0, -1, 1, -0.5, 0.5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    ease: "easeInOut"
                  }}
                  className="flex items-center justify-end"
                >
                  {/* Carriage 2 */}
                  <div className="w-14 h-6 bg-[#13102A] border border-[#7F77DD]/50 rounded-l flex items-center justify-around px-1 shadow-[0_2px_8px_rgba(127,119,221,0.2)]">
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                  </div>

                  {/* Coupler 1 */}
                  <div className="w-1.5 h-1 bg-[#7F77DD]/40 shrink-0" />

                  {/* Carriage 1 */}
                  <div className="w-14 h-6 bg-[#13102A] border border-[#7F77DD]/50 flex items-center justify-around px-1 shadow-[0_2px_8px_rgba(127,119,221,0.2)] relative">
                    {/* Pantograph with Spark */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 w-3 h-2.5 border-t border-x border-[#7F77DD]/50 rounded-t flex items-center justify-center">
                      <motion.div 
                        animate={{
                          opacity: [0, 1, 0.2, 1, 0, 0.9, 0.1, 1, 0],
                          scale: [0.5, 1.3, 0.7, 1.6, 0.4, 1.2, 0.6, 1.4, 0.5]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear"
                        }}
                        className="w-1 h-1 bg-[#1D9E75] rounded-full blur-[0.5px] shadow-[0_0_8px_#1D9E75]"
                      />
                    </div>
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                    <span className="w-2.5 h-1.5 bg-[#7F77DD]/20 rounded-sm" />
                  </div>

                  {/* Coupler 2 */}
                  <div className="w-1.5 h-1 bg-[#7F77DD]/40 shrink-0" />

                  {/* Engine */}
                  <div className="w-16 h-6 bg-[#13102A] border border-[#1D9E75]/50 rounded-r-full relative flex items-center shadow-[0_2px_10px_rgba(29,158,117,0.3)]">
                    {/* Headlight beam */}
                    <div 
                      className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-10 bg-gradient-to-r from-yellow-300/35 to-transparent pointer-events-none"
                      style={{
                        clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)"
                      }}
                    />
                    <div className="absolute right-1.5 top-2.5 w-1.5 h-1.5 bg-yellow-450 rounded-full animate-ping" />
                    <div className="absolute right-1.5 top-2.5 w-1.5 h-1.5 bg-yellow-350 rounded-full" />
                    <span className="w-3 h-1.5 bg-[#1D9E75]/25 rounded ml-2" />
                    {/* Sleek windshield */}
                    <div className="absolute right-4 top-0.5 w-5 h-2 bg-slate-900 rounded-tr-xl rounded-bl-sm transform -skew-x-12" />
                  </div>
                </motion.div>
              </div>
              
              {/* Progress Bar & Telemetry */}
              <div className="w-80 space-y-3 bg-secondary/80 border border-border p-4 rounded-xl shadow-sm">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    SYNCING MATRIX
                  </span>
                  <span className="font-bold">{introProgress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    style={{ width: `${introProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#7F77DD] to-[#1D9E75]"
                  />
                </div>
                <div className="text-[9px] font-mono text-muted-foreground/85 text-center uppercase tracking-wider">
                  {introProgress < 25 && "Loading station coordinate grids..."}
                  {introProgress >= 25 && introProgress < 50 && "Parsing down-line dependency logs..."}
                  {introProgress >= 50 && introProgress < 75 && "Compiling cascading risk values..."}
                  {introProgress >= 75 && "Finalizing terminal visualization feed..."}
                </div>
              </div>
            </div>
            
            {/* Skip button in corner */}
            <button
              onClick={() => setIntroActive(false)}
              className="absolute bottom-8 right-8 px-4 py-2 bg-[#13102A] hover:bg-[#13102A]/80 border border-border text-foreground/80 hover:text-white text-xs font-mono rounded-lg transition-all shadow-sm cursor-pointer hover:shadow"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          filter: introActive ? `blur(${16 - (introProgress / 100) * 16}px)` : "blur(0px)",
          opacity: introActive ? 0.3 + (introProgress / 100) * 0.7 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >

      {/* Inline styles for custom layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid-glow {
          background: radial-gradient(circle 800px at 50% 200px, rgba(147,51,234,0.05), transparent 70%);
        }
      ` }} />

      {/* Blueprint grid patterns */}
      <div className="absolute inset-0 bg-stitch-grid bg-blueprint-dots pointer-events-none opacity-90" />
      <div className="absolute top-0 inset-x-0 h-[850px] bg-grid-glow pointer-events-none" />

      {/* Grand Station Terminal Blueprint backdrop girders */}
      <div className="absolute top-24 inset-x-0 h-[600px] pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg width="100%" height="100%" className="w-full h-full">
          {/* Main Arched roofs */}
          <path d="M -100 600 C 150 160, 550 160, 800 600" fill="none" stroke="rgba(147, 51, 234, 0.08)" strokeWidth="3" strokeDasharray="6,6" />
          <path d="M -100 600 C 150 130, 550 130, 800 600" fill="none" stroke="rgba(147, 51, 234, 0.03)" strokeWidth="1.5" />
          
          <path d="M 600 600 C 850 160, 1250 160, 1500 600" fill="none" stroke="rgba(147, 51, 234, 0.08)" strokeWidth="3" strokeDasharray="6,6" />
          <path d="M 600 600 C 850 130, 1250 130, 1500 600" fill="none" stroke="rgba(147, 51, 234, 0.03)" strokeWidth="1.5" />

          {/* Roof Truss cross girders */}
          <line x1="350" y1="262" x2="350" y2="600" stroke="rgba(147, 51, 234, 0.02)" strokeWidth="1.5" strokeDasharray="2,4" />
          <line x1="1050" y1="262" x2="1050" y2="600" stroke="rgba(147, 51, 234, 0.02)" strokeWidth="1.5" strokeDasharray="2,4" />
        </svg>
      </div>

      {/* Floating Tickets Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {mockTickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            style={{
              position: "absolute",
              top: ticket.top,
              left: ticket.left,
              right: ticket.right,
              transform: `rotate(${ticket.rotate}deg) scale(${ticket.scale})`,
              pointerEvents: "auto",
              "--ticket-punch-bg": "var(--background)",
              "--ticket-bg": ticket.ticketBg
            } as any}
            animate={{
              y: [0, -18, 0],
              rotate: [ticket.rotate, ticket.rotate + 3, ticket.rotate - 3, ticket.rotate],
            }}
            transition={{
              duration: 11 + ticket.delaySec * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ 
              scale: ticket.scale * 1.08, 
              rotate: 0,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.15)",
              borderColor: "rgba(147, 51, 234, 0.5)"
            }}
            className="floating-ticket p-5 w-64 border border-stitch border-primary/30 text-xs hidden xl:block cursor-pointer select-none transition-all duration-300"
          >
            <div className="ticket-punch-left" />
            <div className="ticket-punch-right" />
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">BOARDING TICKET</span>
              <span className="font-mono text-[8px] text-primary/45">SERIAL #9048-26</span>
            </div>
            
            <div className="space-y-2 mb-3 text-[11px]">
              <div>
                <span className="text-[9px] text-muted-foreground uppercase block font-semibold">FROM</span>
                <span className="font-bold text-foreground">{ticket.from}</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase block font-semibold">TO</span>
                <span className="font-bold text-foreground">{ticket.to}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase block font-semibold">TRAIN</span>
                  <span className="font-medium text-foreground/80">{ticket.train}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase block font-semibold">SEAT/CLASS</span>
                  <span className="font-medium text-foreground/80 truncate max-w-[90px] block">{ticket.seat.split(",")[0]}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-primary/20 pt-3 flex justify-between items-center">
              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 border rounded-full ${ticket.statusColor}`}>
                {ticket.status}
              </span>
              <span className="font-mono font-bold text-xs text-foreground/80">{ticket.delay}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0D0B1Aee] backdrop-blur-[12px] border-b border-dashed border-[#FFFFFF12] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7F77DD]/10 border border-stitch rounded-xl flex items-center justify-center">
              <Train className="w-5 h-5 text-[#7F77DD]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white">
                RIPPLE RAIL
              </span>
              <span className="block text-[9px] font-mono text-[#7F77DD] uppercase tracking-widest mt-0.5">AMETHYST CORE V2.2</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9B98B8]">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#delay-radar" className="hover:text-white transition-colors">Cascading Radar</a>
            <a href="#risk-calculator" className="hover:text-white transition-colors">Simulator</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1D9E7520] border border-dashed border-[#1D9E7530] rounded-full text-[11px] font-mono text-[#1D9E75]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] animate-pulse" />
              SYSTEM NOMINAL
            </div>
            <button 
              id="btn-nav-enter"
              onClick={onEnter}
              className="px-4 py-2 bg-[#7F77DD] hover:bg-[#534AB7] text-white rounded-lg font-semibold text-sm transition-all border border-[#FFFFFF12] shadow-md shadow-[#7F77DD]/10 cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 max-w-5xl mx-auto text-center z-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#7F77DD15] border border-[#7F77DD] rounded-full text-xs font-mono text-[#AFA9EC] mb-6 uppercase tracking-wider font-semibold">
          <Zap className="w-3.5 h-3.5 text-[#1D9E75]" /> AMETHYST ENGINE DELAY PREDICTORS
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6 text-white">
          Train Delay <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7F77DD] to-[#1D9E75]">
            Ripple Calculator
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#9B98B8] mb-10 max-w-xl leading-relaxed">
          Predict missed connections before they happen. Our intelligent mapping models live delay propagation cascading across major stations to protect your itinerary.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto font-semibold">
          <button
            id="btn-hero-dashboard"
            onClick={onEnter}
            className="px-8 py-4 bg-gradient-to-r from-[#7F77DD] to-[#534AB7] text-white text-base font-bold rounded-xl shadow-[0_0_20px_#7F77DD40] border border-[#FFFFFF12] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Enter Delay Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#delay-radar"
            className="px-8 py-4 bg-transparent hover:border-[#7F77DD] text-white text-base font-bold rounded-xl border border-solid border-[#FFFFFF30] transition-all flex items-center justify-center gap-2"
          >
            Monitor Delay Radar
          </a>
        </div>

        {/* Hero Metrics Panel */}
        <div className="grid grid-cols-3 gap-6 mt-16 border-t border-dashed border-border pt-8 w-full max-w-lg z-20 relative">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#7F77DD] font-mono">
              <CountUp value={10000} suffix="+" />
            </div>
            <div className="text-xs text-[#9B98B8] mt-1 uppercase tracking-wider font-semibold">Routes Analyzed</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#1D9E75] font-mono">
              <CountUp value={98} suffix="%" />
            </div>
            <div className="text-xs text-[#9B98B8] mt-1 uppercase tracking-wider font-semibold">ML Accuracy</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#7F77DD] font-mono">
              <CountUp value={500} suffix="+" />
            </div>
            <div className="text-xs text-[#9B98B8] mt-1 uppercase tracking-wider font-semibold">Stations Covered</div>
          </div>
        </div>
      </section>

      {/* How it works Walkthrough Section */}
      <section id="how-it-works" className="relative py-20 px-6 border-y border-dashed border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-3">System Architecture</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-foreground">Stitching the Journey</h3>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              How RippleRail computes dynamic bottleneck ripples to project exact arrival and safety margins.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 border-t border-dashed border-border -translate-y-1/2 hidden md:block z-0" />

            {/* Step 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-card border border-border rounded-xl p-6 relative stitch-corner stitch-corner-tl stitch-corner-br flex flex-col justify-between h-full z-10 shadow-sm hover:shadow-md hover:border-[#7F77DD]/50 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 bg-[#7F77DD]/10 border border-[#7F77DD]/20 rounded-xl flex items-center justify-center text-[#7F77DD] font-mono font-bold text-lg mb-6 shadow-inner">
                  01
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Input Route Matrix</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Provide your target train schedule details, connection points, and layover buffer windows to compile your active tracking nodes.
                </p>
              </div>
              <div className="border-t border-dashed border-border pt-4 mt-6 text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7F77DD]" /> Real-time Sync
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-card border border-border rounded-xl p-6 relative stitch-corner stitch-corner-tr stitch-corner-bl flex flex-col justify-between h-full z-10 shadow-sm hover:shadow-md hover:border-[#1D9E75]/50 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-xl flex items-center justify-center text-[#1D9E75] font-mono font-bold text-lg mb-6 shadow-inner">
                  02
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Ripple Propagation Model</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our system traces down-line train dependencies, weather patterns, and hub occupancy logs to simulate cascaded delays across the track lines.
                </p>
              </div>
              <div className="border-t border-dashed border-border pt-4 mt-6 text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1D9E75]" /> Multi-Layer Calculus
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-card border border-border rounded-xl p-6 relative stitch-corner stitch-corner-tl stitch-corner-br flex flex-col justify-between h-full z-10 shadow-sm hover:shadow-md hover:border-[#7F77DD]/50 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 bg-[#7F77DD]/10 border border-[#7F77DD]/20 rounded-xl flex items-center justify-center text-[#7F77DD] font-mono font-bold text-lg mb-6 shadow-inner">
                  03
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Alternative Action Plan</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If risk bounds are broken, receive immediate alternative trains, bus connections, or cab estimations to keep your travel on track.
                </p>
              </div>
              <div className="border-t border-dashed border-border pt-4 mt-6 text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7F77DD]" /> Guarantee Route
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Section 1: Live Cascading Delay Radar */}
      <section id="delay-radar" className="py-24 px-6 max-w-7xl mx-auto z-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-xs font-mono text-[#7F77DD] uppercase tracking-widest mb-3">Live Cascadence Visualizer</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-foreground">
              Watch Delays Cascade in Real Time
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Trains don't run in isolation. A delay at a primary terminal ripples across the entire network. Click the button to inject a simulated delay at Mumbai Central and watch the ripple propagate down to Hazrat Nizamuddin.
            </p>

            <button
              id="btn-trigger-cascade"
              onClick={triggerCascade}
              disabled={isCascading}
              className="px-6 py-3.5 bg-[#1D9E75] hover:bg-[#15825f] text-white border-none shadow-[0_0_15px_#1D9E7540] disabled:opacity-50 transition-all font-semibold rounded-xl flex items-center gap-3 cursor-pointer"
            >
              {isCascading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  Propagating Cascades...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-white" />
                  Inject delay at Mumbai (+15m)
                </>
              )}
            </button>

            {cascadeStep >= 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl border border-dashed border-rose-500/30 bg-rose-500/10 text-xs flex gap-3 max-w-md text-rose-400"
              >
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold text-rose-500 block mb-0.5">CASCADE ALERT REPORTED</span>
                  Inbound delay at Mumbai has compounded over subsequent hubs. Connecting trains at Hazrat Nizamuddin are now marked at extreme risk of failure.
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Node Path Graph */}
          <div className="lg:col-span-7 bg-card border border-border rounded-xl p-8 relative stitch-corner stitch-corner-tr stitch-corner-bl shadow-md">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-[#9B98B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD] animate-ping" />
              SIMULATED RADAR FEED
            </div>
            
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-[#7F77DD]" />
              Mumbai-Delhi Express Corridor Cascade
            </h4>

            {/* Nodes Wrapper */}
            <div className="flex flex-col gap-8 relative">
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 border-l border-dashed border-border z-0" />

              {radarStations.map((station, idx) => {
                const isDelayed = station.delay > 0;
                let circleColor = "bg-[#13102A] border-[#FFFFFF12] text-[#9B98B8]";
                let badgeStyle = "bg-[#13102A] text-[#9B98B8] border-[#FFFFFF12]";
                
                if (station.status === "slight") {
                  circleColor = "bg-[#1D9E75]/20 border-[#1D9E75] text-[#1D9E75] glow-emerald";
                  badgeStyle = "bg-[#1D9E75]/15 text-[#1D9E75] border-[#1D9E75]/30";
                } else if (station.status === "moderate") {
                  circleColor = "bg-amber-500/20 border-amber-500 text-amber-400 glow-amber";
                  badgeStyle = "bg-amber-500/15 text-amber-400 border-amber-500/30";
                } else if (station.status === "high" || station.status === "missed") {
                  circleColor = "bg-rose-500/20 border-rose-500 text-rose-400 glow-red animate-pulse";
                  badgeStyle = "bg-rose-500/15 text-rose-400 border-rose-500/30";
                }

                return (
                  <div key={station.code} className="flex items-center justify-between z-10 relative">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-500 ${circleColor}`}>
                        {station.code}
                      </div>
                      <div>
                        <span className="font-bold block text-sm md:text-base text-foreground/80">{station.name}</span>
                        <span className="text-xs text-[#9B98B8] font-semibold">Scheduled Stop</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {idx < radarStations.length - 1 && (
                        <div className="hidden md:flex items-center gap-1 opacity-45">
                          <span className={`w-1.5 h-1.5 rounded-full ${cascadeStep >= idx ? "bg-rose-500 animate-ping" : "bg-border"}`} />
                          <ChevronRight className="w-4 h-4 text-border" />
                        </div>
                      )}

                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${badgeStyle} transition-all duration-500`}>
                          {isDelayed ? `+${station.delay}m delay` : "On Time"}
                        </span>
                        <span className="block text-[10px] text-[#9B98B8] font-mono mt-1">
                          {idx === 0 && isDelayed && "Inbound Impact"}
                          {idx > 0 && idx < 3 && isDelayed && "Cascading Ripple"}
                          {idx >= 3 && isDelayed && "Connection Missed!"}
                          {!isDelayed && "Clear Runway"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {cascadeStep >= 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCascadeStep(-1)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear Simulation
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Section 2: Journey Buffer & Risk Simulator Widget */}
      <section id="risk-calculator" className="py-20 px-6 bg-[#13102A]/40 border-t border-dashed border-[#FFFFFF12] z-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-[#7F77DD] uppercase tracking-widest mb-3">Hands-On Playground</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white">Instant Connection Risk Gauge</h3>
            <p className="text-[#9B98B8] mt-4 max-w-xl mx-auto">
              Simulate travel timings. Adjust transfer windows and delayed arrivals to see how safe your connection is.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Input Sliders Column */}
            <div className="lg:col-span-7 bg-[#13102A] border border-[#FFFFFF12] rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-md">
              <div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                  <Layers className="w-5 h-5 text-[#7F77DD]" />
                  Parameters Config Panel
                </h4>

                {/* Slider 1: Transfer Window */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#9B98B8] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#7F77DD]" /> Planned Transfer Window
                    </span>
                    <span className="font-mono text-sm text-[#7F77DD] font-bold px-2 py-0.5 bg-[#7F77DD]/15 border border-[#7F77DD]/30 rounded-md">
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
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#7F77DD]"
                  />
                  <div className="flex justify-between text-[10px] text-[#9B98B8] font-mono mt-1">
                    <span>15 MINS (TIGHT)</span>
                    <span>60 MINS</span>
                    <span>120 MINS (RELAXED)</span>
                  </div>
                </div>

                {/* Slider 2: Inbound Delay */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#9B98B8] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Inbound Train Delay
                    </span>
                    <span className="font-mono text-sm text-[#AFA9EC] font-bold px-2 py-0.5 bg-[#AFA9EC]/15 border border-[#FFFFFF12] rounded-md">
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
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#7F77DD]"
                  />
                  <div className="flex justify-between text-[10px] text-[#9B98B8] font-mono mt-1">
                    <span>0 MINS (ON TIME)</span>
                    <span>60 MINS</span>
                    <span>120 MINS (SEVERE)</span>
                  </div>
                </div>
              </div>

              {/* Summary details */}
              <div className="border-t border-dashed border-[#FFFFFF12] pt-6 mt-6">
                <h5 className="text-xs font-mono text-[#7F77DD] uppercase tracking-widest mb-3">Live Risk Projection</h5>
                <div className={`p-4 rounded-xl border ${riskBg} transition-all duration-350`}>
                  <span className={`text-base font-bold flex items-center gap-2 ${riskColorText}`}>
                    {riskStatus === "safe" && <ShieldCheck className="w-5 h-5 shrink-0" />}
                    {riskStatus === "caution" && <AlertTriangle className="w-5 h-5 shrink-0" />}
                    {riskStatus === "critical" && <ShieldAlert className="w-5 h-5 shrink-0" />}
                    {riskLabel}
                  </span>
                  <p className="text-sm text-[#9B98B8] mt-2 leading-relaxed">
                    {riskStatus === "safe" && `Your transfer timeline is completely secure. You will arrive with a comfortable buffer margin of ${netBuffer} minutes before the outgoing connection departs.`}
                    {riskStatus === "caution" && `Extremely tight connection window! A net buffer of only ${netBuffer} minutes remains. A slight delay hike could result in missing the train. Monitor live updates.`}
                    {riskStatus === "critical" && `Warning! Outgoing train departed ${Math.abs(netBuffer)} minutes before your inbound arrival. RippleRail recommends routing through alternatives immediately.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Gauge Dial Panel */}
            <div className="lg:col-span-5 bg-[#13102A] border border-[#FFFFFF12] rounded-xl p-6 md:p-8 flex flex-col items-center justify-between text-center relative stitch-corner stitch-corner-tl stitch-corner-br shadow-md">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-[#9B98B8]/80">
                GAUGE FEED: ANALOG OUT
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2 text-white">Calculated Risk Factor</h4>
                <p className="text-xs text-[#9B98B8]">Dynamic Risk Margin Indicator</p>
              </div>

              {/* Arc Dial SVG */}
              <div className="relative w-64 h-36 mt-4">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1D9E75" /> 
                      <stop offset="50%" stopColor="#f59e0b" /> 
                      <stop offset="100%" stopColor="#ef4444" /> 
                    </linearGradient>
                  </defs>

                  <path 
                    d="M 20 90 A 80 80 0 0 1 180 90" 
                    fill="none" 
                    stroke="url(#gauge-grad)" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    className="opacity-95"
                  />

                  <path 
                    d="M 20 90 A 80 80 0 0 1 180 90" 
                    fill="none" 
                    stroke="var(--border)" 
                    strokeWidth="2.5" 
                    strokeDasharray="4,6"
                    className="opacity-60"
                  />

                  <circle cx="100" cy="90" r="6" fill="#7F77DD" />
                  <circle cx="100" cy="90" r="3" fill="#FFFFFF" />

                  {/* Indicator Needle */}
                  <g transform={`rotate(${needleRotation} 100 90)`} className="transition-transform duration-500 ease-out">
                    <line 
                      x1="100" 
                      y1="90" 
                      x2="100" 
                      y2="15" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      className="shadow-sm text-foreground"
                    />
                    <polygon points="100,10 97,18 103,18" className="fill-foreground" />
                  </g>
                </svg>

                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {Math.round(riskPercent)}%
                  </span>
                  <span className="text-[10px] text-[#9B98B8] font-mono uppercase tracking-wider">Risk Level</span>
                </div>
              </div>

              {/* Dashboard redirection link */}
              <div className="w-full mt-4">
                <button
                  onClick={onEnter}
                  className="w-full px-4 py-3 bg-[#1D9E75] hover:bg-[#15825f] text-white hover:text-white transition-all text-xs font-mono border-none rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_#1D9E7540]"
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
      <section className="py-24 px-6 max-w-7xl mx-auto z-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-[#7F77DD] uppercase tracking-widest mb-3">Enterprise Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white">Engineered for Rail Resilience</h3>
          <p className="text-[#9B98B8] mt-4 max-w-xl mx-auto">
            Deep scheduling data combined with localized predictive graphs to give you maximum travel assurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#13102A] border border-[#FFFFFF12] p-6 rounded-xl relative stitch-corner stitch-corner-tl hover:border-[#7F77DD]/40 transition-colors shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#7F77DD]/10 border border-[#7F77DD]/20 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#7F77DD]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Predictive Delay Models</h4>
            <p className="text-sm text-[#9B98B8] leading-relaxed">
              We compile regional congestion data, buffer thresholds, and layout structures to estimate real cascades in minutes, not estimates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#13102A] border border-[#FFFFFF12] p-6 rounded-xl relative stitch-corner stitch-corner-tr hover:border-[#1D9E75]/40 transition-colors shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-[#1D9E75]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Ripple Propagation Maps</h4>
            <p className="text-sm text-[#9B98B8] leading-relaxed">
              Visualize how delays propagate through visual maps using node networks to trace cascade warnings down individual trains.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#13102A] border border-[#FFFFFF12] p-6 rounded-xl relative stitch-corner hover:border-[#7F77DD]/40 transition-colors shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#7F77DD]/10 border border-[#7F77DD]/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#7F77DD]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Mitigation & Safety Buffers</h4>
            <p className="text-sm text-[#9B98B8] leading-relaxed">
              Get alert notification triggers and automated backup alternatives recommendations for other routes, buses, or cabs instantly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 px-6 bg-[#13102A]/40 border-t border-dashed border-[#FFFFFF12] z-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-[#7F77DD] uppercase tracking-widest mb-3">Support & Information</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">Frequently Asked Questions</h3>
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
                  className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base hover:bg-[#13102A]/50 text-white transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#7F77DD] shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[#9B98B8] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#7F77DD]" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-[#9B98B8] leading-relaxed border-t border-dashed border-[#FFFFFF12]/30">
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
      <footer className="border-t border-dashed border-[#FFFFFF12] bg-[#13102A]/30 py-12 px-6 z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7F77DD]/10 border border-[#FFFFFF12] rounded-lg flex items-center justify-center">
              <Train className="w-4 h-4 text-[#7F77DD]" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-white">RIPPLE RAIL</span>
              <span className="block text-[8px] font-mono text-[#9B98B8] uppercase">Route Safety Engine</span>
            </div>
          </div>

          <div className="flex gap-8 text-xs font-mono text-[#9B98B8]">
            <span>© 2026 RIPPLE RAIL LABS</span>
            <span>LICENSED BY RAIL OPERATIONS</span>
            <button 
              onClick={onEnter}
              className="hover:text-[#7F77DD] text-[#9B98B8] transition-colors underline cursor-pointer"
            >
              LAUNCH CONSOLE
            </button>
          </div>
        </div>
      </footer>
      </motion.div>

    </div>
  );
}
