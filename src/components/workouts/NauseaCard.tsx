import { motion } from "framer-motion";
import { NAUSEA_PROTOCOL } from "@/data/workoutProgram";

const ease = [0.16, 1, 0.3, 1] as const;

interface NauseaCardProps {
  onStart: () => void;
}

const NauseaCard = ({ onStart }: NauseaCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="rounded-lg bg-[hsl(var(--accent-gold)/0.06)] border border-[hsl(var(--accent-gold)/0.15)] p-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤢</span>
        <div className="flex-1">
          <p className="font-headline font-bold text-sm text-[hsl(var(--on-surface))] mb-0.5">
            Having a rough GLP-1 day?
          </p>
          <p className="text-xs text-[hsl(var(--on-surface-variant))] leading-relaxed mb-3">
            {NAUSEA_PROTOCOL.duration}-minute seated-only resistance routine. Even this counts — muscle needs the signal.
          </p>
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--accent-gold)/0.15)] text-[hsl(var(--accent-gold))] text-xs font-bold hover:bg-[hsl(var(--accent-gold)/0.2)] transition-colors active:scale-[0.97]"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Launch Nausea Protocol
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NauseaCard;
