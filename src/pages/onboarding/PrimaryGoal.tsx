import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const goals = [
  { value: "preserve_muscle", label: "Preserve Muscle", desc: "Protect what I have during weight loss", icon: "shield" },
  { value: "build_muscle", label: "Build Muscle", desc: "Get stronger while losing fat", icon: "fitness_center" },
  { value: "lose_fat_only", label: "Lose Fat Only", desc: "Maximize fat loss, zero muscle loss", icon: "local_fire_department" },
  { value: "all_above", label: "All of the Above", desc: "I want the full protocol", icon: "stars" },
];

const PrimaryGoal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("onboarding_data").select("primary_goal").eq("user_id", user.id).single();
      if (data?.primary_goal) setSelected(data.primary_goal);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user || !selected) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({
        primary_goal: selected,
        biggest_fear: biggestFear.trim().slice(0, 100),
      }).eq("user_id", user.id);
      navigate("/onboarding/summary");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <OnboardingLayout
      step={7}
      footer={
        <button
          onClick={handleNext}
          disabled={!selected || saving}
          className="w-full py-5 rounded-full gradient-hero text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.3)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving..." : "See my risk profile"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          What's your primary goal?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          This determines the focus of your entire MuscleLock protocol.
        </p>
      </section>

      <div className="space-y-3 mb-12">
        {goals.map((goal, i) => (
          <motion.button
            key={goal.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => setSelected(goal.value)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all active:scale-[0.98] ${
              selected === goal.value
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              selected === goal.value ? "bg-gradient-to-br from-primary to-primary-container" : "bg-surface-container-highest"
            }`}>
              <span className={`material-symbols-outlined text-2xl ${
                selected === goal.value ? "text-on-primary" : "text-on-surface-variant"
              }`}>{goal.icon}</span>
            </div>
            <div className="text-left">
              <div className={`font-headline font-bold text-lg ${
                selected === goal.value ? "text-on-surface" : "text-on-surface-variant"
              }`}>{goal.label}</div>
              <div className="text-sm text-on-surface-variant">{goal.desc}</div>
            </div>
            {selected === goal.value && (
              <span className="material-symbols-outlined material-filled text-primary ml-auto">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Biggest Fear */}
      <div className="space-y-4">
        <span className="font-mono text-primary text-sm tracking-widest uppercase">One More Thing</span>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-3 px-1">
            What's your biggest fear about losing muscle on GLP-1s?
          </label>
          <textarea
            className="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-5 text-base font-body text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-surface-variant transition-all outline-none resize-none"
            rows={3}
            maxLength={100}
            placeholder="e.g. Looking skinny-fat, losing my strength, saggy skin..."
            value={biggestFear}
            onChange={(e) => setBiggestFear(e.target.value)}
          />
          <p className="text-right text-xs text-on-surface-variant mt-1 font-mono">
            {biggestFear.length}/100
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default PrimaryGoal;
