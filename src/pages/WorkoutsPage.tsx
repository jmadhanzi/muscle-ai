import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { PROGRAM, NAUSEA_PROTOCOL } from "@/data/workoutProgram";
import type { WorkoutDay } from "@/data/workoutProgram";
import WeekTimeline from "@/components/workouts/WeekTimeline";
import WorkoutDayCard from "@/components/workouts/WorkoutDayCard";
import NauseaCard from "@/components/workouts/NauseaCard";
import WorkoutExecution from "@/components/workouts/WorkoutExecution";
import type { ExerciseLog } from "@/components/workouts/WorkoutExecution";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

type ProgramTab = "strength" | "recovery" | "hiit" | "nausea";

const TABS: { id: ProgramTab; icon: string; label: string }[] = [
  { id: "strength", icon: "💪", label: "Strength" },
  { id: "recovery", icon: "🔄", label: "Recovery" },
  { id: "hiit", icon: "💥", label: "HIIT-Light" },
  { id: "nausea", icon: "🤕", label: "Nausea Day" },
];

const ENCOURAGEMENT = [
  "Keep going — consistency beats perfection!",
  "Your muscles are thanking you.",
  "Every rep counts toward preservation.",
  "You're building habits that last.",
  "Strong start this week!",
  "Momentum is on your side.",
  "Almost there — finish strong!",
];

