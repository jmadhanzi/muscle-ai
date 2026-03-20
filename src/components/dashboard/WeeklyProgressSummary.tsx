import { motion } from "framer-motion";
import { CountUp } from "@/components/motion/Animated";

interface WeeklyProgressSummaryProps {
  proteinTarget: number;
  muscleScoreChange: number;
  streakDays: number;
}

const WeeklyProgressSummary = ({ proteinTarget, muscleScoreChange, streakDays }: WeeklyProgressSummaryProps) => {
  const workoutsCompleted = 4;
  const workoutsTotal = 5;
  const avgProtein = Math.round(proteinTarget * 0.78);

  const items = [
    {
      icon: "fitness_center",
      label: "Workouts",
      value: `${workoutsCompleted}/${workoutsTotal}`,
      sub: "completed this week",
      color: "text-primary",
    },
    {
      icon: "egg_alt",
      label: "Protein Avg",
      value: `${avgProtein}g/day`,
      sub: `target: ${proteinTarget}g`,
      color: avgProtein >= proteinTarget * 0.8 ? "text-primary" : "text-accent-gold",
    },
    {
      icon: "trending_up",
      label: "Score Change",
      value: `+${muscleScoreChange}`,
      sub: "this week",
      color: "text-primary",
    },
    {
      icon: "local_fire_department",
      label: "Streak",
      value: `${streakDays} days`,
      sub: "keep going!",
      color: "text-accent-gold",
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-border p-5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Weekly Summary</span>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface-container-low rounded-lg p-3.5"
          >
            <span className={`material-symbols-outlined ${item.color} text-lg`}>{item.icon}</span>
            <p className={`font-mono font-bold text-lg ${item.color} mt-1 leading-none`}>{item.value}</p>
            <p className="text-[9px] font-mono text-on-surface-variant mt-1 uppercase tracking-wider">{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgressSummary;
