import { motion } from "framer-motion";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-start gap-2"
  >
    <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-[hsl(var(--on-primary))] text-sm">psychology</span>
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[hsl(var(--surface-container-low))] rounded-bl-md border-l-2 border-[hsl(var(--accent-purple))]">
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--on-surface-variant))] animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--on-surface-variant))] animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--on-surface-variant))] animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-[10px] text-[hsl(var(--on-surface-variant)/0.5)] font-mono ml-1">
        MuscleLock AI is thinking…
      </span>
    </div>
  </motion.div>
);

export default TypingIndicator;
