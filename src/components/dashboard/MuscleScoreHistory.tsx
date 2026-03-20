import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface MuscleScoreHistoryProps {
  currentScore: number;
}

// Simulated historical data — in production this comes from DB
const generateHistory = (current: number) => {
  const weeks = 8;
  const data: { week: number; score: number }[] = [];
  for (let i = 0; i < weeks; i++) {
    const base = Math.max(20, current - (weeks - i) * 4 + Math.round((Math.random() - 0.3) * 6));
    data.push({ week: i + 1, score: Math.min(100, base) });
  }
  data.push({ week: weeks + 1, score: current });
  return data;
};

const MuscleScoreHistory = ({ currentScore }: MuscleScoreHistoryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [history] = useState(() => generateHistory(currentScore));

  const avgGlp1 = 38; // average GLP-1 user score
  const aheadPct = Math.round(((currentScore - avgGlp1) / avgGlp1) * 100);

  // Chart dimensions
  const W = 320;
  const H = 120;
  const padX = 24;
  const padY = 12;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const maxScore = Math.max(...history.map((d) => d.score), 80);
  const minScore = Math.min(...history.map((d) => d.score), 20);
  const range = maxScore - minScore || 1;

  const points = history.map((d, i) => {
    const x = padX + (i / (history.length - 1)) * chartW;
    const y = padY + chartH - ((d.score - minScore) / range) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

  // Target line Y
  const targetScore = Math.min(currentScore + 12, 95);
  const targetY = padY + chartH - ((targetScore - minScore) / range) * chartH;

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Score History</span>
          <p className="text-primary text-xs font-medium mt-0.5">
            {aheadPct > 0 ? `You're ${aheadPct}% ahead of average GLP-1 users` : "Building your score..."}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded-full bg-primary inline-block" /> Yours
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded-full bg-primary/30 inline-block border border-dashed border-primary/40" /> Target
          </span>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Gradient fill */}
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(160,100%,45%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(160,100%,45%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Target line */}
        <line
          x1={padX}
          y1={targetY}
          x2={W - padX}
          y2={targetY}
          stroke="hsl(160,100%,45%)"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Area fill */}
        {inView && (
          <motion.path
            d={areaPath}
            fill="url(#scoreGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        )}

        {/* Line */}
        {inView && (
          <motion.path
            d={linePath}
            fill="none"
            stroke="hsl(160,100%,45%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 6px hsla(160,100%,45%,0.4))" }}
          />
        )}

        {/* Current point */}
        {inView && (
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill="hsl(160,100%,45%)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
            style={{ filter: "drop-shadow(0 0 6px hsla(160,100%,45%,0.6))" }}
          />
        )}

        {/* Week labels */}
        {points.filter((_, i) => i % 2 === 0 || i === points.length - 1).map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 2}
            textAnchor="middle"
            className="fill-on-surface-variant text-[8px] font-mono"
          >
            W{history[points.indexOf(p)]?.week || i + 1}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default MuscleScoreHistory;
