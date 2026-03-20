import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { DAILY_PROTOCOL } from "@/config/features";

interface ProtocolProps {
  checkedItems: Set<string>;
  completedFree: number;
  totalFree: number;
  onToggle: (id: string, free: boolean) => void;
}

const DashboardProtocol = ({ checkedItems, completedFree, totalFree, onToggle }: ProtocolProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-headline font-bold text-lg text-on-surface">Today's Protocol</h2>
      <span className="text-xs font-mono text-primary">{completedFree}/{totalFree} done</span>
    </div>
    <div className="space-y-2">
      {DAILY_PROTOCOL.map((item) => {
        const checked = checkedItems.has(item.id);
        const locked = !item.free;
        return (
          <motion.button
            key={item.id}
            onClick={() => onToggle(item.id, item.free)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 active:scale-[0.97] text-left ${
              locked
                ? "bg-surface-container-low/50 opacity-60 cursor-default"
                : checked
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-surface-container-low hover:bg-surface-container"
            }`}
            whileTap={locked ? {} : { scale: 0.97 }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                locked ? "bg-surface-variant" : checked ? "gradient-hero" : "bg-surface-container-high"
              }`}
            >
              {locked ? (
                <Lock className="w-4 h-4 text-on-surface-variant" />
              ) : checked ? (
                <span className="material-symbols-outlined text-on-primary text-lg">check</span>
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant text-lg">{item.icon}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${checked ? "text-primary line-through" : "text-on-surface"}`}>{item.label}</p>
              <p className="text-xs text-on-surface-variant truncate">{item.detail}</p>
            </div>
            {locked && (
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full">Pro</span>
            )}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default DashboardProtocol;
