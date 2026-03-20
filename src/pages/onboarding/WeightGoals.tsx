import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingLayout from "@/components/OnboardingLayout";

/* ── Animated counter hook ── */
const useAnimatedNumber = (target: number, duration = 400) => {
  const [val, setVal] = useState(target);
  const raf = useRef<number>();
  const prev = useRef(target);

  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    if (diff === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + diff * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return val;
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const WeightGoals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [currentWeight, setCurrentWeight] = useState(185);
  const [goalWeight, setGoalWeight] = useState(155);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("current_weight, goal_weight, weight_unit, first_name")
        .eq("user_id", user.id)
        .single();
      if (data?.weight_unit) setUnit(data.weight_unit as "lbs" | "kg");
      if (data?.current_weight) {
        const u = data.weight_unit || "lbs";
        setCurrentWeight(u === "kg" ? Number(data.current_weight) : Math.round(Number(data.current_weight) * 2.205));
      }
      if (data?.goal_weight) {
        const u = data.weight_unit || "lbs";
        setGoalWeight(u === "kg" ? Number(data.goal_weight) : Math.round(Number(data.goal_weight) * 2.205));
      }
      if (data?.first_name) setFirstName(data.first_name);
    };
    load();
  }, [user]);

  const toKg = (val: number) => (unit === "kg" ? val : Math.round(val / 2.205 * 10) / 10);

  const handleNext = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({
        current_weight: toKg(currentWeight),
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
  const loss = Math.max(0, currentWeight - goalWeight);
  const name = firstName.trim();

  const withoutML = Math.round(loss * 0.40);
  const withML = Math.round(loss * 0.08);
  const saved = Math.round(loss * 0.32);
  const withoutMLkg = (withoutML * 0.454).toFixed(1);
  const steaks = Math.round(saved * 0.454 / 0.45);

  const animLoss = useAnimatedNumber(loss);
  const animWithout = useAnimatedNumber(withoutML);
  const animWith = useAnimatedNumber(withML);
  const animSaved = useAnimatedNumber(saved);

  return (
    <OnboardingLayout
      step={3}
      footer={
        <button
          onClick={handleNext}
          disabled={saving || goalWeight >= currentWeight}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <motion.header className="mb-10" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.1] tracking-tight mb-3">
          Let's calculate your muscle at risk{name ? `, ${name}` : ""}.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          See exactly how much lean mass is on the line.
        </p>
      </motion.header>

      <motion.div className="space-y-12" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="flex justify-end">
          <button onClick={switchUnit} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-sm font-mono active:scale-[0.96] transition-transform">
            <span className={unit === "lbs" ? "text-primary font-bold" : "text-on-surface-variant"}>LBS</span>
            <span className="text-on-surface-variant">/</span>
            <span className={unit === "kg" ? "text-primary font-bold" : "text-on-surface-variant"}>KG</span>
          </button>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-4 block">01 / Current Weight</span>
          <div className="bg-surface-container-low rounded-2xl p-8">
            <div className="flex items-center justify-center gap-12">
              <button onClick={() => setCurrentWeight(Math.max(min, currentWeight - 1))} className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center select-none">
                <span className="font-mono text-6xl font-bold text-on-surface leading-none">{currentWeight}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest uppercase">{unit}</span>
              </div>
              <button onClick={() => setCurrentWeight(Math.min(max, currentWeight + 1))} className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-4 block">02 / Goal Weight</span>
          <div className="bg-surface-container-low rounded-2xl p-8">
            <div className="flex items-center justify-center gap-12">
              <button onClick={() => setGoalWeight(Math.max(min, goalWeight - 1))} className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center select-none">
                <span className="font-mono text-6xl font-bold text-on-surface leading-none">{goalWeight}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest uppercase">{unit}</span>
              </div>
              <button onClick={() => setGoalWeight(Math.min(max, goalWeight + 1))} className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {loss > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/30 via-transparent to-primary/30 animate-pulse pointer-events-none" />
                <div className="m-[2px] rounded-[14px] bg-surface-container-low p-6 md:p-8 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📊</span>
                    <h2 className="font-headline font-bold text-lg text-on-surface tracking-tight uppercase">Your Muscle Loss Projection</h2>
                  </div>
                  <div className="mb-6 pb-6 border-b border-outline-variant/15">
                    <p className="text-on-surface-variant text-sm">Total weight to lose</p>
                    <p className="font-mono text-3xl font-bold text-on-surface mt-1">{animLoss} <span className="text-base text-on-surface-variant">{unit}</span></p>
                  </div>
                  <div className="mb-6 pb-6 border-b border-outline-variant/15">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-destructive">warning</span>
                      <span className="text-sm font-bold text-destructive uppercase tracking-wider">Without MuscleLock</span>
                    </div>
                    <p className="text-on-surface text-sm leading-relaxed">
                      <span className="font-mono text-2xl font-bold text-destructive">{animWithout} {unit}</span>
                      <span className="text-on-surface-variant ml-2">could be MUSCLE</span>
                    </p>
                    <p className="text-on-surface-variant text-xs mt-1 font-mono">= {withoutMLkg} kg of lean mass at risk</p>
                  </div>
                  <div className="relative rounded-xl bg-primary/5 border border-primary/20 p-5 shadow-[0_0_30px_hsla(160,100%,45%,0.08)]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined material-filled text-primary">verified_user</span>
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">With MuscleLock Protocol</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-on-surface text-sm">
                        <span className="font-mono text-2xl font-bold text-primary">{animWith} {unit}</span>
                        <span className="text-on-surface-variant ml-2">muscle loss (max)</span>
                      </p>
                      <p className="text-on-surface text-sm flex items-center gap-2">
                        <span className="text-lg">💪</span>
                        <span>
                          <span className="font-mono text-xl font-bold text-primary">{animSaved} {unit}</span>
                          <span className="text-on-surface-variant ml-2">MORE muscle saved</span>
                        </span>
                      </p>
                      {steaks > 0 && (
                        <p className="text-on-surface-variant text-xs mt-2 pt-2 border-t border-primary/10">
                          That's like keeping <span className="text-primary font-bold">{steaks} steaks</span> worth of muscle on your body.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 text-center">
                    <p className="text-on-surface-variant text-xs mb-1">Based on peer-reviewed GLP-1 clinical trial data</p>
                    <button onClick={() => setShowSources(true)} className="text-xs text-secondary underline underline-offset-2 hover:text-primary transition-colors">
                      View source citations →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSources && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowSources(false)}
          >
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold text-xl text-on-surface">Clinical Sources</h3>
                <button onClick={() => setShowSources(false)} className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors active:scale-95">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-surface-container-high">
                  <p className="text-sm font-medium text-on-surface mb-1">Lean Mass Loss with GLP-1 RAs</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Wilding JPH, et al. "Once-Weekly Semaglutide in Adults with Overweight or Obesity." <em className="text-secondary">NEJM</em>, 2021; 384:989-1002.</p>
                  <p className="text-xs text-on-surface-variant mt-2">Finding: ~40% of weight lost was lean body mass in the semaglutide group without structured resistance training.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-high">
                  <p className="text-sm font-medium text-on-surface mb-1">Resistance Training + GLP-1</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Lundgren JR, et al. "Healthy Weight Loss Maintenance with Exercise, Liraglutide, or Both Combined." <em className="text-secondary">NEJM</em>, 2021; 384:1719-1730.</p>
                  <p className="text-xs text-on-surface-variant mt-2">Finding: Structured resistance exercise reduced lean mass loss to ~8% of total weight lost.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-high">
                  <p className="text-sm font-medium text-on-surface mb-1">Tirzepatide Body Composition</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Jastreboff AM, et al. "Tirzepatide Once Weekly for the Treatment of Obesity." <em className="text-secondary">NEJM</em>, 2022; 387:205-216.</p>
                  <p className="text-xs text-on-surface-variant mt-2">Finding: Tirzepatide produced 23% greater weight loss vs semaglutide, with proportional lean mass loss.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  );
};

export default WeightGoals;
