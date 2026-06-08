import { motion } from "framer-motion";
import { Activity, Clock, ShieldAlert, Train } from "lucide-react";

export default function TopCards() {
  const cards = [
    {
      title: "Current Train",
      value: "12951 Mumbai Rajdhani",
      icon: Train,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Predicted Delay",
      value: "45 mins",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Connection Probability",
      value: "73%",
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Risk Level",
      value: "Medium",
      icon: ShieldAlert,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 bg-card border border-border rounded-xl flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
            <h3 className="text-xl font-bold">{card.value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${card.bg}`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
