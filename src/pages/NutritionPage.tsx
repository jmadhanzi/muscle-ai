import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyTracking } from "@/hooks/useDailyTracking";
import { supabase } from "@/integrations/supabase/client";
import { calcProteinTarget, type OnboardingData } from "@/pages/Dashboard";
import { MEALS, MEAL_FILTERS } from "@/data/mealLibrary";
import type { Meal, MealTag } from "@/data/mealLibrary";
import MealCard from "@/components/meals/MealCard";
import MealDetail from "@/components/meals/MealDetail";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

const NutritionPage = () => {
  const paywall = usePaywall();
  const { isPro, user } = useAuth();
  const { proteinIntake, addProtein } = useDailyTracking(user?.id);
  const [activeFilter, setActiveFilter] = useState<MealTag | "all">("all");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // FIX: Load protein target from profile instead of hardcoding 140g
  const [profileData, setProfileData] = useState<OnboardingData | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("current_weight, goal_weight, weight_unit, first_name, protein_target")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfileData(data as unknown as OnboardingData);
      });
  }, [user]);

  // Use profile's stored protein_target if set, otherwise calculate from weight
  const proteinTarget = profileData
    ? ((profileData as OnboardingData & { protein_target?: number }).protein_target ?? calcProteinTarget(profileData))
    : 140;

  const firstName = profileData?.first_name || user?.user_metadata?.first_name || "You";
  const remaining = Math.max(0, proteinTarget - proteinIntake);
  const progressPct = Math.min(100, (proteinIntake / proteinTarget) * 100);

  const filteredMeals = useMemo(() => {
    if (activeFilter === "all") return MEALS;
    return MEALS.filter((m) => m.tags.includes(activeFilter));
  }, [activeFilter]);

  const handleLogMeal = (protein: number) => {
    addProtein(protein);
    toast.success(`+${protein}g protein logged! 💪`, {
      description: `${proteinIntake + protein}g / ${proteinTarget}g today`,
    });
  };

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <AnimatePresence>
        {selectedMeal && (
          <MealDetail
            meal={selectedMeal}
            onClose={() => setSelectedMeal(null)}
            onLog={handleLogMeal}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-2"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">
          {firstName}'s Meal Plan
        </h1>
        <p className="text-on-surface-variant text-sm mt-0.5">
          High-protein meals synced to your injection schedule
        </p>
      </motion.header>

      {/* Protein Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease }}
        className="mx-5 my-3 bg-surface-container-lowest rounded-xl p-4 border border-white/[0.06]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Today's Protein</span>
          <span className="text-sm font-headline font-bold text-on-surface">
            <span className="text-primary">{proteinIntake}g</span> / {proteinTarget}g
          </span>
        </div>
        <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-1.5 font-mono">
          {remaining > 0 ? `${remaining}g remaining` : "🎯 Daily target hit!"}
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, ease }}
        className="px-5 mb-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-low text-on-surface-variant border border-white/[0.06]"
            }`}
          >
            All
          </button>
          {MEAL_FILTERS.map((f) => (
            <button
              key={f.tag}
              onClick={() => setActiveFilter(f.tag)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
                activeFilter === f.tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container-low text-on-surface-variant border border-white/[0.06]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Meal grid */}
      <div className="px-5 grid grid-cols-1 gap-3">
        {filteredMeals.map((meal, i) => {
          const isLocked = !isPro && !meal.free;
          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease }}
            >
              <MealCard
                meal={meal}
                isLocked={isLocked}
                onSelect={() => {
                  if (isLocked) {
                    paywall.fire("meal_locked");
                  } else {
                    setSelectedMeal(meal);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <PaywallModal
        open={paywall.open}
        onClose={paywall.close}
        feature={paywall.copy.feature}
        headline={paywall.copy.headline}
        body={paywall.copy.body}
      />
      <BottomNav />
    </div>
  );
};

export default NutritionPage;
