import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface BodyCompositionChartProps {
  currentWeight: number;
  goalWeight: number;
  muscleScore: number;
  weightUnit: string;
  weeksOnMedication: number;
}

interface WeekData {
  week: number;
  totalWeight: number;
  muscleMass: number;
  fatMass: number;
}

const generateBodyCompData = (
  currentWeight: number,
  goalWeight: number,
  muscleScore: number,
  weeks: number
): WeekData[] => {
  const data: WeekData[] = [];
  const totalWeeks = Math.max(4, Math.min(weeks, 12));
  const startWeight = currentWeight + (currentWeight - goalWeight) * 0.3;
  const muscleRatio = 0.35 + muscleScore * 0.002;

  for (let i = 0; i <= totalWeeks; i++) {
    const progress = i / totalWeeks;
    const weight = startWeight - (startWeight - currentWeight) * progress;
    const fatLoss = (startWeight - weight) * (0.55 + muscleScore * 0.003);
    const muscleLoss = (startWeight - weight) - fatLoss;
    const startMuscle = startWeight * muscleRatio;
    data.push({
      week: i,
      totalWeight: Math.round(weight * 10) / 10,
      muscleMass: Math.round((startMuscle - muscleLoss) * 10) / 10,
      fatMass: Math.round((weight - (startMuscle - muscleLoss)) * 10) / 10,
    });
  }
  return data;
};

const BodyCompositionChart = ({
  currentWeight, goalWeight, muscleScore, weightUnit, weeksOnMedication,
}: BodyCompositionChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [data] = useState(() =>
    generateBodyCompData(currentWeight, goalWeight, muscleScore, weeksOnMedication || 8)
  );

  const W = 340;
  const H = 160;
  const padX = 28;
  const padY = 16;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const allValues = data.flatMap((d) => [d.totalWeight, d.muscleMass, d.fatMass]);
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);
  const range = maxVal - minVal || 1;

  const toPoint = (val: number, i: number) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - ((val - minVal) / range) * chartH,
  });

  const makePath = (values: number[]) =>
    values.map((v, i) => {
      const p = toPoint(v, i);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }).join(" ");

  const lines = [
    { key: "weight", values: data.map((d) => d.totalWeight), color: "hsl(var(--secondary))", label: "Total Weight" },
    { key: "muscle", values: data.map((d) => d.muscleMass), color: "hsl(var(--primary))", label: "Muscle Mass" },
    { key: "fat", values: data.map((d) => d.fatMass), color: "hsl(var(--accent-gold))", label: "Fat Mass" },
  ];

  const preservePct = data.length > 1
    ? Math.round((data[data.length - 1].muscleMass / data[0].muscleMass) * 100)
    : 100;

  const selected = selectedWeek !== null ? data[selectedWeek] : null;

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-headline font-bold text-lg text-on-surface">Body Composition</h2>
        <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {preservePct}% muscle preserved
        </span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        {lines.map((l) => (
          <span key={l.key} className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      {selected && (
        <div className="bg-surface-container-high rounded-md p-2.5 mb-2 text-xs font-mono text-on-surface-variant">
          <span className="text-on-surface font-medium">Week {selected.week}</span>
          {" · "}Muscle preserved {Math.round((selected.muscleMass / data[0].muscleMass) * 100)}%
          {" · "}Score: {muscleScore}/100
        </div>
      )}

      {/* Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="muscleAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Muscle area fill */}
        {inView && (
          <motion.path
            d={`${makePath(lines[1].values)} L ${toPoint(0, data.length - 1).x} ${H - padY} L ${padX} ${H - padY} Z`}
            fill="url(#muscleAreaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}

        {/* Lines */}
        {lines.map((line, li) =>
          inView ? (
            <motion.path
              key={line.key}
              d={makePath(line.values)}
              fill="none"
              stroke={line.color}
              strokeWidth={line.key === "muscle" ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.2 + li * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={line.key === "muscle" ? { filter: "drop-shadow(0 0 6px hsla(160,100%,45%,0.4))" } : undefined}
            />
          ) : null
        )}

        {/* Interactive dots */}
        {inView &&
          data.map((d, i) => {
            const p = toPoint(d.muscleMass, i);
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={selectedWeek === i ? 5 : 3}
                fill={selectedWeek === i ? "hsl(var(--primary))" : "transparent"}
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                className="cursor-pointer"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05, type: "spring", stiffness: 300 }}
                onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
              />
            );
          })}

        {/* Week labels */}
        {data
          .filter((_, i) => i % 2 === 0 || i === data.length - 1)
          .map((d) => {
            const p = toPoint(d.totalWeight, d.week);
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

export default BodyCompositionChart;
