import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const intakeLevels = [
  { value: "less_than_50", label: "Less than 50g", desc: "Minimal protein intake", risk: "Critical", riskColor: "text-accent-danger", icon: "trending_down" },
  { value: "50_to_100", label: "50–100g", desc: "Below recommended for muscle preservation", risk: "High", riskColor: "text-accent-danger", icon: "arrow_downward" },
  { value: "100_to_150", label: "100–150g", desc: "Approaching optimal range", risk: "Moderate", riskColor: "text-accent-gold", icon: "arrow_upward" },
  { value: "over_150", label: "Over 150g", desc: "Strong protein foundation", risk: "Low", riskColor: "text-primary", icon: "trending_up" },
];

const ProteinIntake = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("onboarding_data").select("protein_intake").eq("user_id", user.id).single();
      if (data?.protein_intake) setSelected(data.protein_intake);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user || !selected) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({ protein_intake: selected }).eq("user_id", user.id);
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
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          How much protein do you eat daily?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Protein is the #1 lever for muscle preservation. Be honest — we're not judging.
        </p>
      </section>

      <div className="space-y-3">
        {intakeLevels.map((level, i) => (
          <motion.button
            key={level.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => setSelected(level.value)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all active:scale-[0.98] ${
              selected === level.value
                ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              selected === level.value ? "bg-gradient-to-br from-primary to-primary-container" : "bg-surface-container-highest"
            }`}>
              <span className={`material-symbols-outlined text-2xl ${
                selected === level.value ? "text-on-primary" : "text-on-surface-variant"
              }`}>{level.icon}</span>
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-headline font-bold text-lg ${
                  selected === level.value ? "text-on-surface" : "text-on-surface-variant"
                }`}>{level.label}</span>
                <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${level.riskColor} bg-current/10`}
                  style={{ backgroundColor: undefined }}
                >
                  <span className={level.riskColor}>{level.risk} risk</span>
                </span>
              </div>
              <div className="text-sm text-on-surface-variant">{level.desc}</div>
            </div>
            {selected === level.value && (
              <span className="material-symbols-outlined material-filled text-primary ml-auto shrink-0">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>

      {(selected === "less_than_50" || selected === "50_to_100") && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm"
        >
          <span className="material-symbols-outlined material-filled text-accent-danger">science</span>
          <p className="text-sm leading-relaxed text-on-surface">
            Research shows GLP-1 patients need{" "}
            <span className="text-primary font-bold">1.2–1.6g protein per kg</span> of body weight to minimize muscle loss.
            Your protocol will include specific meal targets.
          </p>
        </motion.div>
      )}
    </OnboardingLayout>
  );
};

export default ProteinIntake;
