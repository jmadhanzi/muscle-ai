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
import { DAILY_PROTOCOL, FREE_FEATURES, PRO_FEATURES } from "@/config/features";
import DashboardRiskCard from "@/components/dashboard/RiskCard";
import DashboardLeanMass from "@/components/dashboard/LeanMass";
import DashboardProtocol from "@/components/dashboard/Protocol";
import DashboardQuickStats from "@/components/dashboard/QuickStats";
import DashboardFreeFeatures from "@/components/dashboard/FreeFeatures";
import DashboardProTeaser from "@/components/dashboard/ProTeaser";

export interface OnboardingData {
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

export const calcRiskScore = (data: OnboardingData) => {
  const factors = [
    data.muscle_concern === "very_concerned" ? 20 : data.muscle_concern === "somewhat" ? 12 : data.muscle_concern === "not_sure" ? 8 : 3,
    data.fitness_level === "never_exercised" ? 25 : data.fitness_level === "beginner" ? 15 : data.fitness_level === "intermediate" ? 5 : 0,
    (data.workouts_per_week || 0) === 0 ? 15 : (data.workouts_per_week || 0) <= 2 ? 8 : 0,
    data.protein_intake === "less_than_50" ? 20 : data.protein_intake === "50_to_100" ? 12 : data.protein_intake === "100_to_150" ? 5 : 0,
    (data.weeks_on_medication || 0) > 8 ? 10 : (data.weeks_on_medication || 0) > 4 ? 5 : 0,
  ];
  return Math.min(95, 20 + factors.reduce((a, b) => a + b, 0));
};

export const calcLeanMass = (weight: number | null, riskScore: number) => {
  if (!weight) return null;
  const fatPct = 0.25;
  const leanKg = weight * (1 - fatPct);
  const atRiskKg = leanKg * (riskScore / 100) * 0.15;
  return { leanKg: Math.round(leanKg * 10) / 10, atRiskKg: Math.round(atRiskKg * 10) / 10 };
};

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
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    );
  }

  if (!data) {
    navigate("/personal-identity");
    return null;
  }

  const riskScore = calcRiskScore(data);
  const lean = calcLeanMass(data.weight_kg, riskScore);
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

  const openPaywall = (feature: string) => {
    setPaywallFeature(feature);
    setPaywallOpen(true);
  };

  const completedFree = DAILY_PROTOCOL.filter((p) => p.free && checkedItems.has(p.id)).length;
  const totalFree = DAILY_PROTOCOL.filter((p) => p.free).length;

  return (
    <div className="min-h-screen bg-mesh pb-24">
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

      <motion.div className="px-5 space-y-5" variants={stagger.container} initial="initial" animate="animate">
        <motion.div variants={stagger.item}>
          <DashboardRiskCard riskScore={riskScore} />
        </motion.div>

        {lean && (
          <motion.div variants={stagger.item}>
            <DashboardLeanMass lean={lean} />
          </motion.div>
        )}

        <motion.div variants={stagger.item}>
          <DashboardProtocol
            checkedItems={checkedItems}
            completedFree={completedFree}
            totalFree={totalFree}
            onToggle={toggleCheck}
          />
        </motion.div>

        {/* Free Features Summary */}
        <motion.div variants={stagger.item}>
          <DashboardFreeFeatures onPaywall={openPaywall} />
        </motion.div>

        {/* Pro Teaser */}
        <motion.div variants={stagger.item}>
          <DashboardProTeaser />
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
                <p className="text-on-primary/70 text-xs mt-0.5">AI coaching, meal timing, recovery plans & more</p>
              </div>
              <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
            </div>
          </button>
        </motion.div>

        <motion.div variants={stagger.item}>
          <DashboardQuickStats data={data} />
        </motion.div>
      </motion.div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} feature={paywallFeature} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
