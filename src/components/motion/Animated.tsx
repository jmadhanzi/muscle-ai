import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { springProgress } from "./PageTransition";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export const CountUp = ({ end, duration = 1.5, suffix = "", prefix = "", decimals = 0, className }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * end * Math.pow(10, decimals)) / Math.pow(10, decimals));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </span>
  );
};

interface AnimatedProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export const AnimatedProgress = ({ value, className = "", barClassName = "" }: AnimatedProgressProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`w-full bg-surface-variant h-1.5 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${barClassName}`}
        initial={{ width: "0%" }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={springProgress}
      />
    </div>
  );
};

export const AhaFlash = ({ trigger, children }: { trigger: boolean; children: React.ReactNode }) => (
  <motion.div
    animate={trigger ? {
      scale: [1, 1.05, 0.98, 1],
      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
    } : {}}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
