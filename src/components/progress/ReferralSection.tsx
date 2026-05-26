import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Users, Gift } from "lucide-react";
import { shareContent, copyToClipboard } from "@/lib/capacitor";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
  monthsEarned: number;
  onShareClick: () => Promise<void>;
}

const ReferralSection = ({ referralCode, referralCount, monthsEarned, onShareClick }: ReferralSectionProps) => {
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/ref/${referralCode}`;

  const handleCopy = async () => {
    await copyToClipboard(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await onShareClick();
    await shareContent({
      title: "Join MuscleLock AI",
      text: "I'm using MuscleLock AI to protect my muscle on GLP-1. Get 7 days of Pro free with my link!",
      url: referralLink,
    });
  };

  if (!referralCode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Refer Friends</span>
      </div>

      <p className="text-sm text-on-surface leading-relaxed">
        Give friends <span className="text-primary font-bold">7 free days of Pro</span>. When they subscribe, you earn a free month too.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-on-surface-variant">Referred</span>
          </div>
          <p className="font-headline font-bold text-xl text-primary">{referralCount}</p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Gift className="w-3.5 h-3.5 text-accent-gold" />
            <span className="text-xs text-on-surface-variant">Earned</span>
          </div>
          <p className="font-headline font-bold text-xl text-accent-gold">
            {monthsEarned} {monthsEarned === 1 ? "mo" : "mos"}
          </p>
        </div>
      </div>

      {/* Link display */}
      <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 border border-border/50">
        <span className="text-xs font-mono text-on-surface-variant/70 flex-1 truncate">
          musclelock.app/ref/{referralCode}
        </span>
        <button onClick={handleCopy} className="shrink-0 active:scale-95 transition-transform">
          <Copy className={`w-3.5 h-3.5 ${copied ? "text-primary" : "text-on-surface-variant"}`} />
        </button>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-lg gradient-hero text-on-primary text-sm font-headline font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Share2 className="w-4 h-4" />
          Share link
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-3 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium active:scale-[0.97] transition-transform"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
};

export default ReferralSection;
