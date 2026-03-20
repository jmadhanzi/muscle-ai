import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";

const WeightGoals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [currentWeight, setCurrentWeight] = useState(185);
  const [goalWeight, setGoalWeight] = useState(155);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("onboarding_data")
        .select("weight_kg, goal_weight, weight_unit")
        .eq("user_id", user.id)
        .single();
      if (data?.weight_unit) setUnit(data.weight_unit as "lbs" | "kg");
      if (data?.weight_kg) {
        const u = data.weight_unit || "lbs";
        setCurrentWeight(u === "kg" ? Number(data.weight_kg) : Math.round(Number(data.weight_kg) * 2.205));
      }
      if (data?.goal_weight) {
        const u = data.weight_unit || "lbs";
        setGoalWeight(u === "kg" ? Number(data.goal_weight) : Math.round(Number(data.goal_weight) * 2.205));
      }
    };
    load();
  }, [user]);

  const toKg = (val: number) => (unit === "kg" ? val : Math.round(val / 2.205 * 10) / 10);
  const toLoss = () => {
    const diff = currentWeight - goalWeight;
    return diff > 0 ? diff : 0;
  };

  const handleNext = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({
        weight_kg: toKg(currentWeight),
        goal_weight: toKg(goalWeight),
        weight_unit: unit,
      }).eq("user_id", user.id);
      navigate("/onboarding/muscle-concern");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const switchUnit = () => {
    if (unit === "lbs") {
      setCurrentWeight(Math.round(currentWeight / 2.205));
      setGoalWeight(Math.round(goalWeight / 2.205));
      setUnit("kg");
    } else {
      setCurrentWeight(Math.round(currentWeight * 2.205));
      setGoalWeight(Math.round(goalWeight * 2.205));
      setUnit("lbs");
    }
  };

  const min = unit === "lbs" ? 80 : 36;
  const max = unit === "lbs" ? 500 : 227;
  const loss = toLoss();
  const muscleLossEst = Math.round(loss * 0.4);

  return (
    <OnboardingLayout
      step={3}
      footer={
        <button
          onClick={handleNext}
          disabled={saving || goalWeight >= currentWeight}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          Your weight journey.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          We'll calculate how much muscle you're at risk of losing.
        </p>
      </section>

      {/* Unit toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={switchUnit}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-sm font-mono active:scale-95 transition-transform"
        >
          <span className={unit === "lbs" ? "text-primary font-bold" : "text-on-surface-variant"}>LBS</span>
          <span className="text-on-surface-variant">/</span>
          <span className={unit === "kg" ? "text-primary font-bold" : "text-on-surface-variant"}>KG</span>
        </button>
      </div>

      <div className="space-y-12">
        {/* Current weight */}
        <div className="space-y-6">
          <span className="font-mono text-primary text-sm tracking-widest uppercase">Current Weight</span>
          <div className="bg-surface-container-low rounded-lg p-8">
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={() => setCurrentWeight(Math.max(min, currentWeight - 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center">
                <span className="font-mono text-6xl font-bold text-on-surface">{currentWeight}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest uppercase">{unit}</span>
              </div>
              <button
                onClick={() => setCurrentWeight(Math.min(max, currentWeight + 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Goal weight */}
        <div className="space-y-6">
          <span className="font-mono text-primary text-sm tracking-widest uppercase">Goal Weight</span>
          <div className="bg-surface-container-low rounded-lg p-8">
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={() => setGoalWeight(Math.max(min, goalWeight - 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center">
                <span className="font-mono text-6xl font-bold text-on-surface">{goalWeight}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest uppercase">{unit}</span>
              </div>
              <button
                onClick={() => setGoalWeight(Math.min(max, goalWeight + 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Risk preview */}
        {loss > 0 && (
          <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-accent-danger shadow-sm">
            <span className="material-symbols-outlined material-filled text-accent-danger">warning</span>
            <div>
              <p className="text-sm leading-relaxed text-on-surface">
                To lose <span className="font-bold text-on-surface">{loss} {unit}</span>, without intervention up to{" "}
                <span className="text-accent-danger font-bold">{muscleLossEst} {unit}</span> could be muscle — not fat.
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                That's 40% of your total weight loss at risk.
              </p>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default WeightGoals;
