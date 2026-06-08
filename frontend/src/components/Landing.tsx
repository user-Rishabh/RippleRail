import { motion } from "framer-motion";
import { Train, ShieldAlert, Zap } from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden dark">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <Train className="w-16 h-16 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Train Delay Ripple Calculator
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-10">
          Predict missed train connections before they happen.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={onEnter}
            className="px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-1"
          >
            Check Connection Risk
          </button>
          <button className="px-8 py-4 bg-secondary text-secondary-foreground text-lg font-semibold rounded-xl border border-border hover:bg-secondary/80 transition-all">
            View Live Network
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl text-left"
          >
            <ShieldAlert className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Predictive Risk</h3>
            <p className="text-sm text-muted-foreground">ML-powered connection risk scoring for peace of mind.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl text-left"
          >
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ripple Mapping</h3>
            <p className="text-sm text-muted-foreground">Visualize delay propagation across the railway network.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl text-left"
          >
            <Train className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Alternatives</h3>
            <p className="text-sm text-muted-foreground">Instant backup plans if your connection is at risk.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
