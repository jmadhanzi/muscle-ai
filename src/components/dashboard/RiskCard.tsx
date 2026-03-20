import { CountUp, AnimatedProgress } from "@/components/motion/Animated";

interface RiskCardProps {
  riskScore: number;
}

const DashboardRiskCard = ({ riskScore }: RiskCardProps) => {
  const riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 50 ? "MODERATE" : "LOW";
  const riskColor = riskScore >= 70 ? "text-accent-danger" : riskScore >= 50 ? "text-accent-gold" : "text-primary";

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-accent-danger/15 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-danger/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Muscle Loss Risk</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-headline font-black text-5xl ${riskColor}`}>
              <CountUp end={riskScore} suffix="%" />
            </span>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${riskColor}`}>{riskLevel}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-accent-danger/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-accent-danger">monitor_heart</span>
        </div>
      </div>
      <AnimatedProgress value={riskScore} barClassName="gradient-danger" />
      <p className="text-on-surface-variant text-xs mt-3">
        {riskScore >= 70
          ? "Immediate intervention recommended. Follow your protocol."
          : riskScore >= 50
            ? "Moderate risk detected. Stay consistent with your protocol."
            : "Your risk is manageable. Keep up the good work."}
      </p>
    </div>
  );
};

export default DashboardRiskCard;
