import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";
import { CountUp, AnimatedProgress, AhaFlash } from "@/components/motion/Animated";

const OnboardingSummary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showAha, setShowAha] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasReferral = Boolean(data?.referred_by || localStorage.getItem("pending_referral_code"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (profile) setData({ ...profile, firstName: profile.first_name });
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading || !data) return null;

  // Risk score calculation based on new fields
  const riskFactors = [
    data.muscle_concern === "very_concerned" ? 20 : data.muscle_concern === "somewhat" ? 12 : data.muscle_concern === "not_sure" ? 8 : 3,
    data.fitness_level === "never_exercised" ? 25 : data.fitness_level === "beginner" ? 15 : data.fitness_level === "intermediate" ? 5 : 0,
    (data.workouts_per_week || 0) === 0 ? 15 : (data.workouts_per_week || 0) <= 2 ? 8 : 0,
    data.protein_intake === "less_than_50" ? 20 : data.protein_intake === "50_to_100" ? 12 : data.protein_intake === "100_to_150" ? 5 : 0,
    (data.weeks_on_medication || 0) > 8 ? 10 : (data.weeks_on_medication || 0) > 4 ? 5 : 0,
  ];
  const riskScore = Math.min(95, 20 + riskFactors.reduce((a: number, b: number) => a + b, 0));

  const weightLoss = data.current_weight && data.goal_weight ? Math.max(0, Number(data.current_weight) - Number(data.goal_weight)) : 0;
  const muscleLossRisk = Math.round(weightLoss * 0.4 * 10) / 10;
  const unit = data.weight_unit || "lbs";
  // FIX: DB stores weight in the user's chosen unit.
  // When unit="lbs", values are already in lbs — no conversion needed.
  // When unit="kg", convert to lbs for display only if we want lbs, or show raw kg.
  // We display in the user's chosen unit, so no conversion at all.
  const displayWeight = Math.round(Number(data.current_weight || 0));
  const displayGoal = Math.round(Number(data.goal_weight || 0));
  const displayMuscleRisk = Math.round(muscleLossRisk * 10) / 10;

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({
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

  const goalLabel: Record<string, string> = {
    preserve_muscle: "Preserve Muscle",
    build_muscle: "Build Muscle",
    lose_fat_only: "Lose Fat Only",
    all_above: "Full Protocol",
  };

  const fitnessLabel: Record<string, string> = {
    never_exercised: "Never Exercised",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const proteinLabel: Record<string, string> = {
    less_than_50: "< 50g",
    "50_to_100": "50–100g",
    "100_to_150": "100–150g",
    over_150: "150g+",
  };

  return (
    <OnboardingLayout
      step={7}
      totalSteps={7}
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
      {hasReferral && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-primary text-2xl mt-0.5">card_giftcard</span>
          <div>
            <p className="font-headline font-bold text-sm text-primary">7-Day Pro Trial Activated!</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Your friend hooked you up. Full workouts, unlimited AI coach, and advanced tracking — free for 7 days.
            </p>
          </div>
        </motion.div>
      )}

      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          {data.firstName ? `${data.firstName}, here's` : "Here's"} your risk profile.
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
            <AnimatedProgress value={riskScore} barClassName="gradient-danger" />
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
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Weight Journey</div>
            <div className="text-on-surface font-headline font-bold mt-1">
              {displayWeight} → {displayGoal} {unit}
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary">monitor_weight</span>
        </motion.div>

        {muscleLossRisk > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center border border-accent-danger/10"
          >
            <div>
              <div className="text-xs font-mono text-accent-danger uppercase tracking-widest">Muscle at Risk</div>
              <div className="text-accent-danger font-headline font-bold mt-1">
                Up to {displayMuscleRisk} {unit} of muscle
              </div>
            </div>
            <span className="material-symbols-outlined text-accent-danger">warning</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Fitness Level</div>
            <div className="text-on-surface font-headline font-bold mt-1">
              {fitnessLabel[data.fitness_level] || "—"} · {data.workouts_per_week || 0}×/week
            </div>
          </div>
          <span className="material-symbols-outlined text-primary">fitness_center</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Daily Protein</div>
            <div className={`font-headline font-bold mt-1 ${
              data.protein_intake === "less_than_50" || data.protein_intake === "50_to_100" ? "text-accent-danger" : "text-on-surface"
            }`}>
              {proteinLabel[data.protein_intake] || "—"}
            </div>
          </div>
          <span className="material-symbols-outlined text-accent-gold">egg_alt</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center"
        >
          <div>
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Primary Goal</div>
            <div className="text-on-surface font-headline font-bold mt-1">
              {goalLabel[data.primary_goal] || "—"}
            </div>
          </div>
          <span className="material-symbols-outlined text-primary">flag</span>
        </motion.div>

        {data.biggest_fear && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-surface-container-low rounded-xl p-5"
          >
            <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">Your Biggest Fear</div>
            <p className="text-on-surface text-sm italic">"{data.biggest_fear}"</p>
          </motion.div>
        )}
      </div>

      <div className="h-8" />
    </OnboardingLayout>
  );
};

export default OnboardingSummary;
