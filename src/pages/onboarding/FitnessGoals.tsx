import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const goals = [
  { id: "preserve_muscle", label: "Preserve Muscle", icon: "shield", desc: "Protect lean mass during weight loss" },
  { id: "build_strength", label: "Build Strength", icon: "fitness_center", desc: "Get stronger while losing fat" },
  { id: "body_composition", label: "Better Body Comp", icon: "monitoring", desc: "Lower body fat %, increase muscle %" },
  { id: "energy", label: "More Energy", icon: "bolt", desc: "Fight GLP-1 fatigue and weakness" },
  { id: "metabolism", label: "Boost Metabolism", icon: "local_fire_department", desc: "Prevent metabolic slowdown" },
  { id: "longevity", label: "Longevity", icon: "favorite", desc: "Maintain muscle for long-term health" },
];

const FitnessGoals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <OnboardingLayout
      step={5}
      footer={
        <button
          onClick={() => navigate("/onboarding/concerns", { state: { ...location.state, fitnessGoals: selected } })}
          disabled={selected.length === 0}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          Next step
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          What are your goals?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Select all that apply. We'll tailor your muscle protection protocol accordingly.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal, i) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            onClick={() => toggle(goal.id)}
            className={`relative flex flex-col items-center text-center p-5 rounded-xl transition-all active:scale-[0.97] ${
              selected.includes(goal.id)
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_16px_hsla(160,100%,45%,0.12)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            {selected.includes(goal.id) && (
              <span className="absolute top-2 right-2 material-symbols-outlined material-filled text-primary text-sm">check_circle</span>
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              selected.includes(goal.id)
                ? "bg-gradient-to-br from-primary to-primary-container"
                : "bg-surface-container-highest"
            }`}>
              <span className={`material-symbols-outlined ${
                selected.includes(goal.id) ? "text-on-primary" : "text-on-surface-variant"
              }`}>{goal.icon}</span>
            </div>
            <div className={`font-headline font-bold text-sm mb-1 ${
              selected.includes(goal.id) ? "text-on-surface" : "text-on-surface-variant"
            }`}>{goal.label}</div>
            <div className="text-[11px] text-on-surface-variant leading-tight">{goal.desc}</div>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-on-surface-variant text-xs mt-6 font-mono uppercase tracking-widest">
        {selected.length} selected
      </p>
    </OnboardingLayout>
  );
};

export default FitnessGoals;
