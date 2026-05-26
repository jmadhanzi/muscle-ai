import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReferrals } from "@/hooks/useReferrals";
import { supabase } from "@/integrations/supabase/client";
import { openBrowser, shareContent, copyToClipboard } from "@/lib/capacitor";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

interface SubscriptionSectionProps {
  userId: string | undefined;
  firstName: string | null;
}

const SubscriptionSection = ({ userId, firstName }: SubscriptionSectionProps) => {
  const navigate = useNavigate();
  const { isPro, subscriptionEnd } = useAuth();
  const { referralCode, referralCount, monthsEarned, ensureReferralExists } = useReferrals(userId, firstName);
  const [portalLoading, setPortalLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) await openBrowser(data.url);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleShareReferral = async () => {
    await ensureReferralExists();
    const url = `${window.location.origin}/ref/${referralCode}`;
    try {
      await shareContent({ title: "Join MuscleLock", text: "Get 7 days of Pro free!", url });
    } catch {
      // Share was cancelled or failed — fall back to clipboard
      await copyToClipboard(url);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26, ease }}
      className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Subscription</span>

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPro ? "gradient-hero" : "bg-surface-container-high"}`}>
          <Crown className={`w-4 h-4 ${isPro ? "text-on-primary" : "text-on-surface-variant"}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-on-surface">{isPro ? "MuscleLock Pro" : "Free Plan"}</p>
            {isPro && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider gradient-hero text-on-primary">
                Active
              </span>
            )}
          </div>
          {isPro && subscriptionEnd && (
            <p className="text-xs text-on-surface-variant">
              Billing date: {new Date(subscriptionEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
          {!isPro && <p className="text-xs text-on-surface-variant">Upgrade to unlock all features</p>}
        </div>
      </div>

      {isPro ? (
        <button
          onClick={handleManageSubscription}
          disabled={portalLoading}
          className="w-full py-3 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium active:scale-[0.97] transition-transform disabled:opacity-50"
        >
          {portalLoading ? "Opening…" : "Manage Subscription"}
        </button>
      ) : (
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full py-3 rounded-full gradient-hero text-on-primary text-sm font-headline font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </button>
      )}

      {referralCode && (
        <div className="bg-surface-container-low rounded-lg p-4 space-y-3 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-on-surface">Refer a Friend</p>
              <p className="text-[10px] text-on-surface-variant">Both get 7 days of Pro free</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono font-bold text-primary">{referralCount}</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">referrals</p>
            </div>
          </div>
          {monthsEarned > 0 && (
            <p className="text-[10px] text-primary font-medium">🎉 {monthsEarned} month{monthsEarned > 1 ? "s" : ""} earned from referrals</p>
          )}
          <button
            onClick={handleShareReferral}
            className="w-full py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Share Referral Link"}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SubscriptionSection;
