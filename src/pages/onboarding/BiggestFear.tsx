import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "input" | "thinking" | "response" | "achievement";

const THINKING_MESSAGES = [
  "Analyzing your profile...",
  "Building your protocol...",
  "Personalizing your plan...",
];

/* ── Particle burst component ── */
const Particles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const distance = 80 + Math.random() * 180;
    const size = 3 + Math.random() * 5;
    const delay = Math.random() * 0.3;
    return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, size, delay };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 1.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
};

/* ── Letter-by-letter text ── */
const LetterReveal = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

/* ── Progress ring ── */
const ProgressRing = ({ progress }: { progress: number }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
      <circle cx="64" cy="64" r={r} fill="none" stroke="hsla(160,100%,45%,0.1)" strokeWidth="6" />
      <motion.circle
        cx="64" cy="64" r={r} fill="none"
        stroke="hsl(160,100%,45%)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

const BiggestFear = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fear, setFear] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [aiResponse, setAiResponse] = useState("");
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("biggest_fear, first_name")
        .eq("user_id", user.id)
        .single();
      if (data?.biggest_fear) setFear(data.biggest_fear);
      if (data?.first_name) setFirstName(data.first_name);
    };
    load();
  }, [user]);

  // Cycle thinking messages
  useEffect(() => {
    if (phase !== "thinking") return;
    const iv = setInterval(() => setThinkingIndex((p) => (p + 1) % THINKING_MESSAGES.length), 600);
    return () => clearInterval(iv);
  }, [phase]);

  const handleSubmit = useCallback(async () => {
    if (!user || !fear.trim()) return;
    setSaving(true);

    // Save fear
    await supabase.from("profiles").update({ biggest_fear: fear.trim().slice(0, 100) }).eq("user_id", user.id);

    // Enter thinking phase
    setPhase("thinking");

    // Call AI for personalized response
    try {
      const { data, error } = await supabase.functions.invoke("onboarding-response", {
        body: { name: firstName, fear: fear.trim() },
      });

      // Ensure at least 1.5s of thinking animation
      await new Promise((r) => setTimeout(r, 1500));

      if (error) throw error;
      setAiResponse(data?.response || `${firstName || "Friend"}, we hear you. That's exactly why MuscleLock was built. Your 10-week protocol starts now.`);
    } catch {
      setAiResponse(`${firstName || "Friend"}, we hear you. That's exactly why MuscleLock was built. Your 10-week protocol starts now.`);
    }

    setPhase("response");
    setSaving(false);
  }, [user, fear, firstName]);

  const handleAchievement = useCallback(async () => {
    if (!user) return;
    // Mark onboarding complete
    await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
    setPhase("achievement");
  }, [user]);

  const handleFinish = () => navigate("/dashboard");

  /* ── ACHIEVEMENT FULL-SCREEN ── */
  if (phase === "achievement") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
        <Particles />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Progress ring with lock */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <ProgressRing progress={1} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="material-symbols-outlined material-filled text-primary text-5xl">lock</span>
            </motion.div>
          </motion.div>

          {/* Name reveal */}
          <div className="mb-3">
            <LetterReveal
              text={firstName || "Champion"}
              className="font-headline font-black text-5xl md:text-6xl text-primary"
              delay={1.5}
            />
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight mb-12 uppercase"
          >
            Your MuscleLock Profile Is Ready
          </motion.h1>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleFinish}
            className="w-full max-w-sm py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.3)] active:scale-95 transition-transform duration-200"
          >
            See My Results
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="mt-6 text-sm text-on-surface-variant/60"
          >
            Join 47,832 people protecting their muscle
          </motion.p>
        </div>

        {/* Ambient glows */}
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[15%] right-[5%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    );
  }

  /* ── THINKING PHASE ── */
  if (phase === "thinking") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          {/* Pulsing lock icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center"
          >
            <span className="material-symbols-outlined material-filled text-primary text-4xl">psychology</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={thinkingIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-on-surface-variant font-mono text-sm tracking-wide"
            >
              {THINKING_MESSAGES[thinkingIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ── RESPONSE PHASE ── */
  if (phase === "response") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full"
        >
          <div className="bg-surface-container-low rounded-2xl p-8 border border-primary/20 shadow-[0_0_40px_hsla(160,100%,45%,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-xl">smart_toy</span>
              </div>
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">MuscleLock AI</span>
            </div>

            <p className="text-on-surface text-lg leading-relaxed font-body">
              {aiResponse}
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={handleAchievement}
            className="mt-8 w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200"
          >
            Let's go
            <span className="material-symbols-outlined">rocket_launch</span>
          </motion.button>
        </motion.div>

        {/* Ambient */}
        <div className="absolute top-[25%] right-[-5%] w-[35%] h-[35%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    );
  }

  /* ── INPUT PHASE (default) ── */
  return (
    <OnboardingLayout
      step={8}
      totalSteps={8}
      footer={
        <button
          onClick={handleSubmit}
          disabled={!fear.trim() || saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Processing..." : "Complete my profile"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.05] tracking-tight mb-4">
          One last thing{firstName ? `, ${firstName}` : ""}...
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          What's your biggest fear about this medication journey?
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <textarea
          className="w-full bg-surface-container-lowest border-2 border-transparent rounded-2xl px-6 py-5 text-lg font-body text-on-surface focus:border-primary/40 focus:ring-0 placeholder:text-surface-variant transition-all outline-none resize-none"
          rows={4}
          maxLength={100}
          placeholder="e.g., 'I don't want to look deflated when I reach my goal'"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          autoFocus
        />
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-xs text-on-surface-variant/50">Be honest — this shapes your protocol.</p>
          <p className="text-xs text-on-surface-variant font-mono">{fear.length}/100</p>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default BiggestFear;
