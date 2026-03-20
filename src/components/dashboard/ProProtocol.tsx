import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ProProtocolProps {
  proteinTarget: number;
}

const WORKOUT = [
  { name: "Barbell Squat", sets: "4×8", muscle: "Quads, Glutes" },
  { name: "Romanian Deadlift", sets: "3×10", muscle: "Hamstrings, Back" },
  { name: "Incline DB Press", sets: "3×10", muscle: "Chest, Shoulders" },
  { name: "Cable Row", sets: "3×12", muscle: "Back, Biceps" },
  { name: "Lateral Raise", sets: "3×15", muscle: "Shoulders" },
  { name: "Plank Hold", sets: "3×45s", muscle: "Core" },
];

const MEALS = [
  { time: "7:30 AM", name: "Greek yogurt bowl with berries & whey", cal: 380, protein: 42 },
  { time: "12:00 PM", name: "Grilled chicken, quinoa, spinach", cal: 520, protein: 48 },
  { time: "3:30 PM", name: "Protein shake, banana, almond butter", cal: 310, protein: 35 },
  { time: "7:00 PM", name: "Salmon, sweet potato, broccoli", cal: 580, protein: 44 },
];

const AI_TIP = "Based on your protein intake pattern, try having a casein shake before bed — slow-release protein supports overnight muscle protein synthesis, especially important during GLP-1 weight loss.";

const ease = [0.16, 1, 0.3, 1] as const;

const ProProtocol = ({ proteinTarget }: ProProtocolProps) => {
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const totalMealProtein = MEALS.reduce((sum, m) => sum + m.protein, 0);

  return (
    <div className="space-y-3">
      {/* Full Workout — Expandable */}
      <div className="bg-surface-container-lowest rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setWorkoutOpen(!workoutOpen)}
          className="w-full flex items-center justify-between px-5 py-4 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">fitness_center</span>
            <div className="text-left">
              <p className="font-headline font-semibold text-sm text-on-surface">Today's Full Workout</p>
              <p className="text-[10px] text-on-surface-variant font-mono">{WORKOUT.length} exercises · ~45 min</p>
            </div>
          </div>
          <motion.div animate={{ rotate: workoutOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </motion.div>
        </button>

        <AnimatePresence>
          {workoutOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-1">
                {WORKOUT.map((ex, i) => (
                  <motion.div
                    key={ex.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <span className="text-on-surface">{ex.name}</span>
                      <span className="text-on-surface-variant text-xs ml-2">{ex.muscle}</span>
                    </div>
                    <span className="font-mono text-xs text-primary font-bold">{ex.sets}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Meal Recommendations */}
      <div className="bg-surface-container-lowest rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
            <span className="font-headline font-semibold text-sm text-on-surface">Today's Meals</span>
          </div>
          <span className="text-[10px] font-mono text-primary">{totalMealProtein}g protein</span>
        </div>
        <div className="space-y-2">
          {MEALS.map((meal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
              className="flex items-center gap-3 text-sm"
            >
              <span className="text-[10px] font-mono text-on-surface-variant w-14 shrink-0">{meal.time}</span>
              <span className="text-on-surface flex-1 truncate">{meal.name}</span>
              <span className="font-mono text-xs text-primary shrink-0">{meal.protein}g</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Tip of the Day */}
      <div className="bg-surface-container-lowest rounded-lg border border-primary/15 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-on-primary text-sm">psychology</span>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1.5">AI Tip of the Day</p>
            <p className="text-sm text-on-surface leading-relaxed">{AI_TIP}</p>
          </div>
        </div>
      </div>

      {/* Hydration Reminder */}
      <div className="bg-secondary/8 rounded-lg border border-secondary/15 p-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary text-xl">water_drop</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-on-surface">Hydration Check</p>
          <p className="text-xs text-on-surface-variant">GLP-1 increases dehydration risk. Aim for 8+ cups today.</p>
        </div>
        <span className="font-mono text-sm font-bold text-secondary">4/8</span>
      </div>
    </div>
  );
};

export default ProProtocol;
