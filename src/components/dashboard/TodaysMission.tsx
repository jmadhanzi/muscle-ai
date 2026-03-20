import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DAILY_PROTOCOL } from "@/config/features";

const WEEK1_EXERCISES = [
  { name: "Goblet Squats", sets: "3×12", free: true },
  { name: "Resistance Band Rows", sets: "3×15", free: true },
  { name: "Dumbbell Chest Press", sets: "3×10", free: false },
  { name: "Walking Lunges", sets: "3×12", free: false },
  { name: "Plank Hold", sets: "3×30s", free: false },
  { name: "Bicep Curls", sets: "3×12", free: false },
];

interface TodaysMissionProps {
  checkedItems: Set<string>;
  completedFree: number;
  totalFree: number;
  onToggle: (id: string, free: boolean) => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const TodaysMission = ({ checkedItems, completedFree, totalFree, onToggle }: TodaysMissionProps) => {
  const navigate = useNavigate();
  const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
            <h2 className="font-headline font-bold text-lg text-on-surface">Today's Mission</h2>
          </div>
          <span className="text-xs font-mono text-primary">{completedFree}/{totalFree}</span>
        </div>
        <p className="text-on-surface-variant text-xs">{dayOfWeek} — Resistance Training</p>
      </div>

      {/* Protocol checklist */}
      <div className="px-3 pb-2">
        {DAILY_PROTOCOL.map((item) => {
          const checked = checkedItems.has(item.id);
          const locked = !item.free;
          return (
            <motion.button
              key={item.id}
              onClick={() => onToggle(item.id, item.free)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 active:scale-[0.97] text-left ${
                locked ? "opacity-50" : checked ? "bg-primary/8" : "hover:bg-surface-container"
              }`}
              whileTap={locked ? {} : { scale: 0.97 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                locked ? "border-surface-variant" : checked ? "border-primary bg-primary" : "border-on-surface-variant/30"
              }`}>
                {locked ? (
                  <Lock className="w-3 h-3 text-on-surface-variant" />
                ) : checked ? (
                  <span className="material-symbols-outlined text-on-primary text-sm">check</span>
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${checked ? "text-primary line-through" : "text-on-surface"}`}>{item.label}</p>
              </div>
              {locked && (
                <span className="text-[8px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded-full">Pro</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Workout preview */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-secondary text-lg">fitness_center</span>
          <span className="text-sm font-medium text-on-surface">Week 1 Workout Preview</span>
        </div>
        <div className="space-y-1.5">
          {WEEK1_EXERCISES.map((ex, i) => (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.35, ease }}
              className={`flex items-center justify-between text-sm py-1 ${!ex.free ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-2">
                {!ex.free && <Lock className="w-3 h-3 text-on-surface-variant" />}
                <span className={ex.free ? "text-on-surface" : "text-on-surface-variant"}>{ex.name}</span>
              </div>
              <span className="font-mono text-xs text-on-surface-variant">{ex.free ? ex.sets : "—"}</span>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full mt-4 py-3 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Lock className="w-3.5 h-3.5 text-accent-gold" />
          Unlock Full Workout — Go Premium
        </button>
      </div>
    </div>
  );
};

export default TodaysMission;
