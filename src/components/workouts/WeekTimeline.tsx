import { motion } from "framer-motion";
import { WEEK_PHASES } from "@/data/workoutProgram";

const ease = [0.16, 1, 0.3, 1] as const;

interface WeekTimelineProps {
  currentWeek: number;
}

const WeekTimeline = ({ currentWeek }: WeekTimelineProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="overflow-x-auto scrollbar-hide -mx-5 px-5"
    >
      <div className="flex items-center gap-1 min-w-max py-2">
        {Array.from({ length: 10 }, (_, i) => {
          const week = i + 1;
          const isCurrent = week === currentWeek;
          const isCompleted = week < currentWeek;
          const phase = WEEK_PHASES.find((p) => {
            const parts = p.weeks.split("-").map(Number);
            return parts.length === 1 ? week === parts[0] : week >= parts[0] && week <= parts[1];
          });

          return (
            <div key={week} className="flex flex-col items-center gap-1 min-w-[56px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  isCurrent
                    ? "gradient-hero text-[hsl(var(--on-primary))] shadow-[0_0_12px_hsla(160,100%,45%,0.3)]"
                    : isCompleted
                    ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant)/0.5)]"
                }`}
              >
                {isCompleted ? "✓" : week}
              </div>
              <span className={`text-[9px] font-mono uppercase tracking-wider ${
                isCurrent ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--on-surface-variant)/0.4)]"
              }`}>
                {phase?.label || ""}
              </span>
              {i < 9 && (
                <div className={`absolute mt-4 ml-[56px] w-[24px] h-[2px] ${
                  isCompleted ? "bg-[hsl(var(--primary)/0.3)]" : "bg-[hsl(var(--surface-container-high))]"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeekTimeline;
