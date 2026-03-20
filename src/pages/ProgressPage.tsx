import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SkeletonCard } from "@/components/motion/Skeleton";
import BodyCompositionChart from "@/components/progress/BodyCompositionChart";
import ScoreHistoryChart from "@/components/progress/ScoreHistoryChart";
import MilestoneCards from "@/components/progress/MilestoneCards";
import ReferralSection from "@/components/progress/ReferralSection";
import ReferralLeaderboard from "@/components/progress/ReferralLeaderboard";
import { useMilestones } from "@/hooks/useMilestones";
import { useReferrals } from "@/hooks/useReferrals";
import { calcMuscleScore, calcAtRiskLbs, calcProteinTarget, type OnboardingData } from "@/pages/Dashboard";

const ease = [0.16, 1, 0.3, 1] as const;

const stagger = {
  container: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  item: {
    initial: { opacity: 0, y: 14, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
  },
};

const ProgressPage = () => {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const paywall = usePaywall();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  const { unlockedIds, sharedIds, loaded: milestonesLoaded, unlock, markShared } = useMilestones(user?.id);
  const { referralCode, referralCount, monthsEarned, loaded: referralsLoaded, ensureReferralExists } = useReferrals(user?.id);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (prof) setData({ ...prof, first_name: prof.first_name || undefined, current_weight: prof.current_weight, weight_kg: prof.current_weight });
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading || !milestonesLoaded || !referralsLoaded) {
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

  const muscleScore = calcMuscleScore(data);
  const { preservePct } = calcAtRiskLbs(data, muscleScore);
  const proteinTarget = calcProteinTarget(data);
  const currentWeight = data.weight_unit === "kg" ? (data.current_weight || 70) : (data.current_weight || 70) * 2.205;
  const weeksOnMed = data.weeks_on_medication || 4;
  const dayNumber = Math.max(1, Math.min(70, weeksOnMed * 7));

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-2"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">Your MuscleLock Journey</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">
          {data.first_name ? `${data.first_name}, track` : "Track"} your muscle preservation progress
        </p>
      </motion.header>

      <motion.div className="px-5 space-y-5 mt-2" variants={stagger.container} initial="initial" animate="animate">
        <motion.div variants={stagger.item}>
          <BodyCompositionChart
            currentWeight={currentWeight}
            goalWeight={data.goal_weight || currentWeight * 0.9}
            muscleScore={muscleScore}
            weightUnit={data.weight_unit || "lbs"}
            weeksOnMedication={weeksOnMed}
          />
        </motion.div>

        <motion.div variants={stagger.item}>
          {isPro ? (
            <ScoreHistoryChart currentScore={muscleScore} />
          ) : (
            <button
              onClick={() => paywall.fire("analytics_tap")}
              className="w-full bg-surface-container-lowest rounded-lg border border-border p-5 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline font-bold text-lg text-on-surface">Muscle Score History</h2>
                  <p className="text-xs text-on-surface-variant mt-1">See how your score compares to average GLP-1 users</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
              </div>
            </button>
          )}
        </motion.div>

        <motion.div variants={stagger.item}>
          <MilestoneCards
            muscleScore={muscleScore}
            proteinTarget={proteinTarget}
            medication={data.medication || "GLP-1"}
            preservePct={preservePct}
            currentWeight={currentWeight}
            weightUnit={data.weight_unit || "lbs"}
            dayNumber={dayNumber}
            isPro={isPro}
            onPaywall={() => paywall.fire("milestone_share")}
            unlockedIds={unlockedIds}
            sharedIds={sharedIds}
            onUnlock={unlock}
            onShare={markShared}
          />
        </motion.div>

        {user && (
          <motion.div variants={stagger.item}>
            <ReferralSection
              referralCode={referralCode}
              referralCount={referralCount}
              monthsEarned={monthsEarned}
              onShareClick={ensureReferralExists}
            />
          </motion.div>
        )}
      </motion.div>

      <PaywallModal
        open={paywall.open}
        onClose={paywall.close}
        feature={paywall.copy.feature}
        headline={paywall.copy.headline}
        body={paywall.copy.body}
        userName={data.first_name}
      />
      <BottomNav />
    </div>
  );
};

export default ProgressPage;
