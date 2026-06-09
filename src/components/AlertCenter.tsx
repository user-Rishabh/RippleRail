import { Bell, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AlertCenter() {
  const alerts = [
    {
      id: 1,
      message: "Your connection at Bhopal is becoming risky due to sudden congestion.",
      time: "2 mins ago",
      type: "warning",
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30"
    },
    {
      id: 2,
      message: "Alternative train (Shatabdi) available in 55 minutes if you miss the connection.",
      time: "15 mins ago",
      type: "info",
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold">Alert Center</h2>
        </div>
      </div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            variants={itemVariants}
            className={`p-4 rounded-lg border ${alert.border} border-l-4 ${
              alert.type === "warning"
                ? "border-l-yellow-500 bg-yellow-500/[0.04]"
                : "border-l-blue-500 bg-blue-500/[0.04]"
            } bg-background flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`p-2 rounded-full ${alert.bg} mt-1`}>
              <alert.icon className={`w-4 h-4 ${alert.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
