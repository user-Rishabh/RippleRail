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

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Alert Center</h2>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border ${alert.border} bg-background flex gap-4 items-start`}
          >
            <div className={`p-2 rounded-full ${alert.bg} mt-1`}>
              <alert.icon className={`w-4 h-4 ${alert.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
