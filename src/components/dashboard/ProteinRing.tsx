import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ProteinRingProps {
  target: number;
  current: number;
  onAdd: (amount: number) => void;
}

const QUICK_ADD = [20, 30, 50];

const ProteinRing = ({ target, current, onAdd }: ProteinRingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const pct = Math.min(current / target, 1);
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  const color = pct >= 1 ? "hsl(160,100%,45%)" : pct >= 0.6 ? "hsl(160,100%,45%)" : "hsl(38,92%,50%)";

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Protein Today</span>

      <div className="flex items-center gap-5 mt-3">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50" cy="50" r={r}
              fill="none" stroke="hsl(215,14%,15%)" strokeWidth="6"
            />
            <motion.circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={inView ? { strokeDashoffset: offset } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-lg text-on-surface">{current}</span>
            <span className="text-[9px] font-mono text-on-surface-variant">/{target}g</span>
          </div>
        </div>

        {/* Quick add */}
        <div className="flex-1 space-y-2">
          <p className="text-xs text-on-surface-variant mb-2">Quick add</p>
          <div className="flex gap-2">
            {QUICK_ADD.map((amt) => (
              <motion.button
                key={amt}
                onClick={() => addProtein(amt)}
                whileTap={{ scale: 0.92 }}
                className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-mono text-sm font-bold hover:bg-surface-container-highest transition-colors active:scale-[0.95]"
              >
                +{amt}g
              </motion.button>
            ))}
          </div>
          {pct >= 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-medium text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Target hit!
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProteinRing;
