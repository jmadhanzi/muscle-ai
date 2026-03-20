import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

interface WeeklyStreakRingProps {
  completedDays: boolean[]; // Mon–Sun, 7 items
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const WeeklyStreakRing = ({ completedDays }: WeeklyStreakRingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const completedCount = completedDays.filter(Boolean).length;
  const cx = 60;
  const cy = 60;
  const r = 48;
  const segGap = 4; // degrees gap between segments
  const totalGap = segGap * 7;
  const segArc = (360 - totalGap) / 7;

  const segments = useMemo(() => {
    return DAYS.map((label, i) => {
      const startAngle = -90 + i * (segArc + segGap);
      const endAngle = startAngle + segArc;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const large = segArc > 180 ? 1 : 0;
      const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
      // Label position at midpoint
      const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
      const lx = cx + (r + 14) * Math.cos(midAngle);
      const ly = cy + (r + 14) * Math.sin(midAngle);
      return { d, label, completed: completedDays[i], lx, ly, i };
    });
  }, [completedDays]);

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Weekly Streak</span>
        <span className="font-mono text-sm font-bold text-primary">{completedCount}/7</span>
      </div>

      <div className="flex justify-center">
        <svg width="140" height="140" viewBox="0 0 120 120">
          {segments.map((seg) => (
            <motion.path
              key={seg.i}
              d={seg.d}
              fill="none"
              stroke={seg.completed ? "hsl(160,100%,45%)" : "hsl(215,14%,15%)"}
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                delay: 0.1 + seg.i * 0.08,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              style={seg.completed ? { filter: "drop-shadow(0 0 4px hsla(160,100%,45%,0.4))" } : {}}
            />
          ))}

          {/* Center text */}
          <text x={cx} y={cy - 4} textAnchor="middle" className="fill-on-surface font-headline text-xl font-bold">
            {completedCount}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="fill-on-surface-variant text-[8px] font-mono uppercase">
            days
          </text>

          {/* Day labels */}
          {segments.map((seg) => (
            <text
              key={`label-${seg.i}`}
              x={seg.lx}
              y={seg.ly}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-[7px] font-mono ${seg.completed ? "fill-primary" : "fill-on-surface-variant"}`}
            >
              {seg.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WeeklyStreakRing;
