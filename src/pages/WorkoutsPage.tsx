import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { Lock, Dumbbell } from "lucide-react";

const WORKOUT_CATEGORIES = [
  { id: "upper", label: "Upper Body", icon: "fitness_center", exercises: 4, duration: "35 min", free: true },
  { id: "lower", label: "Lower Body", icon: "directions_walk", exercises: 5, duration: "40 min", free: true },
  { id: "compound", label: "Compound Lifts", icon: "exercise", exercises: 3, duration: "30 min", free: false },
  { id: "resistance", label: "Resistance Bands", icon: "nest_heat_link_gen_3", exercises: 6, duration: "25 min", free: false },
  { id: "recovery", label: "Active Recovery", icon: "self_improvement", exercises: 4, duration: "20 min", free: false },
];

const TODAYS_WORKOUT = [
  { name: "Goblet Squat", sets: "3×12", muscle: "Quads, Glutes" },
  { name: "Dumbbell Row", sets: "3×10", muscle: "Back, Biceps" },
  { name: "Push-up", sets: "3×15", muscle: "Chest, Triceps" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">Workouts</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Muscle-preserving resistance training</p>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Today's Quick Workout (Free) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-lg text-on-surface">Today's Workout</h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Free</span>
          </div>
          <div className="bg-surface-container-lowest rounded-lg border border-primary/10 overflow-hidden">
            {TODAYS_WORKOUT.map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease }}
                className={`flex items-center gap-4 p-4 ${i < TODAYS_WORKOUT.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">{ex.name}</p>
                  <p className="text-xs text-on-surface-variant">{ex.muscle}</p>
                </div>
                <span className="text-xs font-mono text-primary font-bold">{ex.sets}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Workout Categories */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
        >
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Programs</h2>
          <div className="space-y-2">
            {WORKOUT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease }}
                onClick={() => !cat.free && setPaywallOpen(true)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg text-left active:scale-[0.97] transition-all duration-200 ${
                  cat.free ? "bg-surface-container-low hover:bg-surface-container" : "bg-surface-container-low/50 opacity-60"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cat.free ? "bg-surface-container-high" : "bg-surface-variant"}`}>
                  {cat.free ? (
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">{cat.icon}</span>
                  ) : (
                    <Lock className="w-4 h-4 text-on-surface-variant" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">{cat.label}</p>
                  <p className="text-xs text-on-surface-variant">{cat.exercises} exercises · {cat.duration}</p>
                </div>
                {!cat.free && (
                  <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full">Pro</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} feature="Custom Workouts" />
      <BottomNav />
    </div>
  );
};

export default WorkoutsPage;
