import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Animated counter hook
function useCounter(target: number, duration = 1600, delay = 800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return count;
}

function useSocialCounter(target: number, duration = 2000, delay = 2400) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return count.toLocaleString();
}

// Body silhouette SVG with muscle loss animation
const BodySilhouette = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="flex gap-8 md:gap-16 items-end justify-center py-4">
      {/* Before */}
      <div className="flex flex-col items-center gap-3">
        <motion.svg
          width="80" height="160" viewBox="0 0 80 160"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {/* Head */}
          <circle cx="40" cy="18" r="12" fill="hsl(var(--surface-container-highest))" />
          {/* Neck */}
          <rect x="35" y="30" width="10" height="8" rx="3" fill="hsl(var(--surface-container-highest))" />
          {/* Torso */}
          <path d="M22 38 C22 38 18 70 20 95 L60 95 C62 70 58 38 58 38 Z"
            fill="hsl(var(--secondary))" fillOpacity="0.5" />
          {/* Arms */}
          <path d="M22 40 C14 50 10 70 12 82" stroke="hsl(var(--secondary))" strokeWidth="7" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <path d="M58 40 C66 50 70 70 68 82" stroke="hsl(var(--secondary))" strokeWidth="7" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          {/* Legs */}
          <path d="M28 95 C26 110 24 130 26 150" stroke="hsl(var(--secondary))" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <path d="M52 95 C54 110 56 130 54 150" stroke="hsl(var(--secondary))" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          {/* Muscle highlights */}
          <motion.path
            d="M22 40 C14 50 10 70 12 82"
            stroke="hsl(var(--secondary))"
            strokeWidth="10" strokeLinecap="round" fill="none" strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
          />
          <motion.path
            d="M58 40 C66 50 70 70 68 82"
            stroke="hsl(var(--secondary))"
            strokeWidth="10" strokeLinecap="round" fill="none" strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
          />
        </motion.svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">With Protection</span>
      </div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.3 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-on-surface-variant pb-12"
      >
        <span className="material-symbols-outlined text-3xl">arrow_forward</span>
      </motion.div>

      {/* After - muscle loss */}
      <div className="flex flex-col items-center gap-3">
        <motion.svg
          width="80" height="160" viewBox="0 0 80 160"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          {/* Head */}
          <circle cx="40" cy="18" r="12" fill="hsl(var(--surface-container-highest))" />
          {/* Neck */}
          <rect x="36" y="30" width="8" height="8" rx="3" fill="hsl(var(--surface-container-highest))" />
          {/* Torso - thinner */}
          <path d="M26 38 C26 38 24 70 25 95 L55 95 C56 70 54 38 54 38 Z"
            fill="hsl(var(--destructive))" fillOpacity="0.2" />
          {/* Arms - thinner */}
          <path d="M26 40 C20 50 17 70 18 82" stroke="hsl(var(--destructive))" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <path d="M54 40 C60 50 63 70 62 82" stroke="hsl(var(--destructive))" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          {/* Legs - thinner */}
          <path d="M32 95 C31 110 29 130 30 150" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <path d="M48 95 C49 110 51 130 50 150" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          {/* Danger pulse zones */}
          <motion.circle cx="20" cy="58" r="8" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx="60" cy="58" r="8" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.circle cx="34" cy="120" r="7" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.circle cx="46" cy="120" r="7" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          />
        </motion.svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-destructive font-bold">Without Protection</span>
      </div>
    </div>
  );
};

