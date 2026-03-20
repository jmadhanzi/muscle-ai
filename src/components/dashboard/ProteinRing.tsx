import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ProteinRingProps {
  target: number;
  current: number;
  onAdd: (amount: number) => void;
}

const QUICK_ADD = [20, 30, 50];

const ProteinRing = ({ target, current, onAdd }: ProteinRingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [justHitGoal, setJustHitGoal] = useState(false);
  const [prevPct, setPrevPct] = useState(0);

  const pct = Math.min(current / target, 1);
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  const color = pct >= 1 ? "hsl(160,100%,45%)" : pct >= 0.6 ? "hsl(160,100%,45%)" : "hsl(38,92%,50%)";

  const handleAdd = (amt: number) => {
    const newTotal = current + amt;
    const wasBelow = current < target;
    onAdd(amt);

    if (wasBelow && newTotal >= target) {
      setJustHitGoal(true);
      toast.success("🎯 Protein goal reached!", { duration: 3000 });
      setTimeout(() => setJustHitGoal(false), 2000);
    }
  };

  // Particle burst on goal hit
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = 40 + Math.random() * 20;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.1,
    };
  });

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-lg border border-border p-5 relative overflow-hidden">
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
              animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-lg text-on-surface tabular-nums">{current}</span>
            <span className="text-[9px] font-mono text-on-surface-variant">/{target}g</span>
          </div>

          {/* Goal hit particles */}
          <AnimatePresence>
            {justHitGoal && (
              <>
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ left: "50%", top: "50%", marginLeft: -3, marginTop: -3 }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
                  />
                ))}
                {/* Flash */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  initial={{ opacity: 0.4, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.5 }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Quick add */}
        <div className="flex-1 space-y-2">
          <p className="text-xs text-on-surface-variant mb-2">Quick add</p>
          <div className="flex gap-2">
            {QUICK_ADD.map((amt) => (
              <motion.button
                key={amt}
                onClick={() => handleAdd(amt)}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-mono text-sm font-bold hover:bg-surface-container-highest transition-colors"
              >
                +{amt}g
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {pct >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-primary flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Target hit!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProteinRing;
