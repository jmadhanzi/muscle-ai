import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";

const concerns = [
  { value: "very_concerned", label: "Very Concerned", desc: "I've already noticed muscle loss or weakness", icon: "emergency", color: "text-accent-danger" },
  { value: "somewhat", label: "Somewhat Concerned", desc: "I'm worried but haven't noticed much yet", icon: "warning", color: "text-accent-gold" },
  { value: "not_sure", label: "Not Sure", desc: "I don't know what to look for", icon: "help", color: "text-secondary" },
  { value: "not_concerned", label: "Not Concerned", desc: "I feel fine, just want to be proactive", icon: "check_circle", color: "text-primary" },
];

const MuscleConcern = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("profiles").select("muscle_concern").eq("user_id", user.id).single();
      if (data?.muscle_concern) setSelected(data.muscle_concern);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user || !selected) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({ muscle_concern: selected }).eq("user_id", user.id);
      navigate("/onboarding/fitness-level");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <OnboardingLayout
      step={4}
      footer={
        <button onClick={handleNext} disabled={!selected || saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">How concerned are you about muscle loss?</h1>
        <p className="text-on-surface-variant text-lg max-w-md">Be honest — this helps us calibrate the intensity of your protocol.</p>
      </section>

      <div className="space-y-3">
        {concerns.map((c, i) => (
          <motion.button key={c.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => setSelected(c.value)}
            className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all active:scale-[0.98] ${
              selected === c.value ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_hsla(160,100%,45%,0.15)]" : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${selected === c.value ? "bg-gradient-to-br from-primary to-primary-container" : "bg-surface-container-highest"}`}>
              <span className={`material-symbols-outlined text-2xl ${selected === c.value ? "text-on-primary" : c.color}`}>{c.icon}</span>
            </div>
            <div className="text-left">
              <div className={`font-headline font-bold text-lg ${selected === c.value ? "text-on-surface" : "text-on-surface-variant"}`}>{c.label}</div>
              <div className="text-sm text-on-surface-variant">{c.desc}</div>
            </div>
            {selected === c.value && <span className="material-symbols-outlined material-filled text-primary ml-auto">check_circle</span>}
          </motion.button>
        ))}
      </div>

      {selected === "very_concerned" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm"
        >
          <span className="material-symbols-outlined material-filled text-accent-danger">priority_high</span>
          <p className="text-sm leading-relaxed text-on-surface">
            You're not imagining it. GLP-1 muscle loss is real and measurable. Your protocol will include{" "}
            <span className="text-accent-danger font-bold">aggressive prevention strategies</span>.
          </p>
        </motion.div>
      )}
    </OnboardingLayout>
  );
};

export default MuscleConcern;
