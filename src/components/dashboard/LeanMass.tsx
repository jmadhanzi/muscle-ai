import { CountUp } from "@/components/motion/Animated";

interface LeanMassProps {
  lean: { leanKg: number; atRiskKg: number };
}

const DashboardLeanMass = ({ lean }: LeanMassProps) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-surface-container-low rounded-lg p-5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Lean Mass</span>
      <div className="font-headline font-bold text-3xl text-on-surface mt-1">
        <CountUp end={lean.leanKg} decimals={1} suffix="kg" />
      </div>
      <span className="text-on-surface-variant text-xs">Estimated</span>
    </div>
    <div className="bg-surface-container-low rounded-lg p-5 border border-accent-danger/10">
      <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger">At Risk</span>
      <div className="font-headline font-bold text-3xl text-accent-danger mt-1">
        <CountUp end={lean.atRiskKg} decimals={1} suffix="kg" />
      </div>
      <span className="text-on-surface-variant text-xs">Could be lost</span>
    </div>
  </div>
);

export default DashboardLeanMass;
