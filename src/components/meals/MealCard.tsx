import { motion } from "framer-motion";
import type { Meal } from "@/data/mealLibrary";

const ease = [0.16, 1, 0.3, 1] as const;

const TAG_LABELS: Record<string, string> = {
  injection: "💉 Inject safe",
  "low-nausea": "🤢 Nausea safe",
  quick: "⚡ Quick",
  "high-protein": "🥛 High protein",
  evening: "🌙 Evening",
};

interface MealCardProps {
  meal: Meal;
  index: number;
  locked: boolean;
  onTap: () => void;
  onPaywall: () => void;
}

const MealCard = ({ meal, index, locked, onTap, onPaywall }: MealCardProps) => {
  const primaryTag = meal.tags[0];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.04, duration: 0.4, ease }}
      onClick={() => (locked ? onPaywall() : onTap())}
      className={`relative flex flex-col p-4 rounded-lg text-left active:scale-[0.97] transition-all duration-200 ${
        locked
          ? "bg-[hsl(var(--surface-container-low)/0.5)] opacity-60"
          : "bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container))]"
      }`}
    >
      {locked && (
        <div className="absolute top-2 right-2">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[hsl(var(--accent-gold))] bg-[hsl(var(--accent-gold)/0.1)] px-1.5 py-0.5 rounded-full">
            Pro
          </span>
        </div>
      )}

      <span className="text-3xl mb-2">{meal.emoji}</span>
      <p className="text-sm font-bold text-[hsl(var(--on-surface))] leading-tight mb-0.5">
        {meal.name}
      </p>

      <div className="flex items-center gap-2 mt-auto pt-2">
        <span className="text-xs font-mono font-bold text-[hsl(var(--primary))]">
          P {meal.protein}g
        </span>
        <span className="text-[10px] text-[hsl(var(--on-surface-variant))] flex items-center gap-0.5">
          ⏱️ {meal.prepTime} min
        </span>
      </div>

      {primaryTag && (
        <span className="text-[10px] text-[hsl(var(--on-surface-variant))] mt-1.5">
          {TAG_LABELS[primaryTag] || primaryTag}
        </span>
      )}

      {!locked && (
        <span className="text-[10px] font-mono text-[hsl(var(--primary))] mt-2">
          View Recipe →
        </span>
      )}
    </motion.button>
  );
};

export default MealCard;
