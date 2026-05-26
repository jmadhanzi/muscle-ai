import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Pause, Play } from "lucide-react";
import type { WorkoutDay } from "@/data/workoutProgram";
import { GLP1_REST_TIPS } from "@/data/workoutProgram";

const ease = [0.16, 1, 0.3, 1] as const;

interface WorkoutExecutionProps {
  workout: WorkoutDay;
  onComplete: (log: ExerciseLog[]) => void;
  onExit: () => void;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: { reps: number; weight: number }[];
}

const WorkoutExecution = ({ workout, onComplete, onExit }: WorkoutExecutionProps) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [paused, setPaused] = useState(false);
  const [log, setLog] = useState<ExerciseLog[]>(
    workout.exercises.map((e) => ({
      exerciseName: e.name,
      sets: Array.from({ length: e.sets }, () => ({ reps: 0, weight: 0 })),
    }))
  );
  const [weight, setWeight] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  const exercise = workout.exercises[exerciseIndex];
  const totalExercises = workout.exercises.length;
  const totalSets = exercise?.sets ?? 0;

  // Rest timer
  useEffect(() => {
    if (!isResting || paused) return;
    if (restTimer <= 0) {
      setIsResting(false);
      return;
    }
    const t = setTimeout(() => setRestTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [restTimer, isResting, paused]);

  const completeSet = useCallback(() => {
    // Log the set
    setLog((prev) => {
      const updated = [...prev];
      const repsNum = parseInt(exercise.reps) || 0;
      updated[exerciseIndex].sets[setIndex] = {
        reps: repsNum,
        weight: parseFloat(weight) || 0,
      };
      return updated;
    });
    setWeight("");

    if (setIndex < totalSets - 1) {
      setSetIndex((s) => s + 1);
      setIsResting(true);
      setRestTimer(90);
      setTipIndex((i) => (i + 1) % GLP1_REST_TIPS.length);
    } else if (exerciseIndex < totalExercises - 1) {
      setExerciseIndex((e) => e + 1);
      setSetIndex(0);
      setIsResting(true);
      setRestTimer(90);
      setTipIndex((i) => (i + 1) % GLP1_REST_TIPS.length);
    } else {
      onComplete(log);
    }
  }, [exercise, exerciseIndex, setIndex, totalSets, totalExercises, weight, log, onComplete]);

  if (!exercise) return null;

  const progress = ((exerciseIndex * totalSets + setIndex) / (totalExercises * totalSets)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[hsl(var(--surface))] flex flex-col"
    >
      {/* Top bar */}
      <div className="shrink-0 px-4 pt-[var(--header-top)] pb-3 flex items-center justify-between">
        <button
          onClick={onExit}
          className="p-2 rounded-lg hover:bg-[hsl(var(--surface-container))] transition-colors active:scale-95"
        >
          <X className="w-5 h-5 text-[hsl(var(--on-surface-variant))]" />
        </button>
        <span className="text-xs font-mono text-[hsl(var(--on-surface-variant))]">
          Exercise {exerciseIndex + 1} of {totalExercises}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-1 rounded-full bg-[hsl(var(--surface-container-high))]">
          <motion.div
            className="h-full rounded-full gradient-hero"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
              className="flex flex-col items-center"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))] mb-4">
                Rest Period
              </p>
              <div className="w-32 h-32 rounded-full border-4 border-[hsl(var(--primary)/0.3)] flex items-center justify-center mb-6 relative">
                <span className="text-4xl font-mono font-bold text-[hsl(var(--primary))]">
                  {restTimer}
                </span>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64" cy="64" r="60"
                    fill="none"
                    stroke="hsl(160 100% 45%)"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - restTimer / 90)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>

              <button
                onClick={() => setPaused(!paused)}
                className="p-3 rounded-full bg-[hsl(var(--surface-container))] mb-6 active:scale-95 transition-transform"
              >
                {paused ? <Play className="w-5 h-5 text-[hsl(var(--primary))]" /> : <Pause className="w-5 h-5 text-[hsl(var(--on-surface-variant))]" />}
              </button>

              {/* GLP-1 Tip */}
              <div className="max-w-xs bg-[hsl(var(--accent-purple)/0.08)] border border-[hsl(var(--accent-purple)/0.15)] rounded-lg p-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[hsl(var(--accent-purple))] mb-1">
                  GLP-1 Tip
                </p>
                <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed">
                  {GLP1_REST_TIPS[tipIndex]}
                </p>
              </div>

              <button
                onClick={() => { setIsResting(false); setRestTimer(0); }}
                className="mt-4 text-xs font-mono text-[hsl(var(--primary))] hover:underline"
              >
                Skip rest →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`exercise-${exerciseIndex}-${setIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease }}
              className="flex flex-col items-center w-full max-w-sm"
            >
              <span className="text-4xl mb-4">💪</span>
              <h2 className="font-headline font-bold text-2xl text-[hsl(var(--on-surface))] mb-1">
                {exercise.name}
              </h2>
              <p className="text-xs text-[hsl(var(--on-surface-variant))] mb-1">{exercise.muscleGroup}</p>
              <p className="text-lg font-mono font-bold text-[hsl(var(--primary))] mb-8">
                Set {setIndex + 1} of {totalSets} · {exercise.reps} reps
              </p>

              {/* Weight input */}
              <div className="w-full mb-6">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))] mb-1.5 block">
                  Weight used (optional)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface))] text-center text-2xl font-mono font-bold rounded-xl p-3 outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] placeholder:text-[hsl(var(--on-surface-variant)/0.3)]"
                />
                <p className="text-[10px] text-[hsl(var(--on-surface-variant)/0.5)] text-center mt-1">lbs</p>
              </div>

              <button
                onClick={completeSet}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-base active:scale-[0.97] transition-transform"
              >
                {exerciseIndex === totalExercises - 1 && setIndex === totalSets - 1 ? "Complete Workout" : "Done — Next"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WorkoutExecution;
