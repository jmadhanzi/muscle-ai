import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const concerns = [
  { id: "arms", label: "Arms", icon: "back_hand" },
  { id: "legs", label: "Legs", icon: "directions_walk" },
  { id: "core", label: "Core / Abs", icon: "accessibility_new" },
  { id: "back", label: "Back", icon: "airline_seat_flat" },
  { id: "glutes", label: "Glutes", icon: "chair" },
  { id: "overall", label: "Overall Weakness", icon: "sentiment_dissatisfied" },
  { id: "face", label: "Ozempic Face", icon: "face" },
  { id: "fatigue", label: "Constant Fatigue", icon: "battery_1_bar" },
];

const BodyConcerns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <OnboardingLayout
      step={6}
      footer={
        <button
          onClick={() => navigate("/onboarding/summary", { state: { ...location.state, bodyConcerns: selected } })}
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
          Where do you feel it?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Select areas where you've noticed muscle loss, weakness, or concern since starting your GLP-1.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {concerns.map((concern, i) => (
          <motion.button
            key={concern.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            onClick={() => toggle(concern.id)}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all active:scale-[0.97] ${
              selected.includes(concern.id)
                ? "bg-surface-container-high border-2 border-accent-danger/60 shadow-[0_0_16px_hsla(0,100%,63%,0.1)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${
              selected.includes(concern.id) ? "text-accent-danger" : "text-on-surface-variant"
            }`}>{concern.icon}</span>
            <span className={`font-headline font-bold text-sm ${
              selected.includes(concern.id) ? "text-on-surface" : "text-on-surface-variant"
            }`}>{concern.label}</span>
          </motion.button>
        ))}
      </div>

      {selected.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm"
        >
          <span className="material-symbols-outlined material-filled text-accent-danger">emergency</span>
          <p className="text-sm leading-relaxed text-on-surface">
            Multiple concern areas detected. Your risk profile is <span className="text-accent-danger font-bold">elevated</span>. MuscleLock AI will create an aggressive preservation protocol.
          </p>
        </motion.div>
      )}
    </OnboardingLayout>
  );
};

export default BodyConcerns;
