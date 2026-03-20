import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CountUp, AnimatedProgress } from "@/components/motion/Animated";
import BottomNav from "@/components/BottomNav";
import { SkeletonCard } from "@/components/motion/Skeleton";
import { Lock } from "lucide-react";
import PaywallModal from "@/components/PaywallModal";

interface OnboardingData {
  first_name?: string;
  weight_kg: number | null;
  goal_weight: number | null;
  weight_unit: string | null;
  muscle_concern: string | null;
  fitness_level: string | null;
  workouts_per_week: number | null;
  protein_intake: string | null;
  primary_goal: string | null;
  medication: string | null;
  weeks_on_medication: number | null;
}

const calcRiskScore = (data: OnboardingData) => {
  const factors = [
    data.muscle_concern === "very_concerned" ? 20 : data.muscle_concern === "somewhat" ? 12 : data.muscle_concern === "not_sure" ? 8 : 3,
    data.fitness_level === "never_exercised" ? 25 : data.fitness_level === "beginner" ? 15 : data.fitness_level === "intermediate" ? 5 : 0,
    (data.workouts_per_week || 0) === 0 ? 15 : (data.workouts_per_week || 0) <= 2 ? 8 : 0,
    data.protein_intake === "less_than_50" ? 20 : data.protein_intake === "50_to_100" ? 12 : data.protein_intake === "100_to_150" ? 5 : 0,
    (data.weeks_on_medication || 0) > 8 ? 10 : (data.weeks_on_medication || 0) > 4 ? 5 : 0,
  ];
  return Math.min(95, 20 + factors.reduce((a, b) => a + b, 0));
};

const calcLeanMass = (weight: number | null, riskScore: number) => {
  if (!weight) return null;
  const fatPct = 0.25; // rough estimate
  const leanKg = weight * (1 - fatPct);
  const atRiskKg = leanKg * (riskScore / 100) * 0.15;
  return { leanKg: Math.round(leanKg * 10) / 10, atRiskKg: Math.round(atRiskKg * 10) / 10 };
};

const DAILY_PROTOCOL = [
  { id: "protein", icon: "egg_alt", label: "Hit protein target", detail: "1.2g per kg body weight", free: true },
  { id: "resistance", icon: "fitness_center", label: "Resistance training", detail: "3 compound exercises", free: true },
  { id: "creatine", icon: "science", label: "Creatine monohydrate", detail: "5g daily", free: true },
  { id: "sleep", icon: "bedtime", label: "Sleep optimization", detail: "7-9 hours window", free: false },
  { id: "timing", icon: "schedule", label: "Meal timing protocol", detail: "Synced to injection day", free: false },
  { id: "recovery", icon: "self_improvement", label: "Recovery protocol", detail: "Active recovery plan", free: false },
];

