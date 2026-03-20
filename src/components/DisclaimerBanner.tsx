import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISCLAIMER_KEY = "musclelock_disclaimer_accepted";

/** Full-screen onboarding disclaimer — shown once ever */
export const OnboardingDisclaimer = ({ onAccept }: { onAccept: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] bg-black/80 flex items-end justify-center p-4"
  >
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-container-lowest rounded-2xl border border-border p-6 max-w-md w-full space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-accent-danger text-lg">health_and_safety</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Medical Disclaimer</span>
      </div>

      <p className="text-sm text-on-surface leading-relaxed">
        MuscleLock provides <span className="font-medium text-primary">general fitness and nutrition guidance</span> for GLP-1 medication users. 
        It is <span className="font-medium">not a substitute for professional medical advice</span>, diagnosis, or treatment.
      </p>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Always consult your prescribing physician before making changes to your exercise routine, diet, or medication schedule. 
        If you experience adverse symptoms, contact your healthcare provider immediately.
      </p>

      <button
        onClick={() => {
          localStorage.setItem(DISCLAIMER_KEY, "true");
          onAccept();
        }}
        className="w-full py-3.5 rounded-full gradient-hero text-on-primary font-headline font-bold text-sm active:scale-[0.97] transition-transform"
      >
        I understand — Continue
      </button>
    </motion.div>
  </motion.div>
);

/** Compact banner for AI coach chat */
export const ChatDisclaimerBanner = () => (
  <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-surface-container-low border border-border/50 flex items-center gap-2">
    <span className="material-symbols-outlined text-on-surface-variant text-sm">info</span>
    <p className="text-[10px] text-on-surface-variant leading-snug">
      AI coach is not a substitute for medical advice. <span className="text-primary">Always consult your doctor.</span>
    </p>
  </div>
);

/** Hook to check if disclaimer has been accepted */
export const useDisclaimer = () => {
  const [accepted, setAccepted] = useState(() => localStorage.getItem(DISCLAIMER_KEY) === "true");
  return { accepted, accept: () => { localStorage.setItem(DISCLAIMER_KEY, "true"); setAccepted(true); } };
};
