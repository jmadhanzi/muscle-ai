import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { STRIPE_CONFIG } from "@/config/stripe";
import { ChevronDown } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1600, delay = 800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return count;
}

function useSocialCounter(target: number, duration = 2000, delay = 2400) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return count.toLocaleString();
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative w-9 h-9">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="6" y="16" width="24" height="17" rx="4" fill="hsl(var(--primary))" />
        <path d="M11 16V12C11 7.58 14.58 4 19 4C23.42 4 27 7.58 27 12V16"
          stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M12 22C15 20 21 20 24 22" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M12 26C15 24 21 24 24 26" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M14 30C16 28.5 20 28.5 22 30" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <circle cx="18" cy="24" r="2.5" fill="hsl(var(--primary-foreground))" />
        <rect x="17" y="25" width="2" height="4" rx="1" fill="hsl(var(--primary-foreground))" />
      </svg>
    </div>
    <span className="font-headline font-bold text-xl text-primary tracking-tight">
      MuscleLock<span className="text-on-surface opacity-40 font-normal ml-1 text-base">AI</span>
    </span>
  </div>
);

// ─── Body silhouette (FIXED: Without first → With second) ─────────────────────

const BodySilhouette = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="flex gap-8 md:gap-16 items-end justify-center py-4">
      {/* WITHOUT protection — left (the "before / bad") */}
      <div className="flex flex-col items-center gap-3">
        <motion.svg width="80" height="160" viewBox="0 0 80 160"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <circle cx="40" cy="18" r="12" fill="hsl(var(--surface-container-highest))" />
          <rect x="36" y="30" width="8" height="8" rx="3" fill="hsl(var(--surface-container-highest))" />
          <path d="M26 38 C26 38 24 70 25 95 L55 95 C56 70 54 38 54 38 Z"
            fill="hsl(var(--destructive))" fillOpacity="0.2" />
          <path d="M26 40 C20 50 17 70 18 82" stroke="hsl(var(--destructive))" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <path d="M54 40 C60 50 63 70 62 82" stroke="hsl(var(--destructive))" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <path d="M32 95 C31 110 29 130 30 150" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <path d="M48 95 C49 110 51 130 50 150" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.4" />
          <motion.circle cx="20" cy="58" r="8" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="60" cy="58" r="8" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
          <motion.circle cx="34" cy="120" r="7" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
          <motion.circle cx="46" cy="120" r="7" fill="hsl(var(--destructive))" fillOpacity="0.15"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />
        </motion.svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-destructive font-bold">Without Protection</span>
      </div>

      {/* Arrow — now green, pointing right toward the good outcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-primary pb-12"
      >
        <span className="material-symbols-outlined text-3xl">arrow_forward</span>
      </motion.div>

      {/* WITH protection — right (the "after / good") */}
      <div className="flex flex-col items-center gap-3">
        <motion.svg width="80" height="160" viewBox="0 0 80 160"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          <circle cx="40" cy="18" r="12" fill="hsl(var(--surface-container-highest))" />
          <rect x="35" y="30" width="10" height="8" rx="3" fill="hsl(var(--surface-container-highest))" />
          <path d="M22 38 C22 38 18 70 20 95 L60 95 C62 70 58 38 58 38 Z"
            fill="hsl(var(--primary))" fillOpacity="0.25" />
          <path d="M22 40 C14 50 10 70 12 82" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <path d="M58 40 C66 50 70 70 68 82" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <path d="M28 95 C26 110 24 130 26 150" stroke="hsl(var(--primary))" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <path d="M52 95 C54 110 56 130 54 150" stroke="hsl(var(--primary))" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
          <motion.path d="M22 40 C14 50 10 70 12 82"
            stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round" fill="none" strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease }} />
          <motion.path d="M58 40 C66 50 70 70 68 82"
            stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round" fill="none" strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease }} />
          {/* Shield badge */}
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.4, ease }}>
            <circle cx="57" cy="20" r="10" fill="hsl(var(--primary))" />
            <text x="57" y="25" textAnchor="middle" fontSize="12" fill="hsl(var(--primary-foreground))" fontWeight="bold">✓</text>
          </motion.g>
        </motion.svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">With Protection</span>
      </div>
    </div>
  );
};

// ─── Feature card ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  tag: string;
  delay: number;
  inView: boolean;
}

