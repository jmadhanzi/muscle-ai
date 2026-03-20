import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";
import { CountUp, AnimatedProgress, AhaFlash } from "@/components/motion/Animated";

const OnboardingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showAha, setShowAha] = useState(false);

  const state = location.state || {};

  // Calculate risk score (simple heuristic)
  const riskFactors = [
    state.activityLevel === "sedentary" ? 25 : state.activityLevel === "light" ? 15 : 5,
    (state.bodyConcerns?.length || 0) * 5,
    state.fitnessGoals?.length > 3 ? 10 : 0,
  ];
  const riskScore = Math.min(95, 40 + riskFactors.reduce((a: number, b: number) => a + b, 0));

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({
        height_cm: state.heightCm,
        weight_kg: state.weightKg,
        activity_level: state.activityLevel,
        fitness_goals: state.fitnessGoals,
        body_concerns: state.bodyConcerns,
        onboarding_completed: true,
      }).eq("user_id", user.id);

      setShowAha(true);
      setTimeout(() => {
        toast.success("Your MuscleLock protocol is ready!");
        navigate("/dashboard");
      }, 1200);
    } catch {
      toast.error("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      step={7}
      footer={
        <button
          onClick={handleComplete}
          disabled={saving}
          className="w-full py-5 rounded-full gradient-hero text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.3)] active:scale-95 transition-transform duration-200 disabled:opacity-50"
        >
          {saving ? "Building your protocol..." : "Activate MuscleLock"}
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          Your muscle risk profile.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Based on your data, here's what we found.
        </p>
      </section>

      {/* Risk Score */}
      <AhaFlash trigger={showAha}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-container-lowest rounded-lg p-8 border-2 border-accent-danger/20 mb-8"
        >
          <div className="text-center space-y-4">
            <span className="font-mono text-xs tracking-widest uppercase text-on-surface-variant">Muscle Loss Risk Score</span>
            <div className="font-headline font-black text-7xl text-accent-danger">
              <CountUp end={riskScore} suffix="%" />
            </div>
            <AnimatedProgress
              value={riskScore}
              barClassName="gradient-danger"
            />
            <p className="text-on-surface-variant text-sm">
              {riskScore >= 70 ? "High risk — immediate intervention recommended" :
               riskScore >= 50 ? "Moderate risk — protocol adjustments needed" :
               "Lower risk — prevention protocol recommended"}
            </p>
          </div>
        </motion.div>
      </AhaFlash>

      {/* Summary Cards */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Body Metrics</div>
            <div className="text-on-surface font-headline font-bold mt-1">
              {state.heightCm || "—"}cm / {state.weightKg || "—"}kg
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary">straighten</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Activity Level</div>
            <div className="text-on-surface font-headline font-bold mt-1 capitalize">
              {state.activityLevel?.replace("_", " ") || "—"}
            </div>
          </div>
          <span className="material-symbols-outlined text-primary">directions_run</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Goals</div>
            <div className="text-on-surface font-headline font-bold mt-1">
              {state.fitnessGoals?.length || 0} selected
            </div>
          </div>
          <span className="material-symbols-outlined text-accent-gold">flag</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Concern Areas</div>
            <div className="text-accent-danger font-headline font-bold mt-1">
              {state.bodyConcerns?.length || 0} flagged
            </div>
          </div>
          <span className="material-symbols-outlined text-accent-danger">emergency</span>
        </motion.div>
      </div>

      <div className="h-8" />
    </OnboardingLayout>
  );
};

export default OnboardingSummary;
