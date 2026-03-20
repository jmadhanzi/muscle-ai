import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { useState } from "react";
import { Brain, Sparkles, MessageCircle, Lock } from "lucide-react";

const SAMPLE_PROMPTS = [
  "How much protein should I eat today?",
  "Best exercises for muscle preservation?",
  "Should I adjust my creatine dosage?",
  "What to eat on injection day?",
];

const ease = [0.16, 1, 0.3, 1] as const;

const AICoachPage = () => {
  const navigate = useNavigate();
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4"
      >
        <h1 className="font-headline font-bold text-2xl text-on-surface">AI Coach</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Your personal muscle preservation expert</p>
      </motion.header>

      <div className="px-5 space-y-5">
        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-primary/15 p-8 text-center"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-hero mx-auto flex items-center justify-center mb-5 shadow-[0_0_40px_hsla(160,100%,45%,0.15)]">
              <Brain className="w-10 h-10 text-on-primary" />
            </div>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
              Meet your AI coach
            </h2>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto leading-relaxed mb-6">
              Trained on clinical research for GLP-1 muscle preservation. Ask anything about your protocol.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20">
              <Lock className="w-3 h-3 text-accent-gold" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent-gold font-bold">Pro Feature</span>
            </div>
          </div>
        </motion.div>

        {/* Sample prompts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          <h3 className="font-headline font-bold text-sm text-on-surface-variant mb-3 uppercase tracking-wider">Try asking</h3>
          <div className="space-y-2">
            {SAMPLE_PROMPTS.map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}
                onClick={() => setPaywallOpen(true)}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors active:scale-[0.97] text-left"
              >
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-on-surface">{prompt}</span>
                <Sparkles className="w-3.5 h-3.5 text-accent-gold ml-auto shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Unlock CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          onClick={() => navigate("/subscribe")}
          className="w-full py-4 rounded-full gradient-hero text-on-primary font-headline font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_24px_hsla(160,100%,45%,0.2)] active:scale-[0.97] transition-transform duration-200"
        >
          Unlock AI Coach
          <span className="material-symbols-outlined text-lg">lock_open</span>
        </motion.button>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} feature="AI Coach" />
      <BottomNav />
    </div>
  );
};

export default AICoachPage;
