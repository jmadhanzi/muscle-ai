import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Check, Gift } from "lucide-react";

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
  monthsEarned: number;
  onShareClick: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const ReferralSection = ({ referralCode, referralCount, monthsEarned, onShareClick }: ReferralSectionProps) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `musclelock.app/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${referralLink}`);
    setCopied(true);
    onShareClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    onShareClick();
    if (navigator.share) {
      navigator.share({
        title: "Join MuscleLock",
        text: "I'm using MuscleLock to protect my muscle on GLP-1. Get 7 free days with my link!",
        url: `https://${referralLink}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease }}
      className="rounded-lg border border-primary/20 bg-surface-container-lowest p-5 overflow-hidden relative"
    >
      <div className="absolute inset-0 opacity-[0.04] gradient-hero pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-headline font-bold text-base text-on-surface">Give a Friend 7 Free Days</h3>
        </div>

        <div className="bg-surface-container-high rounded-md px-3 py-2.5 mb-3">
          <p className="text-[10px] font-mono text-on-surface-variant mb-1">Your referral link</p>
          <p className="text-sm font-mono text-primary break-all">{referralLink}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-on-surface-variant">
          <div className="bg-surface-container rounded-md p-3 text-center">
            <p className="font-headline font-bold text-lg text-on-surface">{referralCount}</p>
            <p className="text-[10px] font-mono">Referrals</p>
          </div>
          <div className="bg-surface-container rounded-md p-3 text-center">
            <p className="font-headline font-bold text-lg text-primary">{monthsEarned}</p>
            <p className="text-[10px] font-mono">Free months earned</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-on-surface-variant mb-4">
          <span>You earn: <span className="text-primary font-medium">1 free month</span> per referral</span>
          <span>They get: <span className="text-primary font-medium">7-day trial</span></span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium active:scale-[0.97] transition-all duration-200 border border-border"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg gradient-hero text-primary-foreground text-xs font-medium active:scale-[0.97] transition-all duration-200"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSection;
