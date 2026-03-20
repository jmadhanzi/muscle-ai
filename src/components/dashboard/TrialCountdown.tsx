import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

interface TrialCountdownProps {
  subscriptionEnd: string | null;
  referredBy: string | null | undefined;
}

const TrialCountdown = ({ subscriptionEnd, referredBy }: TrialCountdownProps) => {
  const navigate = useNavigate();

  const daysLeft = useMemo(() => {
    if (!subscriptionEnd) return null;
    const end = new Date(subscriptionEnd);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [subscriptionEnd]);

  // Only show for referred users with an active trial
  if (!referredBy || daysLeft === null || daysLeft <= 0) return null;

  const urgency = daysLeft <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease }}
      className={`rounded-lg p-4 flex items-center gap-3 border ${
        urgency
          ? "bg-accent-danger/10 border-accent-danger/20"
          : "bg-primary/10 border-primary/20"
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        urgency ? "bg-accent-danger/15" : "bg-primary/15"
      }`}>
        {urgency ? (
          <Clock className="w-5 h-5 text-accent-danger" />
        ) : (
          <Sparkles className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-headline font-bold ${urgency ? "text-accent-danger" : "text-primary"}`}>
          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left on your free trial
        </p>
        <p className="text-[10px] font-mono text-on-surface-variant mt-0.5">
          {urgency
            ? "Subscribe now to keep full access"
            : "Enjoy full Pro access — workouts, AI coach & more"}
        </p>
      </div>

      {urgency && (
        <button
          onClick={() => navigate("/subscribe")}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg gradient-hero text-on-primary text-xs font-bold active:scale-[0.97] transition-transform"
        >
          Upgrade
        </button>
      )}
    </motion.div>
  );
};

export default TrialCountdown;
