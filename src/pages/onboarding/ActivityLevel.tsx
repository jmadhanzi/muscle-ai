import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const levels = [
  { id: "sedentary", label: "Sedentary", desc: "Little to no exercise, desk job", icon: "weekend" },
  { id: "light", label: "Lightly Active", desc: "Light exercise 1–3 days/week", icon: "directions_walk" },
  { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3–5 days/week", icon: "directions_run" },
  { id: "very_active", label: "Very Active", desc: "Hard exercise 6–7 days/week", icon: "fitness_center" },
];

const ActivityLevel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      step={4}
      footer={
        <button
          onClick={() => navigate("/onboarding/goals", { state: { ...location.state, activityLevel: selected } })}
          disabled={!selected}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          Next step
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          How active are you?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Your activity level directly impacts how much muscle you're at risk of losing.
        </p>
      </section>

      <div className="space-y-3">
        {levels.map((level, i) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => setSelected(level.id)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all active:scale-[0.98] ${
              selected === level.id
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              selected === level.id
                ? "bg-gradient-to-br from-primary to-primary-container"
                : "bg-surface-container-highest"
            }`}>
              <span className={`material-symbols-outlined text-2xl ${
                selected === level.id ? "text-on-primary" : "text-on-surface-variant"
              }`}>{level.icon}</span>
            </div>
            <div className="text-left">
              <div className={`font-headline font-bold text-lg ${
                selected === level.id ? "text-on-surface" : "text-on-surface-variant"
              }`}>{level.label}</div>
              <div className="text-sm text-on-surface-variant">{level.desc}</div>
            </div>
            {selected === level.id && (
              <span className="material-symbols-outlined material-filled text-primary ml-auto">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>

      {selected === "sedentary" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm"
        >
          <span className="material-symbols-outlined material-filled text-accent-danger">warning</span>
          <p className="text-sm leading-relaxed text-on-surface">
            Sedentary individuals on GLP-1s are at <span className="text-accent-danger font-bold">highest risk</span> for muscle atrophy. Your protocol will include daily micro-movements.
          </p>
        </motion.div>
      )}
    </OnboardingLayout>
  );
};

export default ActivityLevel;
