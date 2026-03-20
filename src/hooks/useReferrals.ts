import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useReferrals(userId: string | undefined) {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [monthsEarned, setMonthsEarned] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setReferralCode(userId.slice(0, 8).toUpperCase());

    const load = async () => {
      const { data } = await supabase
        .from("referrals")
        .select("id, status")
        .eq("referrer_id", userId);
      if (data) {
        setReferralCount(data.length);
        setMonthsEarned(data.filter((r) => r.status === "converted").length);
      }
      setLoaded(true);
    };
    load();
  }, [userId]);

  const ensureReferralExists = useCallback(async () => {
    if (!userId) return;
    // Check if a referral entry exists for sharing tracking
    const { data } = await supabase
      .from("referrals")
      .select("id")
      .eq("referrer_id", userId)
      .eq("referral_code", referralCode)
      .eq("status", "pending")
      .limit(1);
    if (!data?.length) {
      await supabase.from("referrals").insert({
        referrer_id: userId,
        referral_code: referralCode,
        status: "pending",
      });
    }
  }, [userId, referralCode]);

  return { referralCode, referralCount, monthsEarned, loaded, ensureReferralExists };
}
