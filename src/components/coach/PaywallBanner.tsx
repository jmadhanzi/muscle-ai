import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const PaywallBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="bg-[hsl(var(--accent-gold)/0.1)] border border-[hsl(var(--accent-gold)/0.2)] rounded-lg p-5 text-center"
    >
      <span className="material-symbols-outlined text-[hsl(var(--accent-gold))] text-2xl mb-2 block">lock</span>
      <p className="font-headline font-bold text-[hsl(var(--on-surface))] mb-1">Free messages used</p>
      <p className="text-[hsl(var(--on-surface-variant))] text-xs mb-4">
        Upgrade to Pro for unlimited AI coaching, custom workouts, and more.
      </p>
      <button
        onClick={() => navigate("/subscribe")}
        className="px-6 py-3 rounded-full gradient-hero text-[hsl(var(--on-primary))] font-headline font-bold text-sm active:scale-[0.97] transition-transform duration-200"
      >
        Unlock Unlimited Coach
      </button>
    </motion.div>
  );
};

export default PaywallBanner;
