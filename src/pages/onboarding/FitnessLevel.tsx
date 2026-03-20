import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const fitnessLevels = [
  { value: "never_exercised", label: "Never Exercised", desc: "New to working out entirely", icon: "accessibility_new" },
  { value: "beginner", label: "Beginner", desc: "Some experience, inconsistent routine", icon: "directions_walk" },
  { value: "intermediate", label: "Intermediate", desc: "Regular routine, familiar with exercises", icon: "directions_run" },
  { value: "advanced", label: "Advanced", desc: "Consistent training, strong foundation", icon: "fitness_center" },
];

const FitnessLevel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [level, setLevel] = useState<string | null>(null);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("onboarding_data").select("fitness_level, workouts_per_week").eq("user_id", user.id).single();
      if (data?.fitness_level) setLevel(data.fitness_level);
      if (data?.workouts_per_week != null) setWorkoutsPerWeek(data.workouts_per_week);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user || !level) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({
        fitness_level: level,
        workouts_per_week: workoutsPerWeek,
      }).eq("user_id", user.id);
      navigate("/onboarding/protein");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <OnboardingLayout
      step={5}
      footer={
        <button
          onClick={handleNext}
          disabled={!level || saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          What's your fitness level?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          We'll match your protocol to your experience — no judgment.
        </p>
      </section>

      <div className="space-y-3 mb-12">
        {fitnessLevels.map((fl, i) => (
          <motion.button
            key={fl.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => setLevel(fl.value)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all active:scale-[0.98] ${
              level === fl.value
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              level === fl.value ? "bg-gradient-to-br from-primary to-primary-container" : "bg-surface-container-highest"
            }`}>
              <span className={`material-symbols-outlined text-2xl ${
                level === fl.value ? "text-on-primary" : "text-on-surface-variant"
              }`}>{fl.icon}</span>
            </div>
            <div className="text-left">
              <div className={`font-headline font-bold text-lg ${
                level === fl.value ? "text-on-surface" : "text-on-surface-variant"
              }`}>{fl.label}</div>
              <div className="text-sm text-on-surface-variant">{fl.desc}</div>
            </div>
            {level === fl.value && (
              <span className="material-symbols-outlined material-filled text-primary ml-auto">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Workouts per week */}
      <div className="space-y-6">
        <span className="font-mono text-primary text-sm tracking-widest uppercase">Workouts Per Week</span>
        <div className="bg-surface-container-low rounded-lg p-8">
          <div className="flex items-center justify-center gap-12">
            <button
              onClick={() => setWorkoutsPerWeek(Math.max(0, workoutsPerWeek - 1))}
              className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl">remove</span>
            </button>
            <div className="text-center">
              <span className="font-mono text-6xl font-bold text-on-surface">{workoutsPerWeek}</span>
              <span className="block text-xs font-mono text-primary mt-2 tracking-widest">DAYS / WEEK</span>
            </div>
            <button
              onClick={() => setWorkoutsPerWeek(Math.min(7, workoutsPerWeek + 1))}
              className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
        </div>

        {workoutsPerWeek === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm"
          >
            <span className="material-symbols-outlined material-filled text-accent-danger">warning</span>
            <p className="text-sm leading-relaxed text-on-surface">
              Zero resistance training on GLP-1s means <span className="text-accent-danger font-bold">maximum muscle loss risk</span>. We'll start you with gentle protocols.
            </p>
          </motion.div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default FitnessLevel;