const HookScreen = () => {
  const navigate = useNavigate();
  const { user, onboardingCompleted } = useAuth();
  const statCount = useCounter(40);
  const socialCount = useSocialCounter(47832);
  const [showStat, setShowStat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const secondaryRef = useRef(null);
  const secondaryInView = useInView(secondaryRef, { once: true, amount: 0.3 });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const trustRef = useRef(null);
  const trustInView = useInView(trustRef, { once: true, amount: 0.3 });

  // If logged in and has completed onboarding, skip marketing and go straight to main app
  useEffect(() => {
    if (user && onboardingCompleted === true) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, onboardingCompleted, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setShowStat(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll cue after 2s
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 120, behavior: "smooth" });
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={scrollRef} className="min-h-screen bg-mesh overflow-y-auto overflow-x-hidden">
      <main className="px-5 md:px-8 max-w-lg mx-auto flex flex-col items-center pt-16 pb-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-2.5 mb-14"
        >
          <div className="relative w-9 h-9">
            {/* Lock body fused with muscle fiber */}
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Lock body */}
              <rect x="6" y="16" width="24" height="17" rx="4" fill="hsl(var(--primary))" />
              {/* Lock shackle */}
              <path d="M11 16V12C11 7.58 14.58 4 19 4V4C23.42 4 27 7.58 27 12V16"
                stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Muscle fiber lines inside lock */}
              <path d="M12 22C15 20 21 20 24 22" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M12 26C15 24 21 24 24 26" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              <path d="M14 30C16 28.5 20 28.5 22 30" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              {/* Keyhole */}
              <circle cx="18" cy="24" r="2.5" fill="hsl(var(--primary-foreground))" />
              <rect x="17" y="25" width="2" height="4" rx="1" fill="hsl(var(--primary-foreground))" />
            </svg>
          </div>
          <span className="font-headline font-bold text-xl text-primary tracking-tight">MuscleLock<span className="text-on-surface opacity-40 font-normal ml-1 text-base">AI</span></span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="font-headline font-bold text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95] tracking-tight text-on-surface text-center mb-4"
          style={{ textWrap: "balance" }}
        >
          Losing weight on GLP-1?
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-secondary text-lg md:text-2xl text-center max-w-md leading-relaxed mb-12"
        >
          There's something your doctor probably didn't tell you.
        </motion.p>

        {/* Stat Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={showStat ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease }}
          className="w-full relative mb-14"
        >
          {/* Pulsing red gradient border */}
          <motion.div
            className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-destructive/60 via-destructive/20 to-[hsl(25,100%,50%)]/40"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative bg-[hsl(var(--surface-container-lowest))] rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20">
                <span className="material-symbols-outlined text-destructive text-sm">warning</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-destructive font-bold">Clinical Alert</span>
              </div>

              <div className="font-headline font-black text-[5.5rem] md:text-[7rem] text-destructive tracking-tighter leading-none">
                {statCount}%
              </div>

              <p className="font-headline text-lg md:text-xl font-bold text-on-surface leading-snug max-w-sm">
                of weight lost on Ozempic/Wegovy is{" "}
                <span className="text-destructive uppercase">MUSCLE</span>, not fat
              </p>

              {/* Progress bar */}
              <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-destructive to-[hsl(25,100%,50%)]"
                  initial={{ width: "0%" }}
                  animate={showStat ? { width: "40%" } : {}}
                  transition={{ duration: 1.6, delay: 0.2, ease }}
                />
              </div>

              <p className="text-[11px] font-mono text-on-surface-variant/50 tracking-tight">
                Source: New England Journal of Medicine, 2024
              </p>
            </div>
          </div>
        </motion.div>

        {/* Secondary message */}
        <motion.div
          ref={secondaryRef}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={secondaryInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-10"
        >
          <p className="text-on-surface text-lg md:text-xl leading-relaxed max-w-md font-medium">
            That means for every <span className="text-on-surface font-bold">10 lbs</span> you lose...{" "}
            <span className="text-destructive font-bold">4 lbs</span> could be your muscle disappearing forever.
          </p>
        </motion.div>

        {/* Body silhouette comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={secondaryInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="w-full mb-12"
        >
          <BodySilhouette />
        </motion.div>

        {/* CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 16 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="w-full space-y-4 mb-10"
        >
          <button
            onClick={() => {
              if (!user) {
                navigate("/auth");
              } else if (onboardingCompleted) {
                navigate("/dashboard");
              } else {
                navigate("/personal-identity");
              }
            }}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-headline font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-200 shadow-[0_12px_32px_hsla(160,100%,45%,0.25)]"
          >
            Show me how to stop this
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>

          {/* Social proof counter */}
          <p className="text-center text-on-surface-variant text-sm">
            Join <span className="text-on-surface font-bold font-mono tabular-nums">{socialCount}</span> people protecting their muscle
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          ref={trustRef}
          initial={{ opacity: 0, y: 12 }}
          animate={trustInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="w-full grid grid-cols-3 gap-2"
        >
          {[
            { icon: "science", label: "Clinically\nReferenced" },
            { icon: "verified_user", label: "HIPAA\nCompliant" },
            { icon: "star", label: "4.9 App Store\nRating" },
          ].map((badge, i) => (
            <motion.div
              key={badge.icon}
              initial={{ opacity: 0, y: 8 }}
              animate={trustInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
              className="flex flex-col items-center gap-2 p-3.5 bg-surface-container-lowest rounded-xl border border-white/[0.04]"
            >
              <span className={`material-symbols-outlined text-xl ${badge.icon === "star" ? "material-filled text-primary" : "text-secondary"}`}>
                {badge.icon}
              </span>
              <span className="text-[9px] uppercase tracking-tight text-on-surface-variant text-center leading-tight font-bold whitespace-pre-line">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default HookScreen;
