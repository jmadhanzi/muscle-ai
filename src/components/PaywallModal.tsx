import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { STRIPE_CONFIG } from "@/config/stripe";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  headline?: string;
  body?: string;
  userName?: string;
  scoreChange?: number;
}

/* ── Dynamic headlines per trigger keyword ── */
const TRIGGER_HEADLINES: Record<string, string> = {
  workout: "Your muscles don't get to wait",
  ai: "Your AI coach has more to say",
  week2: "Week 1 complete. Your muscle score jumped",
  injection: "Tomorrow is injection day. Your protocol is ready.",
};

function resolveHeadline(
  headline?: string,
  feature?: string,
  userName?: string,
  scoreChange?: number,
): string {
  if (headline) {
    // Match trigger keywords
    for (const [key, h] of Object.entries(TRIGGER_HEADLINES)) {
      if (headline.toLowerCase().includes(key)) {
        if (key === "ai" && userName) return `${userName}, your AI coach has more to say`;
        if (key === "week2" && scoreChange)
          return `Week 1 complete. Your muscle score jumped +${scoreChange}`;
        return h;
      }
    }
    return headline;
  }
  return `Unlock ${feature || "Pro Features"}`;
}

/* ── Before / After comparison rows ── */
const COMPARISON = [
  { without: "😰 Skinny fat result", with: "💪 Lean & strong" },
  { without: "📉 25-40% weight = muscle", with: "📈 <8% muscle loss" },
  { without: "😓 Nausea kills workout", with: "✅ Nausea-proof protocol" },
  { without: "❓ Guessing protein needs", with: "🎯 Exact daily targets" },
  { without: "🤷 Generic advice", with: "🤖 AI coach knows YOU" },
  { without: "😞 No accountability", with: "🔥 10-week habit loop" },
];

/* ── What you unlock checklist ── */
const UNLOCK_LIST = [
  "10-week progressive resistance program",
  "47 GLP-1 safe high-protein meals",
  "Unlimited AI muscle coach",
  "Injection day full protocol",
  "Body composition tracker",
  "Shareable progress milestones",
  "Weekly program adjustments (AI-powered)",
  "Priority support",
];

/* ── Trust badges ── */
const TRUST_BADGES = [
  { icon: "🔒", label: "256-bit encrypted" },
  { icon: "🏥", label: "Clinically referenced" },
  { icon: "↩️", label: "7-day refund" },
];

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    text: "I lost 28 lbs on Wegovy. My trainer was shocked — I maintained ALL my muscle. MuscleLock is the reason.",
    name: "Rachel S., 47",
    med: "Wegovy user",
  },
  {
    text: "I was terrified of the skinny-fat look. 12 weeks later my arms are bigger than before I started GLP-1.",
    name: "David K., 39",
    med: "Mounjaro user",
  },
  {
    text: "The injection day protocol alone is worth the subscription. My nausea is manageable and I never miss a workout.",
    name: "Priya M., 52",
    med: "Ozempic user",
  },
];

/* ── Social proof ticker names ── */
const TICKER_ITEMS = [
  { name: "Amanda from Texas", time: "2 minutes ago" },
  { name: "Mark from London", time: "8 minutes ago" },
  { name: "Kenji from Tokyo", time: "14 minutes ago" },
  { name: "Sarah from Melbourne", time: "21 minutes ago" },
  { name: "Carlos from Miami", time: "33 minutes ago" },
];

