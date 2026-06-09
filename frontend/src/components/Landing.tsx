import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Train, ShieldAlert, Zap } from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quad
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
  const titleWords = "Train Delay Ripple Calculator".split(" ");

  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[100px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl flex flex-col items-center w-full"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-4 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm"
          >
            <Train className="w-16 h-16 text-blue-600" />
          </motion.div>
        </div>

        <motion.h1
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 py-1"
        >
          {titleWords.map((word, idx) => (
            <motion.span key={idx} variants={wordVariants} className="inline-block mr-3 md:mr-4">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-xl">
          Predict missed train connections before they happen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <motion.button
            onClick={onEnter}
            animate={{
              boxShadow: [
                "0 0 0px rgba(37,99,235,0)",
                "0 0 20px rgba(37,99,235,0.4)",
                "0 0 0px rgba(37,99,235,0)"
              ],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors cursor-pointer w-full sm:w-auto"
          >
            Check Connection Risk
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-xl border border-slate-200 shadow-sm transition-colors w-full sm:w-auto"
          >
            View Live Network
          </motion.button>
        </div>

        {/* Feature Highlights */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
            className="p-6 bg-white border border-slate-200/80 rounded-2xl text-left shadow-sm transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Predictive Risk</h3>
            <p className="text-sm text-slate-500 leading-relaxed">ML-powered connection risk scoring for peace of mind.</p>
          </motion.div>
          
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
            className="p-6 bg-white border border-slate-200/80 rounded-2xl text-left shadow-sm transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Ripple Mapping</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Visualize delay propagation across the railway network.</p>
          </motion.div>
          
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
            className="p-6 bg-white border border-slate-200/80 rounded-2xl text-left shadow-sm transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Train className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Alternatives</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Instant backup plans if your connection is at risk.</p>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 py-6 px-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center"
        >
          <div className="flex flex-col items-center justify-center py-2 md:py-0">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">
              <CountUp value={10000} suffix="+" />
            </span>
            <span className="text-sm font-medium text-slate-500">Routes Analyzed</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2 md:py-0">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">
              <CountUp value={98} suffix="%" />
            </span>
            <span className="text-sm font-medium text-slate-500">Prediction Accuracy</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2 md:py-0 text-center">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">
              <CountUp value={500} suffix="+" />
            </span>
            <span className="text-sm font-medium text-slate-500">Stations Covered</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
