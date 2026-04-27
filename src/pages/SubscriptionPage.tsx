import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Shield, Brain, Dumbbell, Utensils, TrendingUp, Loader2 } from "lucide-react";
import { FEATURE_COMPARISON, PRO_FEATURES } from "@/config/features";
import { STRIPE_CONFIG } from "@/config/stripe";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

const SAVE_PCT = Math.round((1 - STRIPE_CONFIG.yearly.monthly_equivalent / STRIPE_CONFIG.monthly.price) * 100);
const PRO_ICONS = [Brain, Utensils, Dumbbell, TrendingUp, Shield, Zap];

const TESTIMONIALS = [
  { name: "Sarah M.", weeks: 12, quote: "I lost 34 lbs and kept every ounce of muscle. My trainer couldn't believe my DEXA results.", metric: "34 lbs lost, 0 muscle lost" },
  { name: "Marcus T.", weeks: 8, quote: "The meal timing alone was a game-changer. I actually feel stronger on Ozempic now.", metric: "12% strength increase" },
  { name: "Rachel K.", weeks: 16, quote: "Worth 10x the price. I was losing muscle before MuscleLock and didn't even know it.", metric: "Lean mass preserved" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isPro, subscriptionEnd, checkSubscription } = useAuth();
  const { offerings, purchasePackage, loading: revenueCatLoading, restorePurchases, checkSubscriptionStatus, fetchOfferings } = useRevenueCat();
  const [yearly, setYearly] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const price = yearly ? STRIPE_CONFIG.yearly.monthly_equivalent : STRIPE_CONFIG.monthly.price;
  const billedAs = yearly ? `$${STRIPE_CONFIG.yearly.price}/year` : `$${STRIPE_CONFIG.monthly.price}/month`;
  const selectedPriceId = yearly ? STRIPE_CONFIG.yearly.price_id : STRIPE_CONFIG.monthly.price_id;

  // Scroll to top and refresh offerings on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh offerings on page load for native platforms
    if (Capacitor.isNativePlatform()) {
      fetchOfferings();
    }
  }, [fetchOfferings]);

  // Check for successful checkout return
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  const handleSubscribe = async () => {
    if (Capacitor.isNativePlatform()) {
      console.log('Current offerings:', offerings);
      const currentOffering = offerings[0];
      if (!currentOffering) {
        toast.error(`No offerings available. Found ${offerings.length} offerings. Check RevenueCat configuration.`);
        return;
      }

      console.log('Current offering packages:', currentOffering.availablePackages);
      const monthlyPackage = currentOffering.availablePackages.find(pkg => pkg.packageType === 'MONTHLY');
      const yearlyPackage = currentOffering.availablePackages.find(pkg => pkg.packageType === 'ANNUAL');

      console.log('Monthly package:', monthlyPackage);
      console.log('Yearly package:', yearlyPackage);

      const selectedPackage = yearly ? yearlyPackage : monthlyPackage;
      if (!selectedPackage) {
        toast.error(`Selected package (${yearly ? 'yearly' : 'monthly'}) not available. Available package types: ${currentOffering.availablePackages.map(p => p.packageType).join(', ')}`);
        return;
      }

      await purchasePackage(selectedPackage);
    } else {
      setCheckoutLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { priceId: selectedPriceId },
        });
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, "_blank");
        }
      } catch (e) {
        toast.error("Could not start checkout. Please try again.");
        console.error(e);
      } finally {
        setCheckoutLoading(false);
      }
    }
  };

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e) {
      toast.error("Could not open subscription management.");
      console.error(e);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => navigate(-1)}
        className="fixed top-5 right-5 z-50 w-9 h-9 rounded-full bg-surface-container-high/80 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <X className="w-4 h-4 text-on-surface-variant" />
      </motion.button>

      <div className="max-w-lg mx-auto px-5 pt-14 pb-12">
        {/* If already Pro */}
        {isPro && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_hsla(160,100%,45%,0.15)]">
              <Check className="w-8 h-8 text-on-primary" />
            </div>
            <h1 className="font-headline font-bold text-3xl text-on-surface mb-2">You're on Pro</h1>
            <p className="text-on-surface-variant text-sm mb-1">Full muscle preservation protocol unlocked.</p>
            {subscriptionEnd && (
              <p className="text-xs font-mono text-on-surface-variant">
                Renews {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
            {Capacitor.isNativePlatform() ? (
              <button
                onClick={restorePurchases}
                disabled={revenueCatLoading}
                className="mt-6 px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-headline font-bold text-sm active:scale-[0.97] transition-transform duration-200 flex items-center gap-2 mx-auto"
              >
                {revenueCatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-sm">restore</span>}
                Restore Purchases
              </button>
            ) : (
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="mt-6 px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-headline font-bold text-sm active:scale-[0.97] transition-transform duration-200 flex items-center gap-2 mx-auto"
              >
                {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-sm">settings</span>}
                Manage Subscription
              </button>
            )}
          </motion.section>
        )}

        {!isPro && (
          <>
            {/* Hero */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="material-symbols-outlined material-filled text-primary text-sm">bolt</span>
                <span className="text-primary font-label text-xs font-bold tracking-widest uppercase">Limited Offer</span>
              </div>
              <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.1] tracking-tight mb-4">
                Stop losing muscle.<br /><span className="text-primary">Start today.</span>
              </h1>
              <p className="text-on-surface-variant text-lg max-w-sm mx-auto leading-relaxed">
                Your personalized protocol is ready. Unlock the full system built for GLP-1 patients.
              </p>
            </motion.section>

            {/* Pricing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <span className={`text-sm font-medium transition-colors ${!yearly ? "text-on-surface" : "text-on-surface-variant"}`}>Monthly</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${yearly ? "bg-primary" : "bg-surface-container-highest"}`}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                  animate={{ left: yearly ? "calc(100% - 1.625rem)" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${yearly ? "text-on-surface" : "text-on-surface-variant"}`}>Yearly</span>
              {yearly && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Save {SAVE_PCT}%
                </motion.span>
              )}
            </motion.div>

            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="relative overflow-hidden rounded-lg border-2 border-primary/30 bg-surface-container-lowest p-7 mb-8"
            >
              <div className="absolute top-0 left-0 w-full h-1 gradient-hero" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-headline font-bold text-xl text-on-surface">MuscleLock Pro</h2>
                    <p className="text-on-surface-variant text-xs mt-0.5">Full muscle preservation system</p>
                  </div>
                  <div className="text-right">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={yearly ? "yearly" : "monthly"}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <span className="font-headline font-black text-4xl text-on-surface">${price.toFixed(2)}</span>
                        <span className="text-on-surface-variant text-sm">/mo</span>
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-on-surface-variant text-[10px] font-mono tracking-wide">Billed {billedAs}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {PRO_FEATURES.slice(0, 6).map((feat, i) => {
                    const Icon = PRO_ICONS[i] || Zap;
                    return (
                      <motion.div
                        key={feat.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.06, duration: 0.4, ease }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-on-surface">{feat.label}</p>
                          <p className="text-[11px] text-on-surface-variant">{feat.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {Capacitor.isNativePlatform() && offerings.length === 0 && (
                  <button
                    onClick={fetchOfferings}
                    disabled={revenueCatLoading}
                    className="w-full py-2 mb-2 rounded-full bg-surface-container-high text-on-surface font-headline font-bold text-sm active:scale-[0.97] transition-transform duration-200 disabled:opacity-70"
                  >
                    {revenueCatLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Refresh Offerings'}
                  </button>
                )}

                <button
                  onClick={handleSubscribe}
                  disabled={checkoutLoading}
                  className="w-full py-4 rounded-full gradient-hero text-on-primary font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 disabled:opacity-70"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Start {STRIPE_CONFIG.trial.default_days}-Day Free Trial
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
                <p className="text-center text-on-surface-variant text-[10px] mt-3 font-mono tracking-wide">
                  {Capacitor.isNativePlatform() ? 'Sandbox testing mode' : `${STRIPE_CONFIG.trial.default_days}-day free trial`} · Cancel anytime · Money-back guarantee
                </p>
              </div>
            </motion.div>
          </>
        )}

        {/* Full Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="mb-10"
        >
          <h3 className="font-headline font-bold text-lg text-on-surface text-center mb-4">Free vs Pro</h3>
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-border">
            <div className="grid grid-cols-[1fr_60px_60px] gap-0 text-center">
              <div className="p-3 text-left text-[10px] font-mono uppercase tracking-widest text-on-surface-variant border-b border-border">Feature</div>
              <div className="p-3 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant border-b border-l border-border">Free</div>
              <div className="p-3 text-[10px] font-mono uppercase tracking-widest text-primary border-b border-l border-border font-bold">Pro</div>

              {FEATURE_COMPARISON.map((row, i) => (
                <motion.div
                  key={row.feature}
                  className="contents"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                >
                  <div className={`p-3 text-left text-sm text-on-surface ${i < FEATURE_COMPARISON.length - 1 ? "border-b border-border" : ""}`}>
                    {row.feature}
                  </div>
                  <div className={`p-3 flex items-center justify-center border-l ${i < FEATURE_COMPARISON.length - 1 ? "border-b" : ""} border-border`}>
                    {row.free ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-on-surface-variant/30" />}
                  </div>
                  <div className={`p-3 flex items-center justify-center border-l ${i < FEATURE_COMPARISON.length - 1 ? "border-b" : ""} border-border bg-primary/[0.03]`}>
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="mb-10"
        >
          <h3 className="font-headline font-bold text-lg text-on-surface text-center mb-4">Real Results</h3>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-surface-container-low rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline font-bold text-primary text-sm">
                    {TESTIMONIALS[selectedTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-on-surface font-medium text-sm">{TESTIMONIALS[selectedTestimonial].name}</p>
                    <p className="text-on-surface-variant text-xs">{TESTIMONIALS[selectedTestimonial].weeks} weeks on protocol</p>
                  </div>
                </div>
                <p className="text-on-surface text-sm leading-relaxed italic mb-3">
                  "{TESTIMONIALS[selectedTestimonial].quote}"
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                  <TrendingUp className="w-3 h-3" />
                  {TESTIMONIALS[selectedTestimonial].metric}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === selectedTestimonial ? "bg-primary w-6" : "bg-surface-container-highest"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Risk urgency */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
            className="bg-accent-danger/5 border border-accent-danger/15 rounded-lg p-5 text-center mb-8"
          >
            <span className="material-symbols-outlined text-accent-danger text-3xl mb-2">timer</span>
            <p className="text-on-surface font-headline font-bold text-lg mb-1">Every week matters</p>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
              Research shows muscle loss on GLP-1s accelerates after the first 8 weeks. The sooner you start, the more you preserve.
            </p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease }}
          >
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className="w-full py-5 rounded-full gradient-hero text-on-primary font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 mb-3 disabled:opacity-70"
            >
              {checkoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Start {STRIPE_CONFIG.trial.default_days}-Day Free Trial
                  <span className="material-symbols-outlined">lock_open</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 text-on-surface-variant text-sm active:scale-[0.97] transition-transform"
            >
              Maybe later
            </button>
          </motion.div>
        )}

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-6 text-on-surface-variant/40"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">lock</span>Secure
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">verified_user</span>HIPAA
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">undo</span>7-day refund
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