const FeatureCard = ({ icon, title, description, tag, delay, inView }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay, ease }}
    className="bg-surface-container-lowest rounded-2xl border border-white/[0.06] p-5 flex flex-col gap-3"
  >
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-widest text-primary border border-primary/25 rounded-full px-2 py-0.5">{tag}</span>
    </div>
    <div>
      <p className="font-headline font-bold text-sm text-on-surface mb-1">{title}</p>
      <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// ─── Testimonial card ─────────────────────────────────────────────────────────

interface TestimonialProps {
  name: string;
  initials: string;
  medication: string;
  weeks: number;
  quote: string;
  metric: string;
  color: string;
}

const TestimonialCard = ({ name, initials, medication, weeks, quote, metric, color, delay, inView }: TestimonialProps & { delay: number; inView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.55, delay, ease }}
    className="bg-surface-container-lowest rounded-2xl border border-white/[0.06] p-5 flex flex-col gap-3"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-headline font-bold text-sm text-on-primary shrink-0`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-sm text-on-surface">{name}</p>
        <p className="text-[10px] text-on-surface-variant font-mono">{medication} · {weeks} weeks</p>
      </div>
      <div className="flex gap-0.5 shrink-0">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        ))}
      </div>
    </div>
    <p className="text-sm text-on-surface leading-relaxed italic">"{quote}"</p>
    <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
      <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
      <span className="text-xs font-mono font-bold text-primary">{metric}</span>
    </div>
  </motion.div>
);

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Does this work with tirzepatide (Mounjaro / Zepbound) too?",
    a: "Yes. MuscleLock AI is designed for all GLP-1 and GIP/GLP-1 medications — semaglutide (Ozempic, Wegovy), tirzepatide (Mounjaro, Zepbound), and liraglutide (Victoza, Saxenda). The muscle-loss risk is the same across all of them."
  },
  {
    q: "I haven't started medication yet. Can I still use this?",
    a: "Absolutely — and this is actually the best time to start. Building your protein and resistance-training habits before you begin GLP-1 therapy significantly reduces muscle loss from day one. Many users onboard 1–2 months before their first injection."
  },
  {
    q: "Is this a diet app or a workout app?",
    a: "Neither, and both. MuscleLock AI is a muscle-preservation protocol specifically built for GLP-1 users. It combines your Muscle Score (a personalised risk assessment), injection-day-synced nutrition, resistance training, and an AI Coach that understands the unique physiology of GLP-1 therapy."
  },
  {
    q: "What does the free plan include?",
    a: "The free plan gives you your Muscle Score, a personalised protein target, Day 1 workout, 3 injection-day meal suggestions, and 3 messages with the AI Coach. It's enough to understand your risk level and take your first steps. Pro unlocks the full 10-week program, unlimited coaching, and the 47-meal library."
  },
  {
    q: "Is my health data private and secure?",
    a: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We follow HIPAA-aligned practices. We never sell your data or share it with insurers, employers, or advertisers — ever. AI Coach conversations are session-only and never stored or used to train AI models."
  },
];

const FAQItem = ({ q, a, delay, inView }: { q: string; a: string; delay: number; inView: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease }}
      className="border-b border-white/[0.06] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
      >
        <span className="text-sm font-medium text-on-surface leading-relaxed">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 mt-0.5">
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="text-sm text-on-surface-variant leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────

const TESTIMONIALS: TestimonialProps[] = [
  {
    name: "Sarah M.",
    initials: "SM",
    medication: "Wegovy",
    weeks: 12,
    quote: "I lost 34 lbs and my DEXA scan showed zero muscle loss. My doctor couldn't believe it. The injection-day nutrition plan alone was worth the price.",
    metric: "34 lbs lost · 0% muscle lost",
    color: "bg-primary",
  },
  {
    name: "Marcus T.",
    initials: "MT",
    medication: "Ozempic",
    weeks: 8,
    quote: "I was losing strength every week until I found MuscleLock. The AI Coach explained exactly why and fixed my protein timing. I'm actually stronger now than before I started.",
    metric: "12% strength increase",
    color: "bg-secondary",
  },
  {
    name: "Rachel K.",
    initials: "RK",
    medication: "Mounjaro",
    weeks: 16,
    quote: "Worth 10x the price. I had no idea 40% of my weight loss was muscle. Four months in and my lean mass is fully preserved. This is the missing piece nobody tells you about.",
    metric: "Lean mass fully preserved",
    color: "bg-accent-purple",
  },
];

const HookScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const statCount = useCounter(40);
  const socialCount = useSocialCounter(52_419);
  const [showStat, setShowStat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.15 });
  const howRef = useRef(null);
  const howInView = useInView(howRef, { once: true, amount: 0.15 });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });
  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, amount: 0.1 });
  const finalCtaRef = useRef(null);
  const finalCtaInView = useInView(finalCtaRef, { once: true, amount: 0.4 });
  const secondaryRef = useRef(null);
  const secondaryInView = useInView(secondaryRef, { once: true, amount: 0.3 });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const trustRef = useRef(null);
  const trustInView = useInView(trustRef, { once: true, amount: 0.3 });

  const goToApp = () => navigate(user ? "/personal-identity" : "/auth");

  useEffect(() => {
    const t = setTimeout(() => setShowStat(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Subtle scroll nudge
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 100, behavior: "smooth" });
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={scrollRef} className="min-h-screen bg-mesh overflow-y-auto overflow-x-hidden">
      <main className="px-5 md:px-8 max-w-lg mx-auto flex flex-col items-center pt-16 pb-20">

        {/* ── SECTION 1: Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <Logo />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="font-headline font-bold text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95] tracking-tight text-on-surface text-center mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Losing weight on GLP-1?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-secondary text-lg md:text-2xl text-center max-w-md leading-relaxed mb-8"
        >
          There's something your doctor probably didn't tell you.
        </motion.p>

        {/* Scroll-down nudge */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          onClick={() => scrollRef.current?.scrollTo({ top: 500, behavior: "smooth" })}
          className="mb-12 flex flex-col items-center gap-1 text-on-surface-variant/50 text-[11px] font-mono uppercase tracking-widest active:opacity-70"
        >
          <span>Scroll to see</span>
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* ── SECTION 2: Fear stat ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={showStat ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease }}
          className="w-full relative mb-14"
        >
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

        {/* ── SECTION 3: Problem amplification ── */}
        <motion.div
          ref={secondaryRef}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={secondaryInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-10"
        >
          <p className="text-on-surface text-lg md:text-xl leading-relaxed max-w-md font-medium">
            For every{" "}
            <span className="font-bold">10 lbs</span> you lose...{" "}
            <span className="text-destructive font-bold">4 lbs</span> could be muscle disappearing{" "}
            <span className="underline decoration-destructive/60 decoration-2">forever</span>.
          </p>
        </motion.div>

        {/* Body silhouette — FIXED ORDER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={secondaryInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="w-full mb-6"
        >
          <BodySilhouette />
        </motion.div>

        {/* Transition bridge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={secondaryInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="text-center mb-14"
        >
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed mx-auto">
            Most GLP-1 users don't find out until they're weak, exhausted, and their results have stalled.
          </p>
          <p className="text-primary font-headline font-bold text-lg mt-3">
            There's a better way.
          </p>
        </motion.div>

        {/* ── First CTA — mid-page for already-convinced users ── */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 16 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="w-full space-y-3 mb-16"
        >
          <button
            onClick={goToApp}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-headline font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-200 shadow-[0_12px_32px_hsla(160,100%,45%,0.25)]"
          >
            Protect my muscle — free
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <div className="flex items-center justify-center gap-3 text-[11px] text-on-surface-variant/70">
            <span>✓ Free to start</span>
            <span className="opacity-40">·</span>
            <span>✓ No credit card needed</span>
            <span className="opacity-40">·</span>
            <span>✓ 3-min setup</span>
          </div>
          <p className="text-center text-on-surface-variant text-sm">
            Join <span className="text-on-surface font-bold font-mono tabular-nums">{socialCount}</span> GLP-1 users protecting their muscle
          </p>
        </motion.div>

        {/* ── SECTION 4: Features — What you actually get ── */}
        <div ref={featuresRef} className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-8"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">What you get</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mt-2 leading-tight">
              A complete muscle-preservation system
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">
              Built specifically for GLP-1 users. Not a generic fitness app — a clinical protocol for your situation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            <FeatureCard
              icon="monitor_heart"
              title="Your Muscle Score"
              description="A personalised risk score (20–85) calculated from your medication, fitness level, protein intake, and goals. Know exactly how much muscle you're at risk of losing — and what to do about it."
              tag="Free"
              delay={0.05}
              inView={featuresInView}
            />
            <FeatureCard
              icon="psychology"
              title="AI Coach — 24/7 Expert"
              description="Ask anything about GLP-1 and muscle. The coach knows your Muscle Score, your medication, your goals, and the latest research. It's like having a sports dietitian and exercise physiologist in your pocket."
              tag="Pro"
              delay={0.12}
              inView={featuresInView}
            />
            <FeatureCard
              icon="fitness_center"
              title="10-Week Workout Program"
              description="Progressive resistance training designed around GLP-1 side effects. Shorter sessions for nausea days. Heavier lifts as your body adapts. Built to preserve and build muscle while you lose fat."
              tag="Pro"
              delay={0.19}
              inView={featuresInView}
            />
            <FeatureCard
              icon="restaurant"
              title="Injection-Day Nutrition"
              description="47 high-protein meals synced to your injection schedule. GLP-1 reduces appetite most on injection day — these meals are designed to hit your protein target even when you're not hungry."
              tag="Pro"
              delay={0.26}
              inView={featuresInView}
            />
            <FeatureCard
              icon="analytics"
              title="Body Composition Tracker"
              description="Weekly check-ins that separate fat loss from muscle loss. Trend charts, milestone cards you can share, and early warnings if your muscle preservation drops below target."
              tag="Pro"
              delay={0.33}
              inView={featuresInView}
            />
            <FeatureCard
              icon="science"
              title="Evidence-Based Supplement Stack"
              description="Creatine monohydrate, leucine timing, vitamin D — the specific supplements with clinical evidence for muscle preservation on GLP-1 therapy, dosed correctly for your body weight."
              tag="Pro"
              delay={0.40}
              inView={featuresInView}
            />
          </div>
        </div>

        {/* ── SECTION 5: How it works — 3 steps ── */}
        <div ref={howRef} className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-8"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">How it works</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mt-2 leading-tight">
              Up and running in 3 minutes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                step: "01",
                icon: "assignment_ind",
                title: "Answer 8 questions",
                desc: "Medication, weight, goals, fitness level. Takes under 3 minutes. No medical history required.",
              },
              {
                step: "02",
                icon: "monitor_heart",
                title: "Get your Muscle Score",
                desc: "See your personalised risk score and exactly which factors are working for or against your muscle mass.",
              },
              {
                step: "03",
                icon: "shield",
                title: "Follow your protocol",
                desc: "Daily workout, injection-day meals, and AI coaching — all calibrated to your score and updated as you progress.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -16 }}
                animate={howInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="flex items-start gap-4 bg-surface-container-lowest rounded-2xl border border-white/[0.06] p-5"
              >
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                  </div>
                  {i < 2 && <div className="w-px h-4 bg-primary/20" />}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-primary font-bold">{item.step}</span>
                    <p className="font-headline font-bold text-sm text-on-surface">{item.title}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SECTION 6: Testimonials ── */}
        <div ref={testimonialsRef} className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-8"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Real results</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mt-2 leading-tight">
              From real GLP-1 users
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              People who were losing muscle without knowing it.
            </p>
          </motion.div>

          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} {...t} delay={i * 0.1} inView={testimonialsInView} />
            ))}
          </div>
        </div>

        {/* ── SECTION 7: Pricing transparency ── */}
        <div ref={pricingRef} className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-6"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Pricing</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mt-2 leading-tight">
              Start free. Upgrade when you're ready.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {/* Free card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="bg-surface-container-lowest rounded-2xl border border-white/[0.06] p-5"
            >
              <p className="font-headline font-bold text-sm text-on-surface mb-1">Free</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-headline font-bold text-3xl text-on-surface">$0</span>
                <span className="text-xs text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-2">
                {["Muscle Score", "Day 1 workout", "Protein target", "3 coach messages", "3 injection meals"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18, ease }}
              className="relative bg-surface-container-lowest rounded-2xl border border-primary/30 p-5 overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                Best value
              </div>
              <p className="font-headline font-bold text-sm text-primary mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-headline font-bold text-3xl text-on-surface">${STRIPE_CONFIG.yearly.monthly_equivalent}</span>
                <span className="text-xs text-on-surface-variant">/mo</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-mono mb-4">Billed ${STRIPE_CONFIG.yearly.price}/yr · {Math.round((1 - STRIPE_CONFIG.yearly.monthly_equivalent / STRIPE_CONFIG.monthly.price) * 100)}% off</p>
              <ul className="space-y-2">
                {["Everything in Free", "10-week workouts", "Unlimited AI Coach", "47-meal library", "Analytics & tracker", "+ more"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: f === "Everything in Free" ? "'FILL' 1" : "'FILL' 0" }}>
                      {f === "Everything in Free" ? "check_circle" : "check_circle"}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={pricingInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3, ease }}
            className="text-center text-xs text-on-surface-variant/60 mt-4"
          >
            3-day free trial on Pro · Cancel anytime · No surprise charges
          </motion.p>
        </div>

        {/* ── SECTION 8: Trust badges ── */}
        <motion.div
          ref={trustRef}
          initial={{ opacity: 0, y: 12 }}
          animate={trustInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="w-full grid grid-cols-3 gap-2 mb-16"
        >
          {[
            { icon: "science", label: "Clinically\nReferenced", sub: "Peer-reviewed research" },
            { icon: "verified_user", label: "HIPAA\nAligned", sub: "Health data protected" },
            { icon: "lock", label: "AES-256\nEncrypted", sub: "End-to-end security" },
          ].map((badge, i) => (
            <motion.div
              key={badge.icon}
              initial={{ opacity: 0, y: 8 }}
              animate={trustInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
              className="flex flex-col items-center gap-2 p-3.5 bg-surface-container-lowest rounded-xl border border-white/[0.04]"
            >
              <span className="material-symbols-outlined text-xl text-primary">{badge.icon}</span>
              <span className="text-[9px] uppercase tracking-tight text-on-surface text-center leading-tight font-bold whitespace-pre-line">{badge.label}</span>
              <span className="text-[9px] text-on-surface-variant/60 text-center leading-tight">{badge.sub}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── SECTION 9: FAQ ── */}
        <div ref={faqRef} className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-6"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">FAQ</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mt-2 leading-tight">
              Questions we get a lot
            </h2>
          </motion.div>

          <div className="bg-surface-container-lowest rounded-2xl border border-white/[0.06] px-5">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} delay={i * 0.07} inView={faqInView} />
            ))}
          </div>
        </div>

        {/* ── SECTION 10: Final CTA ── */}
        <div ref={finalCtaRef} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={finalCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="relative rounded-3xl overflow-hidden p-8 text-center"
          >
            {/* Pulsing green border */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-primary/60 via-secondary/30 to-primary/40"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative bg-surface-container-lowest rounded-3xl p-8 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-primary text-3xl">shield</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-2xl text-on-surface leading-tight mb-2">
                  Don't lose what you worked for
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  Every week without a muscle-preservation protocol is muscle you may not get back. Start free in 3 minutes.
                </p>
              </div>

              <button
                onClick={goToApp}
                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-headline font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-200 shadow-[0_12px_32px_hsla(160,100%,45%,0.30)]"
              >
                Get my Muscle Score — free
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-on-surface-variant/70">
                <span>✓ No credit card</span>
                <span className="opacity-40">·</span>
                <span>✓ 3-min setup</span>
                <span className="opacity-40">·</span>
                <span>✓ Cancel anytime</span>
              </div>

              <p className="text-xs text-on-surface-variant/50">
                <span className="text-on-surface font-mono font-bold">{socialCount}</span> GLP-1 users already protecting their muscle
              </p>
            </div>
          </motion.div>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={finalCtaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-4 mt-8 mb-4"
          >
            <button onClick={() => navigate("/privacy")} className="text-[11px] text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
              Privacy Policy
            </button>
            <span className="text-on-surface-variant/20">·</span>
            <button onClick={() => navigate("/terms")} className="text-[11px] text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
              Terms of Service
            </button>
            <span className="text-on-surface-variant/20">·</span>
            <button onClick={() => navigate("/about")} className="text-[11px] text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
              About & Trust
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={finalCtaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-[10px] text-on-surface-variant/30 font-mono"
          >
            © {new Date().getFullYear()} MuscleLock AI · Not a medical device · For wellness use only
          </motion.p>
        </div>

      </main>
    </div>
  );
};

export default HookScreen;
