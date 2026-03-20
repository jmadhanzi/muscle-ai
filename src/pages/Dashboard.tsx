import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { SkeletonCard } from "@/components/motion/Skeleton";
import PaywallModal from "@/components/PaywallModal";
import { DAILY_PROTOCOL } from "@/config/features";
import { usePaywall } from "@/hooks/usePaywall";
import { useDailyTracking } from "@/hooks/useDailyTracking";
import DashboardHeader from "@/components/dashboard/Header";
import MuscleScoreGauge from "@/components/dashboard/MuscleScoreGauge";
import StatsRow from "@/components/dashboard/StatsRow";
import TodaysMission from "@/components/dashboard/TodaysMission";
import AICoachTeaser from "@/components/dashboard/AICoachTeaser";
import SocialProofFeed from "@/components/dashboard/SocialProofFeed";
// Pro-only widgets
import MuscleScoreHistory from "@/components/dashboard/MuscleScoreHistory";
import WeeklyStreakRing from "@/components/dashboard/WeeklyStreakRing";
import InjectionCountdown from "@/components/dashboard/InjectionCountdown";
import ProteinRing from "@/components/dashboard/ProteinRing";
import ProProtocol from "@/components/dashboard/ProProtocol";
import WeeklyProgressSummary from "@/components/dashboard/WeeklyProgressSummary";

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
  injection_day: string | null;
}

export const calcMuscleScore = (data: OnboardingData) => {
  let score = 45;
  if (data.fitness_level === "athlete") score += 12;
  else if (data.fitness_level === "active") score += 8;
  else if (data.fitness_level === "beginner") score += 3;
  if (data.protein_intake === "over_150") score += 10;
  else if (data.protein_intake === "100_to_150") score += 6;
  else if (data.protein_intake === "50_to_100") score += 2;
  else score -= 5;
  if ((data.workouts_per_week || 0) >= 4) score += 5;
  if ((data.weeks_on_medication || 0) > 12) score -= 8;
  else if ((data.weeks_on_medication || 0) > 4) score -= 3;
  return Math.max(20, Math.min(85, score));
};

export const calcAtRiskLbs = (data: OnboardingData, score: number) => {
  const weightLbs = data.weight_unit === "kg" ? (data.weight_kg || 70) * 2.205 : (data.weight_kg || 154);
  const toLose = Math.max(0, weightLbs - ((data.goal_weight || weightLbs) * (data.weight_unit === "kg" ? 2.205 : 1)));
  const atRisk = toLose * 0.4 * ((100 - score) / 100);
  return { atRiskLbs: Math.round(atRisk * 10) / 10, preservePct: Math.round(60 + score * 0.35) };
};

export const calcProteinTarget = (data: OnboardingData) => {
  const goalLbs = data.weight_unit === "kg" ? (data.goal_weight || 70) * 2.205 : (data.goal_weight || 154);
  return Math.round(goalLbs * 0.7);
};

