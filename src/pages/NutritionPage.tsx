import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyTracking } from "@/hooks/useDailyTracking";
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

  // Compute protein target (fallback 140g)
  const proteinTarget = 140;
  const remaining = Math.max(0, proteinTarget - proteinIntake);
  const progressPct = Math.min(100, (proteinIntake / proteinTarget) * 100);

  const firstName = user?.user_metadata?.first_name || "You";

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
      {/* Expanded Meal Detail */}
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
        <h1 className="font-headline font-bold text-2xl text-[hsl(var(--on-surface))]">MuscleLock Meals</h1>
        <p className="text-[hsl(var(--on-surface-variant))] text-sm mt-0.5">
          {firstName}, you need <span className="text-[hsl(var(--primary))] font-bold">{proteinTarget}g</span> protein today.{" "}
          <span className="font-mono text-xs">{proteinIntake}g logged, {remaining}g to go</span>
        </p>
      </motion.header>

      <div className="px-5 space-y-5">
        {/* Protein Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-[hsl(var(--on-surface-variant))]">Protein today</span>
            <span className="text-xs font-mono text-[hsl(var(--primary))] font-bold">
              {proteinIntake}g / {proteinTarget}g
            </span>
          </div>
          <div className="h-3 rounded-full bg-[hsl(var(--surface-container-high))] overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-hero"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease }}
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1"
        >
          {MEAL_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all active:scale-[0.97] ${
                activeFilter === filter.id
                  ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--surface-container-low))] text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container))]"
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredMeals.map((meal, i) => {
            const unlocked = isPro || meal.free;
            return (
              <MealCard
                key={meal.id}
                meal={meal}
                index={i}
                locked={!unlocked}
                onTap={() => setSelectedMeal(meal)}
                onPaywall={() => paywall.fire("meal_locked")}
              />
            );
          })}
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[hsl(var(--on-surface-variant))]">No meals match this filter.</p>
          </div>
        )}

        {/* Protein Tip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-[hsl(var(--secondary)/0.08)] border border-[hsl(var(--secondary)/0.15)] rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[hsl(var(--secondary))] text-xl mt-0.5">lightbulb</span>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--on-surface))] mb-1">Protein Tip</p>
              <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed">
                Aim for 1.2–1.6g protein per kg of body weight to minimize muscle loss on GLP-1 medications. Spread intake across 3–4 meals.
              </p>
            </div>
          </div>
        </motion.div>
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
