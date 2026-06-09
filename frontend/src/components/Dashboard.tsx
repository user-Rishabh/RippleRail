import { motion } from "framer-motion";
import TopCards from "./TopCards";
import RiskCalculator from "./RiskCalculator";
import RippleMap from "./RippleMap";
import AlternativePlanner from "./AlternativePlanner";
import AlertCenter from "./AlertCenter";

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const titleText = "Operations Dashboard";
  
  const titleContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      }
    }
  };

  const titleCharVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-background text-foreground p-4 md:p-8 dark relative"
    >
      {/* Animated gradient header bar at the top */}
      <motion.div 
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 bg-[length:200%_100%] z-50"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
            >
              {titleText.split("").map((char, index) => (
                <motion.span key={index} variants={titleCharVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
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
    </motion.div>
  );
}
