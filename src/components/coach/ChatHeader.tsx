import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

interface ChatHeaderProps {
  isPro: boolean;
  isLimitReached: boolean;
  userMessageCount: number;
  freeLimit: number;
  hasMessages: boolean;
  medication?: string;
  onClear: () => void;
}

const ChatHeader = ({
  isPro, isLimitReached, userMessageCount, freeLimit,
  hasMessages, medication, onClear,
}: ChatHeaderProps) => {
  const navigate = useNavigate();
  const drugLabel = medication || "GLP-1";

  // Scroll to top when tab becomes active
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="shrink-0 px-4 pt-14 pb-2"
    >
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--surface-container))] transition-colors active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[hsl(var(--on-surface-variant))]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center">
            <span className="material-symbols-outlined text-[hsl(var(--on-primary))] text-base">psychology</span>
          </div>
          <span className="font-headline font-bold text-base text-[hsl(var(--on-surface))]">
            MuscleLock AI Coach
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isPro && (
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest ${
              isLimitReached
                ? "bg-[hsl(var(--accent-danger)/0.1)] text-[hsl(var(--accent-danger))]"
                : "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
            }`}>
              {userMessageCount}/{freeLimit}
            </div>
          )}
          {isPro && (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
              Pro
            </div>
          )}
          {hasMessages && (
            <button
              onClick={onClear}
              className="p-2 rounded-lg hover:bg-[hsl(var(--surface-container))] transition-colors active:scale-95"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-[hsl(var(--on-surface-variant))]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-[hsl(var(--on-surface-variant))]">
        <span>Specialized for {drugLabel} users</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
          Online — responds in seconds
        </span>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
