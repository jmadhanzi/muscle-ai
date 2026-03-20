import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { AI_COACH_FREE_LIMIT } from "@/config/features";

const PREVIEW_RESPONSE = `On injection day, focus on high-protein, easy-to-digest meals. Start with a protein shake 30 minutes before your injection window. Greek yogurt with berries makes an excellent...`;

const AICoachTeaser = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-border overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
              <Brain className="w-4 h-4 text-on-primary" />
            </div>
            <h2 className="font-headline font-bold text-base text-on-surface">Ask MuscleLock AI</h2>
          </div>
          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {AI_COACH_FREE_LIMIT} free questions
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        {/* Sample question */}
        <div className="bg-surface-container-low rounded-lg p-3 mb-3">
          <p className="text-xs text-on-surface-variant mb-2">💬 "What should I eat on injection day?"</p>
          {/* Blurred preview */}
          <div className="relative">
            <p className="text-xs text-on-surface leading-relaxed">
              {PREVIEW_RESPONSE.slice(0, 120)}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-container-low to-transparent" />
          </div>
        </div>

        <button
          onClick={() => navigate("/coach")}
          className="w-full py-3 rounded-lg gradient-hero text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-[0_4px_16px_hsla(160,100%,45%,0.15)]"
        >
          Start Chatting
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default AICoachTeaser;
