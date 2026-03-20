import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MuscleScoreGaugeProps {
  score: number;
  atRiskLbs: number;
  preservePct: number;
}

// Dramatic easing: slow start, pause in middle, rush to final number
const dramaticEase = (t: number): number => {
  if (t < 0.3) return t * 0.5; // slow crawl
  if (t < 0.55) return 0.15 + (t - 0.3) * 0.2; // pause zone
  // rush to end
  const remaining = (t - 0.55) / 0.45;
  return 0.2 + 0.8 * (1 - Math.pow(1 - remaining, 3));
};

const scoreToColor = (s: number): string => {
  if (s <= 30) return "hsl(0, 100%, 63%)";
  if (s <= 50) return `hsl(${Math.round(0 + ((s - 30) / 20) * 38)}, 92%, ${50 + ((s - 30) / 20) * 3}%)`;
  if (s <= 70) return `hsl(${Math.round(38 + ((s - 50) / 20) * 80)}, ${Math.round(92 + ((s - 50) / 20) * 8)}%, ${Math.round(50 - ((s - 50) / 20) * 5)}%)`;
  return "hsl(160, 100%, 45%)";
};

const MuscleScoreGauge = ({ score, atRiskLbs, preservePct }: MuscleScoreGaugeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [showTooltip, setShowTooltip] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const currentColor = scoreToColor(animatedScore);
  const scoreBg = animatedScore >= 60 ? "text-primary" : animatedScore >= 40 ? "text-accent-gold" : "text-accent-danger";

  // Dramatic count-up
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 1500;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = dramaticEase(p);
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

  // Gradient arc using multiple segments
  const arcSegments = [];
  const segCount = Math.max(1, Math.round(animatedScore / 2));
  for (let i = 0; i < segCount; i++) {
    const segStart = startAngle + (totalArc * (i / 100) * (score / segCount * (i + 1) / score));
    // simplified: just use one gradient path
  }

  return (
    <div ref={ref} className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-border p-6">
      {/* Background glow that shifts color */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl"
        animate={{ background: `${currentColor}10` }}
        transition={{ duration: 0.1 }}
      />

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
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 100%, 63%)" />
              <stop offset="40%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(160, 100%, 45%)" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={arcPath(startAngle, endAngle, radius)}
            fill="none"
            stroke="hsl(215,14%,15%)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Score arc with gradient */}
          {inView && animatedScore > 0 && (
            <path
              d={arcPath(startAngle, Math.min(scoreAngle, endAngle), radius)}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${currentColor}40)` }}
            />
          )}
          {/* Needle dot */}
          {inView && animatedScore > 0 && (
            <motion.circle
              cx={polarToCart(scoreAngle, radius).x}
              cy={polarToCart(scoreAngle, radius).y}
              r={5}
              fill={currentColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}
              style={{ filter: `drop-shadow(0 0 6px ${currentColor}80)` }}
            />
          )}
          {/* Labels */}
          <text x="20" y="125" className="fill-on-surface-variant text-[10px] font-mono">0</text>
          <text x="152" y="125" className="fill-on-surface-variant text-[10px] font-mono">100</text>
        </svg>
      </div>

      {/* Score number */}
      <div className="text-center -mt-4 mb-4">
        <span className={`font-mono font-black text-5xl tabular-nums ${scoreBg}`}>{animatedScore}</span>
        <span className="text-on-surface-variant text-lg font-headline">/100</span>
      </div>

      {/* Risk / preserve stats */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.4 }}
          className="flex items-center gap-2 text-sm"
        >
          <span className="text-accent-danger text-base">📉</span>
          <span className="text-on-surface-variant">At risk of losing </span>
          <span className="font-mono font-bold text-accent-danger">{atRiskLbs} lbs</span>
          <span className="text-on-surface-variant"> muscle</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="flex items-center gap-2 text-sm"
        >
          <span className="text-primary text-base">💪</span>
          <span className="text-on-surface-variant">Follow protocol to preserve </span>
          <span className="font-mono font-bold text-primary">{preservePct}%</span>
        </motion.div>
      </div>

      <p className="text-[10px] text-on-surface-variant/50 font-mono mt-3 text-center">
        Score increases each week as you complete habits
      </p>
    </div>
  );
};

export default MuscleScoreGauge;
