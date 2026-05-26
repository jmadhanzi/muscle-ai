import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Share2, ChevronDown } from "lucide-react";
import type { Meal } from "@/data/mealLibrary";
import { shareContent } from "@/lib/capacitor";

const ease = [0.16, 1, 0.3, 1] as const;

interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
  onLog: (protein: number) => void;
}

const MealDetail = ({ meal, onClose, onLog }: MealDetailProps) => {
  const [ingredientsOpen, setIngredientsOpen] = useState(true);

  const handleShare = async () => {
    await shareContent({
      title: meal.name,
      text: `${meal.name} — ${meal.protein}g protein in ${meal.prepTime} min. From MuscleLock AI.`,
      url: "https://musclelock.app",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[hsl(var(--surface))] overflow-y-auto"
    >
      {/* Hero area */}
      <div className="relative h-52 bg-gradient-to-b from-[hsl(var(--surface-container))] to-[hsl(var(--surface))] flex items-center justify-center">
        <span className="text-7xl">{meal.emoji}</span>

        {/* Protein badge */}
        <div className="absolute top-14 right-4 gradient-hero text-[hsl(var(--on-primary))] font-mono font-bold text-lg px-3 py-1.5 rounded-full shadow-lg">
          {meal.protein}g
        </div>

        {/* Close + Share */}
        <div className="absolute top-14 left-4 flex gap-2">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-4 h-4 text-[hsl(var(--on-surface-variant))]" />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share meal"
            className="w-9 h-9 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center active:scale-90 transition-transform"
          >
            <Share2 className="w-4 h-4 text-[hsl(var(--on-surface-variant))]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-10">
        {/* Title */}
        <div className="mt-5 mb-4">
          <h2 className="font-headline font-bold text-2xl text-[hsl(var(--on-surface))]">{meal.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[hsl(var(--on-surface-variant))]">{meal.prepTime}</span>
            <span className="text-[hsl(var(--on-surface-variant))]">·</span>
            <span className="text-xs text-[hsl(var(--on-surface-variant))]">{meal.calories} kcal</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {meal.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-[hsl(var(--surface-container))] text-[10px] font-mono text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Protein", value: `${meal.protein}g`, highlight: true },
            { label: "Carbs", value: `${meal.carbs}g`, highlight: false },
            { label: "Fat", value: `${meal.fat}g`, highlight: false },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-xl p-3 text-center ${
                highlight
                  ? "bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)]"
                  : "bg-[hsl(var(--surface-container))]"
              }`}
            >
              <p className={`font-mono font-bold text-lg ${highlight ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--on-surface))]"}`}>{value}</p>
              <p className="text-[10px] text-[hsl(var(--on-surface-variant))] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        {meal.ingredients?.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setIngredientsOpen(!ingredientsOpen)}
              className="w-full flex items-center justify-between py-3 text-left"
            >
              <span className="font-headline font-bold text-sm text-[hsl(var(--on-surface))]">Ingredients</span>
              <motion.div animate={{ rotate: ingredientsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-[hsl(var(--on-surface-variant))]" />
              </motion.div>
            </button>
            <AnimatePresence>
              {ingredientsOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden space-y-1.5"
                >
                  {meal.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-baseline justify-between text-xs py-1.5 border-b border-[hsl(var(--border)/0.5)] last:border-0">
                      <span className="text-[hsl(var(--on-surface))]">{ing.name}</span>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-[hsl(var(--on-surface-variant))]">{ing.amount}</span>
                        {ing.protein > 0 && (
                          <span className="text-[hsl(var(--primary))] font-mono text-xs ml-1">— {ing.protein}g protein</span>
                        )}
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tip */}
        {meal.tip && (
          <div className="mb-6 bg-[hsl(var(--primary)/0.06)] border border-[hsl(var(--primary)/0.15)] rounded-xl p-4">
            <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed">
              💡 <span className="text-[hsl(var(--on-surface))]">{meal.tip}</span>
            </p>
          </div>
        )}

        {/* Log CTA */}
        <button
          onClick={() => { onLog(meal.protein); onClose(); }}
          className="w-full py-4 rounded-full gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-[0_8px_24px_hsla(160,100%,45%,0.2)]"
        >
          <Plus className="w-5 h-5" />
          Log +{meal.protein}g protein
        </button>
      </div>
    </motion.div>
  );
};

export default MealDetail;