const stagger = {
  container: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  item: {
    initial: { opacity: 0, y: 14, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
  },
};

const Dashboard = () => {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const paywall = usePaywall();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { proteinIntake, checkedItems, addProtein, toggleItem, loaded: trackingLoaded } = useDailyTracking(user?.id);
  const timeTriggersRan = useRef(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: onb }, { data: prof }] = await Promise.all([
        supabase.from("onboarding_data").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("first_name").eq("user_id", user.id).single(),
      ]);
      if (onb) setData({ ...onb, first_name: prof?.first_name || undefined });
      setLoading(false);
    };
    load();
  }, [user]);

  // ── Time-based paywall triggers (free users only) ──
  useEffect(() => {
    if (!data || timeTriggersRan.current || isPro) return;
    timeTriggersRan.current = true;

    const dayNumber = Math.max(1, Math.min(70, data.weeks_on_medication ? data.weeks_on_medication * 7 : 1));
    if (dayNumber >= 3) {
      setTimeout(() => paywall.fire("day3_return"), 1500);
      return;
    }

    if (data.injection_day) {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const injectionIdx = days.indexOf(data.injection_day.toLowerCase());
      if (injectionIdx !== -1) {
        const today = new Date().getDay();
        const dayBefore = (injectionIdx - 1 + 7) % 7;
        if (today === dayBefore) {
          setTimeout(() => paywall.fire("injection_day"), 1500);
        }
      }
    }
  }, [data, paywall, isPro]);

  if (loading || !trackingLoaded) {
    return (
      <div className="min-h-screen bg-mesh px-5 pt-16 pb-24 space-y-4">
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    );
  }

  if (!data) { navigate("/personal-identity"); return null; }

  const muscleScore = calcMuscleScore(data);
  const { atRiskLbs, preservePct } = calcAtRiskLbs(data, muscleScore);
  const proteinTarget = calcProteinTarget(data);
  const dayNumber = Math.max(1, Math.min(70, data.weeks_on_medication ? data.weeks_on_medication * 7 : 1));
  const scoreChange = Math.max(3, Math.round(muscleScore * 0.12));

  // Simulated weekly streak for Pro — Mon-Sun based on day of week
  const todayDow = new Date().getDay(); // 0=Sun
  const mondayIdx = todayDow === 0 ? 6 : todayDow - 1;
  const completedDays = Array.from({ length: 7 }, (_, i) => i <= mondayIdx && i < mondayIdx);
  // Mark today as completed if any checkedItems exist
  if (checkedItems.size > 0) completedDays[mondayIdx] = true;
  const streakDays = completedDays.filter(Boolean).length;

  const toggleCheck = (id: string, unlocked: boolean) => {
    if (!unlocked) {
      paywall.fire("protocol_locked");
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
      <DashboardHeader firstName={data.first_name} dayNumber={dayNumber} />

      <motion.div className="px-5 space-y-5 mt-2" variants={stagger.container} initial="initial" animate="animate">
        {/* Muscle Score Gauge — always shown */}
        <motion.div variants={stagger.item}>
          <MuscleScoreGauge score={muscleScore} atRiskLbs={atRiskLbs} preservePct={preservePct} />
        </motion.div>

        {/* Pro: Score History Chart */}
        {isPro && (
          <motion.div variants={stagger.item}>
            <MuscleScoreHistory currentScore={muscleScore} />
          </motion.div>
        )}

        {/* Pro: Streak Ring + Injection Countdown side by side */}
        {isPro && (
          <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
            <WeeklyStreakRing completedDays={completedDays} />
            <ProteinRing target={proteinTarget} />
          </motion.div>
        )}

        {/* Pro: Injection Countdown */}
        {isPro && (
          <motion.div variants={stagger.item}>
            <InjectionCountdown injectionDay={data.injection_day} />
          </motion.div>
        )}

        {/* Stats Row — free users see basic version */}
        {!isPro && (
          <motion.div variants={stagger.item}>
            <StatsRow injectionDay={data.injection_day} proteinTarget={proteinTarget} />
          </motion.div>
        )}

        {/* Today's Mission — always shown, unlocked for Pro */}
        <motion.div variants={stagger.item}>
          <TodaysMission
            checkedItems={checkedItems}
            completedFree={completedFree}
            totalFree={totalFree}
            onToggle={toggleCheck}
          />
        </motion.div>

        {/* Pro: Full Protocol (workout, meals, AI tip, hydration) */}
        {isPro && (
          <motion.div variants={stagger.item}>
            <ProProtocol proteinTarget={proteinTarget} />
          </motion.div>
        )}

        {/* Pro: Weekly Progress Summary */}
        {isPro && (
          <motion.div variants={stagger.item}>
            <WeeklyProgressSummary
              proteinTarget={proteinTarget}
              muscleScoreChange={scoreChange}
              streakDays={streakDays}
            />
          </motion.div>
        )}

        {/* AI Coach Teaser — only for free users */}
        {!isPro && (
          <motion.div variants={stagger.item}>
            <AICoachTeaser />
          </motion.div>
        )}

        {/* Social Proof Feed — always shown */}
        <motion.div variants={stagger.item}>
          <SocialProofFeed />
        </motion.div>
      </motion.div>

      <PaywallModal
        open={paywall.open}
        onClose={paywall.close}
        feature={paywall.copy.feature}
        headline={paywall.copy.headline}
        body={paywall.copy.body}
        userName={data.first_name}
        scoreChange={scoreChange}
      />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