const PaywallModal = ({
  open,
  onClose,
  feature,
  headline,
  body,
  userName,
  scoreChange,
}: PaywallModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Rotate testimonials
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [open]);

  // Rotate ticker
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length), 3500);
    return () => clearInterval(t);
  }, [open]);

  const resolvedHeadline = resolveHeadline(headline, feature, userName, scoreChange);
  const yearly = STRIPE_CONFIG.yearly;
  const monthly = STRIPE_CONFIG.monthly;
  const savings = (monthly.price * 12 - yearly.price).toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      onClose();
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const priceId =
        plan === "yearly" ? yearly.price_id : monthly.price_id;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[61] h-[92vh] bg-surface-container-lowest rounded-t-2xl overflow-hidden flex flex-col"
          >
            {/* Gradient top accent */}
            <div className="h-1 w-full gradient-hero shrink-0" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              <div className="max-w-lg mx-auto px-5 pt-8 pb-6 space-y-8">
                {/* ── HEADLINE ── */}
                <div className="pr-8">
                  <h2 className="font-headline font-bold text-2xl text-on-surface leading-tight">
                    {resolvedHeadline}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                    {body || "Unlock your full MuscleLock protocol"}
                  </p>
                </div>

                {/* ── BEFORE / AFTER ── */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pb-1">
                      Without MuscleLock
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider pb-1">
                      With MuscleLock
                    </div>
                  </div>
                  {COMPARISON.map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="text-sm text-on-surface-variant/70 leading-snug">
                        {row.without}
                      </div>
                      <div className="text-sm text-on-surface leading-snug font-medium">
                        {row.with}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── PLAN SELECTOR ── */}
                <div className="space-y-3">
                  {/* Toggle */}
                  <div className="flex items-center justify-center gap-1 bg-surface-container rounded-full p-1">
                    {(["monthly", "yearly"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlan(p)}
                        className={`flex-1 py-2 rounded-full text-sm font-headline font-semibold transition-all duration-200 active:scale-[0.97] ${
                          plan === p
                            ? "gradient-hero text-on-primary shadow-md"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {p === "monthly" ? "Monthly" : "Yearly"}
                        {p === "yearly" && (
                          <span className="ml-1.5 text-xs opacity-90">Save 45%</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {/* Monthly */}
                    <button
                      onClick={() => setPlan("monthly")}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
                        plan === "monthly"
                          ? "border-primary/40 bg-surface-container"
                          : "border-surface-container bg-surface-container-lowest"
                      }`}
                    >
                      <div className="font-headline font-semibold text-on-surface">Monthly</div>
                      <div className="text-on-surface font-mono text-lg font-bold mt-0.5">
                        ${monthly.price}
                        <span className="text-on-surface-variant text-sm font-normal">/month</span>
                      </div>
                      <div className="text-on-surface-variant text-xs mt-1">Cancel anytime</div>
                    </button>

                    {/* Yearly */}
                    <button
                      onClick={() => setPlan("yearly")}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${
                        plan === "yearly"
                          ? "border-primary bg-surface-container shadow-[0_0_24px_hsla(160,100%,45%,0.12)]"
                          : "border-surface-container bg-surface-container-lowest"
                      }`}
                    >
                      {plan === "yearly" && (
                        <div className="absolute top-0 right-0 gradient-hero text-on-primary text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
                          Best Value
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⭐</span>
                        <span className="font-headline font-semibold text-on-surface">
                          Yearly — Most Popular
                        </span>
                      </div>
                      <div className="text-on-surface font-mono text-lg font-bold mt-0.5">
                        ${yearly.monthly_equivalent}
                        <span className="text-on-surface-variant text-sm font-normal">/month</span>
                      </div>
                      <div className="text-on-surface-variant text-xs mt-1">
                        Billed ${yearly.price}/year · Save ${savings} vs monthly
                      </div>
                      <div className="text-primary text-xs font-medium mt-1">
                        = Less than 1 protein shake/mo
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── WHAT YOU UNLOCK ── */}
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
                    What you unlock
                  </h3>
                  {UNLOCK_LIST.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                      className="flex items-center gap-2.5 text-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-base shrink-0">
                        check_circle
                      </span>
                      {item}
                    </motion.div>
                  ))}
                </div>

                {/* ── TRUST BLOCK ── */}
                <div className="flex items-center justify-center gap-4">
                  {TRUST_BADGES.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-on-surface-variant"
                    >
                      <span className="text-base">{b.icon}</span>
                      {b.label}
                    </div>
                  ))}
                </div>

                {/* ── TESTIMONIALS ── */}
                <div className="relative h-36 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonialIdx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="bg-surface-container rounded-xl p-4 border border-surface-container"
                    >
                      <div className="text-primary text-sm mb-1">★★★★★</div>
                      <p className="text-on-surface text-sm leading-relaxed italic">
                        "{TESTIMONIALS[testimonialIdx].text}"
                      </p>
                      <p className="text-on-surface-variant text-xs mt-2">
                        — {TESTIMONIALS[testimonialIdx].name},{" "}
                        {TESTIMONIALS[testimonialIdx].med}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── SOCIAL PROOF TICKER ── */}
                <div className="h-8 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tickerIdx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="text-center text-xs text-on-surface-variant"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1.5 align-middle" />
                      {TICKER_ITEMS[tickerIdx].name} just subscribed —{" "}
                      {TICKER_ITEMS[tickerIdx].time}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── MONEY-BACK GUARANTEE ── */}
                <div className="text-center text-xs text-on-surface-variant leading-relaxed bg-surface-container rounded-xl p-4">
                  <span className="font-semibold text-on-surface">
                    7-Day No-Questions-Asked Refund.
                  </span>{" "}
                  If you don't feel MuscleLock is worth it after 7 days, email us
                  and we'll refund every cent. No hoops. No questions.
                </div>
              </div>
            </div>

            {/* ── STICKY BOTTOM CTA ── */}
            <div className="shrink-0 px-5 pb-5 pt-3 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 rounded-full gradient-hero text-on-primary font-headline font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 animate-[pulse_3s_ease-in-out_infinite] disabled:opacity-60"
              >
                {loading ? (
                  "Opening checkout..."
                ) : (
                  <>
                    UNLOCK MUSCLELOCK — START FREE 3 DAYS
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                Then ${plan === "yearly" ? `${yearly.price}/year ($${yearly.monthly_equivalent}/mo)` : `${monthly.price}/mo`} — cancel before trial ends and pay nothing
              </p>
              <p className="text-center text-[10px] text-on-surface-variant/60 mt-1">
                Join 47,832 people protecting their muscle today
              </p>

              {/* Guilt nudge dismiss */}
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-on-surface-variant/40 mt-3 py-1 active:scale-[0.97] transition-transform"
              >
                Maybe later — I'll risk muscle loss
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;