const stagger = {
  container: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  item: {
    initial: { opacity: 0, y: 12, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: onb }, { data: prof }] = await Promise.all([
        supabase.from("onboarding_data").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("first_name").eq("user_id", user.id).single(),
      ]);
      if (onb) {
        setData({ ...onb, first_name: prof?.first_name || undefined });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh px-5 pt-16 pb-24 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!data) {
    navigate("/personal-identity");
    return null;
  }

  const riskScore = calcRiskScore(data);
  const lean = calcLeanMass(data.weight_kg, riskScore);
  const riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 50 ? "MODERATE" : "LOW";
  const riskColor = riskScore >= 70 ? "text-accent-danger" : riskScore >= 50 ? "text-accent-gold" : "text-primary";
  const greeting = data.first_name ? `Hey ${data.first_name}` : "Welcome back";

  const toggleCheck = (id: string, free: boolean) => {
    if (!free) {
      const item = DAILY_PROTOCOL.find((p) => p.id === id);
      setPaywallFeature(item?.label || "this feature");
      setPaywallOpen(true);
      return;
    }
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const completedFree = DAILY_PROTOCOL.filter((p) => p.free && checkedItems.has(p.id)).length;
  const totalFree = DAILY_PROTOCOL.filter((p) => p.free).length;

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-5 pt-14 pb-2 flex items-center justify-between"
      >
        <div>
          <p className="text-on-surface-variant text-sm font-label">{greeting}</p>
          <h1 className="font-headline font-bold text-2xl text-on-surface leading-tight">Your Protocol</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </button>
      </motion.header>

      <motion.div
        className="px-5 space-y-5"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* Risk Score Card */}
        <motion.div variants={stagger.item}>
          <div className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-accent-danger/15 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-danger/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Muscle Loss Risk</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`font-headline font-black text-5xl ${riskColor}`}>
                    <CountUp end={riskScore} suffix="%" />
                  </span>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${riskColor}`}>{riskLevel}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-danger/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-accent-danger">monitor_heart</span>
              </div>
            </div>
            <AnimatedProgress value={riskScore} barClassName="gradient-danger" />
            <p className="text-on-surface-variant text-xs mt-3">
              {riskScore >= 70
                ? "Immediate intervention recommended. Follow your protocol."
                : riskScore >= 50
                  ? "Moderate risk detected. Stay consistent with your protocol."
                  : "Your risk is manageable. Keep up the good work."}
            </p>
          </div>
        </motion.div>

        {/* Lean Mass Estimate */}
        {lean && (
          <motion.div variants={stagger.item}>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low rounded-lg p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Lean Mass</span>
                <div className="font-headline font-bold text-3xl text-on-surface mt-1">
                  <CountUp end={lean.leanKg} decimals={1} suffix="kg" />
                </div>
                <span className="text-on-surface-variant text-xs">Estimated</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-5 border border-accent-danger/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger">At Risk</span>
                <div className="font-headline font-bold text-3xl text-accent-danger mt-1">
                  <CountUp end={lean.atRiskKg} decimals={1} suffix="kg" />
                </div>
                <span className="text-on-surface-variant text-xs">Could be lost</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Protocol */}
        <motion.div variants={stagger.item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-lg text-on-surface">Today's Protocol</h2>
            <span className="text-xs font-mono text-primary">{completedFree}/{totalFree} done</span>
          </div>
          <div className="space-y-2">
            {DAILY_PROTOCOL.map((item) => {
              const checked = checkedItems.has(item.id);
              const locked = !item.free;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => toggleCheck(item.id, item.free)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 active:scale-[0.97] text-left ${
                    locked
                      ? "bg-surface-container-low/50 opacity-60 cursor-default"
                      : checked
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container"
                  }`}
                  whileTap={locked ? {} : { scale: 0.97 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      locked
                        ? "bg-surface-variant"
                        : checked
                          ? "gradient-hero"
                          : "bg-surface-container-high"
                    }`}
                  >
                    {locked ? (
                      <Lock className="w-4 h-4 text-on-surface-variant" />
                    ) : checked ? (
                      <span className="material-symbols-outlined text-on-primary text-lg">check</span>
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">{item.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${checked ? "text-primary line-through" : "text-on-surface"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">{item.detail}</p>
                  </div>
                  {locked && (
                    <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Upgrade CTA */}
        <motion.div variants={stagger.item}>
          <button
            onClick={() => navigate("/subscribe")}
            className="w-full relative overflow-hidden rounded-lg gradient-hero p-5 active:scale-[0.97] transition-transform duration-200 text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined material-filled text-on-primary text-2xl">bolt</span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-bold text-on-primary">Unlock Full Protocol</p>
                <p className="text-on-primary/70 text-xs mt-0.5">
                  AI coaching, meal timing, recovery plans & more
                </p>
              </div>
              <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
            </div>
          </button>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div variants={stagger.item}>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-low rounded-lg p-4 text-center">
              <span className="material-symbols-outlined text-secondary text-xl">directions_run</span>
              <p className="font-headline font-bold text-on-surface text-lg mt-1 capitalize">
                {data.activity_level?.replace("_", " ") || "—"}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Activity</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 text-center">
              <span className="material-symbols-outlined text-primary text-xl">flag</span>
              <p className="font-headline font-bold text-on-surface text-lg mt-1">
                {data.fitness_goals?.length || 0}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Goals</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 text-center">
              <span className="material-symbols-outlined text-accent-danger text-xl">emergency</span>
              <p className="font-headline font-bold text-accent-danger text-lg mt-1">
                {data.body_concerns?.length || 0}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Concerns</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} feature={paywallFeature} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
