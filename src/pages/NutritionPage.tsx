import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { Lock, Egg, Droplets } from "lucide-react";
import { AnimatedProgress } from "@/components/motion/Animated";

const MACROS = [
  { label: "Protein", current: 82, target: 140, unit: "g", color: "gradient-hero", icon: Egg },
  { label: "Water", current: 4, target: 8, unit: "cups", color: "bg-secondary", icon: Droplets },
];

const MEAL_PLAN = [
  { time: "7:30 AM", meal: "Breakfast", desc: "Greek yogurt, berries, whey protein", cal: 380, free: true },
  { time: "12:00 PM", meal: "Lunch", desc: "Grilled chicken, quinoa, mixed greens", cal: 520, free: true },
  { time: "3:30 PM", meal: "Snack", desc: "Protein shake, banana, almond butter", cal: 310, free: false },
  { time: "7:00 PM", meal: "Dinner", desc: "Salmon, sweet potato, broccoli", cal: 580, free: false },
];

const ease = [0.16, 1, 0.3, 1] as const;

const NutritionPage = () => {
  const paywall = usePaywall();

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">Nutrition</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Fuel for muscle preservation</p>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Macro Trackers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="grid grid-cols-2 gap-3"
        >
          {MACROS.map((macro) => (
            <div key={macro.label} className="bg-surface-container-lowest rounded-lg p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <macro.icon className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">{macro.label}</span>
              </div>
              <div className="font-headline font-bold text-2xl text-on-surface mb-1">
                {macro.current}<span className="text-on-surface-variant text-sm font-normal">/{macro.target}{macro.unit}</span>
              </div>
              <AnimatedProgress value={(macro.current / macro.target) * 100} barClassName={macro.color} />
            </div>
          ))}
        </motion.div>

        {/* Meal Plan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-lg text-on-surface">Today's Meals</h2>
          </div>
          <div className="space-y-2">
            {MEAL_PLAN.map((item, i) => (
              <motion.button
                key={item.meal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4, ease }}
                onClick={() => !item.free && paywall.fire("meal_locked")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg text-left active:scale-[0.97] transition-all duration-200 ${
                  item.free ? "bg-surface-container-low" : "bg-surface-container-low/50 opacity-60"
                }`}
              >
                <div className="text-center shrink-0 w-12">
                  <p className="text-[10px] font-mono text-on-surface-variant">{item.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-on-surface">{item.meal}</p>
                    {!item.free && <Lock className="w-3 h-3 text-on-surface-variant" />}
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-primary font-bold">{item.cal}</span>
                  <span className="text-[10px] text-on-surface-variant"> cal</span>
                </div>
                {!item.free && (
                  <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full shrink-0">Pro</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
          className="bg-secondary/10 border border-secondary/15 rounded-lg p-5"
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-xl mt-0.5">lightbulb</span>
            <div>
              <p className="text-sm font-medium text-on-surface mb-1">Protein Tip</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
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
