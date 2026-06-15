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
      borderColor: "border-l-blue-500",
    },
    {
      title: "Predicted Delay",
      value: "45 mins",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      borderColor: "border-l-orange-500",
    },
    {
      title: "Connection Probability",
      value: "73%",
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-500/10",
      borderColor: "border-l-green-500",
    },
    {
      title: "Risk Level",
      value: "Medium",
      icon: ShieldAlert,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      borderColor: "border-l-yellow-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className={`p-6 bg-card border border-border border-l-4 ${card.borderColor} rounded-xl flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
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
    </motion.div>
  );
}