const WorkoutsPage = () => {
  const paywall = usePaywall();
  const { isPro } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeTab, setActiveTab] = useState<ProgramTab>("strength");
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const week = PROGRAM[currentWeek - 1];
  const isWeekLocked = !isPro && !week.free;

  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun=6, Mon=0...
  const todayIndex = dayMap[today];

  // Filter days by active tab
  const filteredDays = useMemo(() => {
    if (activeTab === "nausea") return [];
    return week.days.filter((d) => {
      if (activeTab === "strength") return d.type === "strength" || d.type === "rest";
      return d.type === activeTab;
    });
  }, [week, activeTab]);

  const weekCompletedCount = week.days.filter(
    (d) => completedWorkouts.has(`${currentWeek}-${d.day}`)
  ).length;

  const encouragement = ENCOURAGEMENT[Math.min(weekCompletedCount, ENCOURAGEMENT.length - 1)];

  const getDayStatus = (day: WorkoutDay, dayIndex: number) => {
    if (isWeekLocked) return "locked" as const;
    if (completedWorkouts.has(`${currentWeek}-${day.day}`)) return "completed" as const;
    if (dayIndex === todayIndex) return "today" as const;
    return "upcoming" as const;
  };

  const handleStartWorkout = (workout: WorkoutDay) => {
    if (isWeekLocked) {
      paywall.fire("week2_unlock");
      return;
    }
    paywall.setWorkoutActive(true);
    setActiveWorkout(workout);
  };

  const handleCompleteWorkout = (_log: ExerciseLog[]) => {
    if (activeWorkout) {
      setCompletedWorkouts((prev) => new Set([...prev, `${currentWeek}-${activeWorkout.day}`]));
      toast.success("Workout complete! 💪", {
        description: "Your muscle preservation signal has been sent.",
      });
    }
    paywall.setWorkoutActive(false);
    setActiveWorkout(null);
  };

  const handleExitWorkout = () => {
    paywall.setWorkoutActive(false);
    setActiveWorkout(null);
  };

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Workout Execution Overlay */}
      <AnimatePresence>
        {activeWorkout && (
          <WorkoutExecution
            workout={activeWorkout}
            onComplete={handleCompleteWorkout}
            onExit={handleExitWorkout}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-2"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-headline font-bold text-2xl text-[hsl(var(--on-surface))]">Training Program</h1>
          {/* Week selector */}
          <select
            value={currentWeek}
            onChange={(e) => setCurrentWeek(Number(e.target.value))}
            className="bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface))] text-sm font-mono rounded-lg px-3 py-1.5 outline-none border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)]"
          >
            {PROGRAM.map((w) => (
              <option key={w.week} value={w.week}>
                Week {w.week}
              </option>
            ))}
          </select>
        </div>

        {/* Week Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-[hsl(var(--on-surface-variant))]">
              Week {currentWeek} of 10
            </span>
            <span className="text-xs font-mono text-[hsl(var(--primary))]">
              {week.label}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[hsl(var(--surface-container-high))] overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-hero"
              initial={{ width: 0 }}
              animate={{ width: `${(currentWeek / 10) * 100}%` }}
              transition={{ duration: 0.6, ease }}
            />
          </div>
          <p className="text-[11px] text-[hsl(var(--on-surface-variant))] mt-1.5">
            {weekCompletedCount} workout{weekCompletedCount !== 1 ? "s" : ""} completed this week — {encouragement}
          </p>
        </div>
      </motion.header>

      <div className="px-5 space-y-5">
        {/* 10-Week Timeline */}
        <WeekTimeline currentWeek={currentWeek} />

        {/* Program Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease }}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all active:scale-[0.97] ${
                activeTab === tab.id
                  ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--surface-container-low))] text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container))]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Workout Cards or Nausea Protocol */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="space-y-2"
        >
          {activeTab === "nausea" ? (
            <>
              <NauseaCard onStart={() => handleStartWorkout(NAUSEA_PROTOCOL)} />
              {/* Show exercises preview */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-lg p-4 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))] mb-2">
                  Seated exercises · {NAUSEA_PROTOCOL.duration} min
                </p>
                {NAUSEA_PROTOCOL.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <span className="text-xs font-mono text-[hsl(var(--accent-gold))] w-4">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-[hsl(var(--on-surface))] flex-1">{ex.name}</span>
                    <span className="text-xs font-mono text-[hsl(var(--on-surface-variant))]">
                      {ex.sets}×{ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : filteredDays.length > 0 ? (
            filteredDays.map((day, i) => {
              const globalIndex = week.days.indexOf(day);
              return (
                <WorkoutDayCard
                  key={`${currentWeek}-${day.day}`}
                  workout={day}
                  status={getDayStatus(day, globalIndex)}
                  injectionDaysAgo={2}
                  onStart={() => handleStartWorkout(day)}
                  onLog={() => {
                    setCompletedWorkouts((prev) => new Set([...prev, `${currentWeek}-${day.day}`]));
                    toast.success(`${day.day} logged! ✅`);
                  }}
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-[hsl(var(--on-surface-variant))]">
              <p className="text-sm">No {activeTab} workouts this week.</p>
            </div>
          )}
        </motion.div>

        {/* Nausea card always visible at bottom (except on nausea tab) */}
        {activeTab !== "nausea" && (
          <NauseaCard onStart={() => handleStartWorkout(NAUSEA_PROTOCOL)} />
        )}

        {/* Locked week overlay */}
        {isWeekLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[hsl(var(--accent-gold)/0.08)] border border-[hsl(var(--accent-gold)/0.15)] rounded-lg p-5 text-center"
          >
            <span className="material-symbols-outlined text-[hsl(var(--accent-gold))] text-2xl mb-2 block">lock</span>
            <p className="font-headline font-bold text-[hsl(var(--on-surface))] mb-1">
              Week {currentWeek} is Pro only
            </p>
            <p className="text-xs text-[hsl(var(--on-surface-variant))] mb-3">
              Unlock the full 10-week progressive program.
            </p>
            <button
              onClick={() => paywall.fire("week2_unlock")}
              className="px-6 py-3 rounded-full gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-sm active:scale-[0.97] transition-transform"
            >
              Unlock Full Program
            </button>
          </motion.div>
        )}
      </div>

      <PaywallModal
        open={paywall.open}
        onClose={paywall.close}
        feature={paywall.copy.feature}
        headline={paywall.copy.headline}
        body={paywall.copy.body}
      />
      <BottomNav />
    </div>
  );
};

export default WorkoutsPage;
