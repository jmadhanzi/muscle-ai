import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MuscleScoreGaugeProps {
  score: number;
  atRiskLbs: number;
  preservePct: number;
}

const MuscleScoreGauge = ({ score, atRiskLbs, preservePct }: MuscleScoreGaugeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [showTooltip, setShowTooltip] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const scoreColor = score >= 60 ? "hsl(160,100%,45%)" : score >= 40 ? "hsl(38,92%,50%)" : "hsl(0,100%,63%)";
  const scoreBg = score >= 60 ? "text-primary" : score >= 40 ? "text-accent-gold" : "text-accent-danger";

  // Animate score count
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 1800;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.round(eased * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, score]);

  // SVG arc
  const radius = 72;
  const stroke = 8;
  const cx = 90;
  const cy = 90;
  const startAngle = 135;
  const endAngle = 405;
  const totalArc = endAngle - startAngle;
  const scoreAngle = startAngle + (totalArc * (animatedScore / 100));

  const polarToCart = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const arcPath = (startA: number, endA: number, r: number) => {
    const s = polarToCart(startA, r);
    const e = polarToCart(endA, r);
    const large = endA - startA > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-border p-6">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl" style={{ background: `${scoreColor}10` }} />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Your Muscle Score</span>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-sm">help</span>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-high rounded-lg p-3 mb-4 text-xs text-on-surface-variant leading-relaxed"
        >
          Based on protein intake, exercise frequency, weeks on GLP-1, and protocol adherence. Score increases as you follow your daily protocol.
        </motion.div>
      )}

      {/* Gauge SVG */}
      <div className="flex justify-center my-2">
        <svg width="180" height="130" viewBox="0 0 180 130">
          {/* Background arc */}
          <path
            d={arcPath(startAngle, endAngle, radius)}
            fill="none"
            stroke="hsl(215,14%,15%)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d={arcPath(startAngle, Math.min(scoreAngle, endAngle), radius)}
            fill="none"
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${scoreColor}40)` }}
          />
          {/* Needle dot */}
          {inView && (
            <motion.circle
              cx={polarToCart(scoreAngle, radius).x}
              cy={polarToCart(scoreAngle, radius).y}
              r={5}
              fill={scoreColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)` }}
            />
          )}
          {/* Labels */}
          <text x="20" y="125" className="fill-on-surface-variant text-[10px] font-mono">0</text>
          <text x="152" y="125" className="fill-on-surface-variant text-[10px] font-mono">100</text>
        </svg>
      </div>

      {/* Score number */}
      <div className="text-center -mt-4 mb-4">
        <span className={`font-headline font-black text-5xl ${scoreBg}`}>{animatedScore}</span>
        <span className="text-on-surface-variant text-lg font-headline">/100</span>
      </div>

      {/* Risk / preserve stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent-danger text-base">📉</span>
          <span className="text-on-surface-variant">At risk of losing </span>
          <span className="font-mono font-bold text-accent-danger">{atRiskLbs} lbs</span>
          <span className="text-on-surface-variant"> muscle</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary text-base">💪</span>
          <span className="text-on-surface-variant">Follow protocol to preserve </span>
          <span className="font-mono font-bold text-primary">{preservePct}%</span>
        </div>
      </div>

      <p className="text-[10px] text-on-surface-variant/50 font-mono mt-3 text-center">
        Score increases each week as you complete habits
      </p>
    </div>
  );
};

export default MuscleScoreGauge;
