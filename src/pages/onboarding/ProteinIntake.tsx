import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion, AnimatePresence } from "framer-motion";

const intakeLevels = [
  { value: "less_than_50", label: "Under 50g/day", desc: "Critical deficit", color: "text-accent-danger", bgFill: "bg-accent-danger", gaugePercent: 8, icon: "🔴" },
  { value: "50_to_100", label: "50–100g/day", desc: "Below target", color: "text-[hsl(25,95%,53%)]", bgFill: "bg-[hsl(25,95%,53%)]", gaugePercent: 30, icon: "🟠" },
  { value: "100_to_150", label: "100–150g/day", desc: "Getting there", color: "text-accent-gold", bgFill: "bg-accent-gold", gaugePercent: 72, icon: "🟡" },
  { value: "over_150", label: "Over 150g", desc: "Optimal zone", color: "text-primary", bgFill: "bg-primary", gaugePercent: 100, icon: "🟢" },
];

const ProteinIntake = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [goalWeightLbs, setGoalWeightLbs] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("protein_intake, goal_weight, weight_unit, first_name")
        .eq("user_id", user.id)
        .single();
      if (data?.protein_intake) setSelected(data.protein_intake);
      if (data?.goal_weight) {
        const gw = Number(data.goal_weight);
        setGoalWeightLbs(data.weight_unit === "kg" ? Math.round(gw * 2.205) : gw);
      }
      if (data?.first_name) setFirstName(data.first_name);
    };
    load();
  }, [user]);

  const proteinTarget = goalWeightLbs ? Math.round(goalWeightLbs * 0.7) : null;
  const selectedLevel = intakeLevels.find((l) => l.value === selected);

  const handleNext = async () => {
    if (!user || !selected) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({ protein_intake: selected }).eq("user_id", user.id);
      navigate("/onboarding/goals");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <OnboardingLayout
      step={6}
      footer={
        <button
          onClick={handleNext}
          disabled={!selected || saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      {/* Headline */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.05] tracking-tight mb-4">
          The #1 muscle protection tool is protein. How much are you getting?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Be honest{firstName ? `, ${firstName}` : ""} — we'll build your plan around reality, not wishful thinking.
        </p>
      </motion.section>

      {/* Fuel Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="relative w-full h-5 rounded-full bg-surface-container-highest overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${selectedLevel?.bgFill ?? "bg-surface-variant"}`}
            initial={{ width: "0%" }}
            animate={{ width: selectedLevel ? `${selectedLevel.gaugePercent}%` : "0%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* gauge markers */}
          {[25, 50, 75].map((p) => (
            <div key={p} className="absolute top-0 h-full w-px bg-surface-variant/50" style={{ left: `${p}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50">
          <span>Empty</span>
          <span>Optimal</span>
        </div>
      </motion.div>

      {/* Option Cards */}
      <div className="space-y-3">
        {intakeLevels.map((level, i) => (
          <motion.button
            key={level.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelected(level.value)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
              selected === level.value
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <span className="text-3xl shrink-0">{level.icon}</span>
            <div className="text-left flex-1">
              <span className={`font-headline font-bold text-lg ${
                selected === level.value ? "text-on-surface" : "text-on-surface-variant"
              }`}>{level.label}</span>
              <div className={`text-sm font-semibold ${level.color}`}>{level.desc}</div>
            </div>
            {selected === level.value && (
              <span className="material-symbols-outlined material-filled text-primary ml-auto shrink-0">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Personal Protein Target */}
      <AnimatePresence>
        {selected && proteinTarget && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 p-6 rounded-2xl bg-surface-container-high border border-primary/20 shadow-[0_0_30px_hsla(160,100%,45%,0.08)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined material-filled text-primary text-2xl">target</span>
              <span className="font-headline font-bold text-on-surface text-lg">Your MuscleLock Protein Target</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono font-bold text-5xl text-primary">{proteinTarget}g</span>
              <span className="text-on-surface-variant text-sm">/day minimum</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Based on your goal weight ({goalWeightLbs} lbs) × 0.7g per lb — the clinical minimum for muscle preservation on GLP-1 therapy.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low protein warning */}
      <AnimatePresence>
        {(selected === "less_than_50" || selected === "50_to_100") && proteinTarget && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger"
          >
            <span className="material-symbols-outlined material-filled text-accent-danger shrink-0">warning</span>
            <div>
              <p className="text-sm font-semibold text-accent-danger mb-1">
                You're {selected === "less_than_50" ? `${proteinTarget - 50}+g` : `up to ${proteinTarget - 50}g`} below your target
              </p>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Most GLP-1 users eat less protein because appetite is suppressed. That's exactly when you need <span className="text-primary font-bold">MORE</span> protein, not less. Your protocol will include specific meal targets.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgency seed */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8 text-sm text-on-surface-variant/70 leading-relaxed text-center italic"
      >
        "Appetite suppression is a feature of GLP-1s — but protein sacrifice doesn't have to be."
      </motion.p>
    </OnboardingLayout>
  );
};

export default ProteinIntake;
