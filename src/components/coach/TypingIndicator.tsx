import { motion } from "framer-motion";

const dotVariants = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: (i: number) => ({
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: i * 0.15,
      ease: "easeInOut" as const,
    },
  }),
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    style={{ transformOrigin: "bottom left" }}
    className="flex items-start gap-2"
  >
    <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-[hsl(var(--on-primary))] text-sm">psychology</span>
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[hsl(var(--surface-container-low))] rounded-bl-md border-l-2 border-[hsl(var(--accent-purple))]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--on-surface-variant))]"
          />
        ))}
      </div>
      <span className="text-[10px] text-[hsl(var(--on-surface-variant)/0.5)] font-mono ml-1">
        MuscleLock AI is thinking…
      </span>
    </div>
  </motion.div>
);

export default TypingIndicator;
