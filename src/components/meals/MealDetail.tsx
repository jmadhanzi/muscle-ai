import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Share2, ChevronDown } from "lucide-react";
import type { Meal } from "@/data/mealLibrary";

const ease = [0.16, 1, 0.3, 1] as const;

interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
  onLog: (protein: number) => void;
}

const MealDetail = ({ meal, onClose, onLog }: MealDetailProps) => {
  const [ingredientsOpen, setIngredientsOpen] = useState(true);

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
        <button
          onClick={onClose}
          className="absolute top-14 left-4 p-2 rounded-full bg-[hsl(var(--surface)/0.8)] backdrop-blur-sm active:scale-95 transition-transform"
        >
          <X className="w-5 h-5 text-[hsl(var(--on-surface))]" />
        </button>
      </div>

      <div className="px-5 pb-32 -mt-4 relative z-10 space-y-5">
        {/* Title */}
        <div>
          <h2 className="font-headline font-bold text-xl text-[hsl(var(--on-surface))]">{meal.name}</h2>
          <p className="text-sm text-[hsl(var(--on-surface-variant))] mt-0.5">{meal.subtitle}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-[hsl(var(--on-surface-variant))] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">timer</span>
              {meal.prepTime} min
            </span>
            {meal.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* GLP-1 Tip */}
        <div className="bg-[hsl(var(--secondary)/0.08)] border border-[hsl(var(--secondary)/0.15)] rounded-lg p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--secondary))] mb-1">
            GLP-1 Tip
          </p>
          <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed">
            {meal.glp1Tip}
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <button
            onClick={() => setIngredientsOpen(!ingredientsOpen)}
            className="flex items-center justify-between w-full mb-2"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))]">
              Ingredients
            </p>
            <ChevronDown className={`w-4 h-4 text-[hsl(var(--on-surface-variant))] transition-transform ${ingredientsOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {ingredientsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-1.5"
              >
                {meal.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[hsl(var(--primary))] mt-0.5">•</span>
                    <div className="flex-1">
                      <span className="text-[hsl(var(--on-surface))]">{ing.item}</span>
                      {ing.protein > 0 && (
                        <span className="text-[hsl(var(--primary))] font-mono text-xs ml-1">— {ing.protein}g protein</span>
                      )}
                      {ing.note && (
                        <span className="text-[hsl(var(--on-surface-variant))] text-xs ml-1">— {ing.note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))] mb-2">
            Instructions
          </p>
          <div className="space-y-2">
            {meal.instructions.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface-variant))] text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[hsl(var(--on-surface))] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Card */}
        <div className="bg-[hsl(var(--surface-container-low))] rounded-lg p-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--on-surface-variant))] mb-3">
            Macros
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Protein", value: `${meal.protein}g`, highlight: true },
              { label: "Calories", value: `${meal.calories}`, highlight: false },
              { label: "Carbs", value: `${meal.carbs}g`, highlight: false },
              { label: "Fat", value: `${meal.fat}g`, highlight: false },
            ].map((m) => (
              <div key={m.label}>
                <p className={`font-mono font-bold text-lg ${m.highlight ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--on-surface))]"}`}>
                  {m.value}
                </p>
                <p className="text-[10px] text-[hsl(var(--on-surface-variant))]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Note */}
        <div className="bg-[hsl(var(--accent-purple)/0.08)] border-l-2 border-[hsl(var(--accent-purple))] rounded-r-lg p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--accent-purple))] mb-1">
            GLP-1 Coach Note
          </p>
          <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed italic">
            "{meal.coachNote}"
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => { onLog(meal.protein); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-sm active:scale-[0.97] transition-transform"
          >
            <Plus className="w-4 h-4" />
            Log This Meal
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: meal.name, text: `${meal.name} — ${meal.protein}g protein in ${meal.prepTime} min` });
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))] text-sm hover:bg-[hsl(var(--surface-container-high))] transition-colors active:scale-[0.97]"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MealDetail;
