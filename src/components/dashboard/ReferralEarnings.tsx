import { Gift } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";

interface ReferralEarningsProps {
  userId: string | undefined;
  firstName?: string | null;
}

const ReferralEarnings = ({ userId, firstName }: ReferralEarningsProps) => {
  const { referralCount, monthsEarned, loaded } = useReferrals(userId, firstName);

  if (!loaded || (referralCount === 0 && monthsEarned === 0)) return null;

  return (
    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-lg px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Gift className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-on-surface">
          You've earned <span className="text-primary font-bold">{monthsEarned} free month{monthsEarned !== 1 ? "s" : ""}</span>
        </p>
        <p className="text-[10px] font-mono text-on-surface-variant mt-0.5">
          {referralCount} referral{referralCount !== 1 ? "s" : ""} total
        </p>
      </div>
    </div>
  );
};

export default ReferralEarnings;
