import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { PRO_FEATURES } from "@/config/features";

const DashboardProTeaser = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-headline font-bold text-lg text-on-surface">Pro Features</h2>
        <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full">
          Locked
        </span>
      </div>
      <div className="space-y-2">
        {PRO_FEATURES.slice(0, 4).map((feat) => (
          <button
            key={feat.id}
            onClick={() => navigate("/subscribe")}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-surface-container-low/50 opacity-60 text-left active:scale-[0.97] transition-transform duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface">{feat.label}</p>
              <p className="text-xs text-on-surface-variant truncate">{feat.description}</p>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full shrink-0">
              Pro
            </span>
          </button>
        ))}
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full text-center text-xs font-mono text-primary py-2 active:scale-[0.97] transition-transform"
        >
          View all {PRO_FEATURES.length} Pro features →
        </button>
      </div>
    </div>
  );
};

export default DashboardProTeaser;
