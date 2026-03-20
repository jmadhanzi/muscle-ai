import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { CountUp, AnimatedProgress } from "@/components/motion/Animated";
import { Lock, TrendingUp, TrendingDown } from "lucide-react";

const METRICS = [
  { label: "Body Weight", value: 78.2, unit: "kg", change: -1.3, trend: "down" as const, free: true },
  { label: "Lean Mass Est.", value: 58.6, unit: "kg", change: -0.2, trend: "down" as const, free: true },
  { label: "Strength Index", value: 74, unit: "/100", change: +2, trend: "up" as const, free: false },
  { label: "Protocol Score", value: 86, unit: "%", change: +5, trend: "up" as const, free: false },
];

const WEEKLY_ADHERENCE = [
  { day: "Mon", pct: 100 },
  { day: "Tue", pct: 80 },
  { day: "Wed", pct: 100 },
  { day: "Thu", pct: 60 },
  { day: "Fri", pct: 100 },
  { day: "Sat", pct: 40 },
  { day: "Sun", pct: 0 },
];

const ease = [0.16, 1, 0.3, 1] as const;

const ProgressPage = () => {
  const paywall = usePaywall();
  const { isPro } = useAuth();

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">Progress</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Track your muscle preservation journey</p>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map((m, i) => {
            const unlocked = isPro || m.free;
            return (
              <motion.button
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                onClick={() => !unlocked && paywall.fire("analytics_tap")}
                className={`relative rounded-lg p-5 text-left active:scale-[0.97] transition-all duration-200 ${
                  unlocked ? "bg-surface-container-lowest border border-border" : "bg-surface-container-low/50 opacity-60 border border-transparent"
                }`}
              >
                {!unlocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-3 h-3 text-on-surface-variant" />
                  </div>
                )}
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">{m.label}</span>
                <div className="font-headline font-bold text-2xl text-on-surface mt-1">
                  {unlocked ? <CountUp end={m.value} decimals={1} /> : "—"}
                  <span className="text-sm font-normal text-on-surface-variant">{m.unit}</span>
                </div>
                {unlocked && (
                  <div className={`flex items-center gap-1 mt-1 text-xs font-mono ${m.trend === "up" ? "text-primary" : "text-accent-danger"}`}>
                    {m.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.change > 0 ? "+" : ""}{m.change}
                    <span className="text-on-surface-variant">this week</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Weekly Adherence */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Weekly Adherence</h2>
          <div className="bg-surface-container-lowest rounded-lg p-5 border border-border">
            <div className="flex items-end justify-between gap-2 h-28 mb-3">
              {WEEKLY_ADHERENCE.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-sm gradient-hero"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(d.pct, 4)}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease }}
                    style={{ opacity: d.pct === 0 ? 0.15 : 1 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {WEEKLY_ADHERENCE.map((d) => (
                <span key={d.day} className="flex-1 text-center text-[10px] font-mono text-on-surface-variant">{d.day}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="bg-surface-container-lowest rounded-lg p-5 border border-primary/15 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined material-filled text-primary text-2xl">local_fire_department</span>
          </div>
          <div>
            <div className="font-headline font-bold text-3xl text-on-surface">
              <CountUp end={5} /> day streak
            </div>
            <p className="text-on-surface-variant text-xs">Keep going — consistency preserves muscle</p>
          </div>
        </motion.div>

        {/* Muscle preservation score */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="bg-surface-container-lowest rounded-lg p-5 border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Muscle Preservation Score</span>
            <span className="font-headline font-bold text-2xl text-primary"><CountUp end={72} suffix="%" /></span>
          </div>
          <AnimatedProgress value={72} barClassName="gradient-hero" />
          <p className="text-xs text-on-surface-variant mt-2">Based on your protocol adherence and activity data</p>
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

export default ProgressPage;
