import { motion } from "framer-motion";
import { CoachUserProfile } from "@/hooks/useCoachProfile";

const ease = [0.16, 1, 0.3, 1] as const;

interface StarterPromptsProps {
  userProfile?: CoachUserProfile | null;
  isPro: boolean;
  freeLimit: number;
  onSend: (text: string) => void;
}

const StarterPrompts = ({ userProfile, isPro, freeLimit, onSend }: StarterPromptsProps) => {
  const proteinTarget = userProfile?.currentWeight
    ? Math.round((userProfile.currentWeight * (userProfile.weightUnit === "lbs" ? 0.4536 : 1)) * 1.2)
    : null;

  const muscleScore = 62; // placeholder until real score is available

  const prompts = [
    { icon: "💬", text: "What should I eat on injection day?" },
    { icon: "💪", text: "I'm nauseated — can I still train?" },
    { icon: "🥩", text: proteinTarget ? `How do I hit ${proteinTarget}g protein with a suppressed appetite?` : "How do I hit my protein target with a suppressed appetite?" },
    { icon: "📊", text: `Why is my muscle score only ${muscleScore}?` },
    { icon: "😴", text: "I'm exhausted this week — what do I do?" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease }}
     className="flex flex-col items-center justify-center h-full text-center px-4 pt-[calc(6rem+env(safe-area-inset-top))]"
    >
      <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mb-5 shadow-[0_0_40px_hsla(160,100%,45%,0.12)]">
        <span className="material-symbols-outlined text-[hsl(var(--on-primary))] text-3xl">psychology</span>
      </div>
      <h2 className="font-headline font-bold text-lg text-[hsl(var(--on-surface))] mb-1.5">Ask me anything</h2>
      <p className="text-[hsl(var(--on-surface-variant))] text-sm max-w-[260px] leading-relaxed mb-2">
        Trained on clinical research for GLP-1 muscle preservation protocols.
      </p>
      <p className="text-xs font-mono text-[hsl(var(--primary))] mb-8">
        {isPro ? "Unlimited messages" : `${freeLimit} free messages · Unlimited with Pro`}
      </p>

      <div className="w-full max-w-sm space-y-2">
        {prompts.map((prompt, i) => (
          <motion.button
            key={prompt.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}
            onClick={() => onSend(prompt.text)}
            className="w-full flex items-center gap-3 p-3.5 rounded-lg bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container))] transition-colors active:scale-[0.97] text-left"
          >
            <span className="text-base shrink-0">{prompt.icon}</span>
            <span className="text-sm text-[hsl(var(--on-surface))]">{prompt.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default StarterPrompts;
