import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, ClipboardList } from "lucide-react";
import type { WorkoutDay } from "@/data/workoutProgram";

const ease = [0.16, 1, 0.3, 1] as const;

type DayStatus = "completed" | "today" | "upcoming" | "locked";

interface WorkoutDayCardProps {
  workout: WorkoutDay;
  status: DayStatus;
  injectionDaysAgo?: number;
  onStart: () => void;
  onLog: () => void;
}

const STATUS_CONFIG: Record<DayStatus, { icon: string; label: string; color: string }> = {
  completed: { icon: "✅", label: "COMPLETED", color: "text-[hsl(var(--primary))]" },
  today: { icon: "🔵", label: "TODAY", color: "text-[hsl(var(--secondary))]" },
  upcoming: { icon: "⚪", label: "UPCOMING", color: "text-[hsl(var(--on-surface-variant))]" },
  locked: { icon: "🔒", label: "LOCKED", color: "text-[hsl(var(--accent-gold))]" },
};

const TYPE_ICONS: Record<string, string> = {
  strength: "💪",
  recovery: "🔄",
  hiit: "💥",
  nausea: "🤕",
  rest: "😴",
};

const WorkoutDayCard = ({ workout, status, injectionDaysAgo, onStart, onLog }: WorkoutDayCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[status];
  const isRest = workout.type === "rest";

  const coachNote = workout.coachNote.replace(
    "{injectionDaysAgo}",
    String(injectionDaysAgo ?? "?")
  );

  if (isRest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="rounded-lg bg-[hsl(var(--surface-container-low))] p-4 flex items-center gap-3 opacity-60"
      >
        <span className="text-lg">😴</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-[hsl(var(--on-surface))]">{workout.day} — Rest Day</p>
          <p className="text-xs text-[hsl(var(--on-surface-variant))]">{workout.coachNote}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className={`rounded-lg overflow-hidden transition-all ${
        status === "today"
          ? "bg-[hsl(var(--surface-container-low))] border border-[hsl(var(--primary)/0.2)] shadow-[0_0_20px_hsla(160,100%,45%,0.06)]"
          : "bg-[hsl(var(--surface-container-low))]"
      }`}
    >
      <button
        onClick={() => status !== "locked" && setExpanded(!expanded)}
        disabled={status === "locked"}
        className="w-full flex items-center gap-3 p-4 text-left active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg shrink-0">{TYPE_ICONS[workout.type] || "💪"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[hsl(var(--on-surface))] truncate">
              {workout.day} — {workout.title}
            </p>
          </div>
          <p className="text-xs text-[hsl(var(--on-surface-variant))]">
            ~{workout.duration} min · {workout.level}
          </p>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-widest ${statusConfig.color}`}>
          {statusConfig.icon} {statusConfig.label}
        </span>
        {status !== "locked" && (
          <ChevronDown className={`w-4 h-4 text-[hsl(var(--on-surface-variant))] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Coach Note */}
              <div className="bg-[hsl(var(--accent-purple)/0.08)] border-l-2 border-[hsl(var(--accent-purple))] rounded-r-lg p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--accent-purple))] mb-1">
                  GLP-1 Coach Note
                </p>
                <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed italic">
                  "{coachNote}"
                </p>
              </div>

              {/* Exercises */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))]">
                  Exercises
                </p>
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[hsl(var(--surface-container))]">
                    <span className="text-xs font-mono text-[hsl(var(--primary))] w-5 shrink-0">
                      {["①", "②", "③", "④", "⑤", "⑥"][i] || `${i + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[hsl(var(--on-surface))]">{ex.name}</p>
                      <p className="text-[10px] text-[hsl(var(--on-surface-variant))]">{ex.muscleGroup}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[hsl(var(--primary))]">
                      {ex.sets} × {ex.reps}
                    </span>
                    <button className="text-[10px] font-mono text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors px-1.5 py-0.5 rounded bg-[hsl(var(--secondary)/0.08)]">
                      ▶ Demo
                    </button>
                  </div>
                ))}
              </div>

              {/* Rest period */}
              <p className="text-xs text-[hsl(var(--on-surface-variant))] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">timer</span>
                {workout.restPeriod}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onStart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-sm active:scale-[0.97] transition-transform"
                >
                  <Play className="w-4 h-4" />
                  Start Workout
                </button>
                <button
                  onClick={onLog}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))] text-sm hover:bg-[hsl(var(--surface-container-high))] transition-colors active:scale-[0.97]"
                >
                  <ClipboardList className="w-4 h-4" />
                  Log
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutDayCard;
