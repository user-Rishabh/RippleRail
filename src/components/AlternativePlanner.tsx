import { Bus, Car, TrainFront, Clock, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function AlternativePlanner() {
  const alternatives = [
    {
      type: "Train",
      name: "Shatabdi Exp (12001)",
      time: "2h 15m wait",
      cost: "₹850",
      icon: TrainFront,
      recommendation: "Best option if you miss connection.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30"
    },
    {
      type: "Bus",
      name: "Volvo Multi-Axle",
      time: "1h 30m wait",
      cost: "₹600",
      icon: Bus,
      recommendation: "Fastest immediate departure.",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/30"
    },
    {
      type: "Cab",
      name: "Intercity Hatchback",
      time: "Available Now",
      cost: "₹2,400",
      icon: Car,
      recommendation: "Most expensive, but immediate.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Smart Alternative Planner</h2>
      <div className="space-y-4">
        {alternatives.map((alt, index) => (
          <motion.div 
            key={alt.type} 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-lg border ${alt.border} bg-background/50 hover:bg-background transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${alt.bg}`}>
                <alt.icon className={`w-6 h-6 ${alt.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{alt.type} - {alt.name}</h3>
                  {index === 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse">
                      Best Choice
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{alt.recommendation}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{alt.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{alt.cost}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
