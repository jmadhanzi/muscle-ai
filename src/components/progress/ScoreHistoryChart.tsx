import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface ScoreHistoryChartProps {
  currentScore: number;
}

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

// Average GLP-1 user trend (declines)
const generateAvgTrend = (weeks: number) =>
  Array.from({ length: weeks }, (_, i) => ({
    week: i + 1,
    score: Math.max(20, 52 - i * 1.8 + Math.round((Math.random() - 0.5) * 3)),
  }));

const ScoreHistoryChart = ({ currentScore }: ScoreHistoryChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [history] = useState(() => generateHistory(currentScore));
  const [avgTrend] = useState(() => generateAvgTrend(history.length));

  const avgGlp1 = avgTrend[avgTrend.length - 1].score;
  const aheadPts = currentScore - avgGlp1;

  const W = 340;
  const H = 140;
  const padX = 28;
  const padY = 14;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const allScores = [...history.map((d) => d.score), ...avgTrend.map((d) => d.score)];
  const maxS = Math.max(...allScores);
  const minS = Math.min(...allScores);
  const range = maxS - minS || 1;

  const toPoint = (score: number, i: number, total: number) => ({
    x: padX + (i / (total - 1)) * chartW,
    y: padY + chartH - ((score - minS) / range) * chartH,
  });

  const makePath = (data: { score: number }[]) =>
    data.map((d, i) => {
      const p = toPoint(d.score, i, data.length);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }).join(" ");

  const userPath = makePath(history);
  const avgPath = makePath(avgTrend);
  const lastPt = toPoint(currentScore, history.length - 1, history.length);

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-headline font-bold text-lg text-on-surface">Muscle Score History</h2>
      </div>
      <p className="text-xs mb-4">
        {aheadPts > 0 ? (
          <span className="text-primary font-medium">You're {aheadPts} points ahead of average GLP-1 users</span>
        ) : (
          <span className="text-on-surface-variant">Building your score...</span>
        )}
      </p>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
          <span className="w-3 h-0.5 rounded-full bg-primary inline-block" /> Your Score
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
          <span className="w-3 h-0.5 rounded-full bg-destructive/50 inline-block" style={{ borderTop: "1px dashed" }} /> Avg GLP-1 User
        </span>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="scoreAreaGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* User area */}
        {inView && (
          <motion.path
            d={`${userPath} L ${lastPt.x} ${H - padY} L ${padX} ${H - padY} Z`}
            fill="url(#scoreAreaGrad2)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}

        {/* Average trendline */}
        {inView && (
          <motion.path
            d={avgPath}
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="5 5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {/* User line */}
        {inView && (
          <motion.path
            d={userPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
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
            cx={lastPt.x}
            cy={lastPt.y}
            r="4.5"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
            style={{ filter: "drop-shadow(0 0 6px hsla(160,100%,45%,0.6))" }}
          />
        )}

        {/* Week labels */}
        {history
          .filter((_, i) => i % 2 === 0 || i === history.length - 1)
          .map((d) => {
            const p = toPoint(d.score, d.week - 1, history.length);
            return (
              <text key={d.week} x={p.x} y={H - 2} textAnchor="middle" className="fill-on-surface-variant text-[8px] font-mono">
                W{d.week}
              </text>
            );
          })}
      </svg>
    </div>
  );
};

export default ScoreHistoryChart;
