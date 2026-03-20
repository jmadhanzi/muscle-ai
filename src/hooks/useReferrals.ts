import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Generate a friendly referral code like "sarah47" from name + random digits */
const generateFriendlyCode = (firstName?: string | null): string => {
  const base = (firstName || "user").toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
  const suffix = Math.floor(10 + Math.random() * 90); // 2-digit number
  return `${base}${suffix}`;
};

export function useReferrals(userId: string | undefined, firstName?: string | null) {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [monthsEarned, setMonthsEarned] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      // 1. Check if user already has a referral_code in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, first_name")
        .eq("user_id", userId)
        .single();

      let code = profile?.referral_code;

      // 2. If no code yet, generate and persist one
      if (!code) {
        code = generateFriendlyCode(firstName || profile?.first_name);
        await supabase
          .from("profiles")
          .update({ referral_code: code })
          .eq("user_id", userId);
      }

      setReferralCode(code);

      // 3. Load referral stats
      const { data: refs } = await supabase
        .from("referrals")
        .select("id, status")
        .eq("referrer_id", userId);

      if (refs) {
        setReferralCount(refs.length);
        setMonthsEarned(refs.filter((r) => r.status === "converted").length);
      }
      setLoaded(true);
    };
    load();
  }, [userId, firstName]);

  const ensureReferralExists = useCallback(async () => {
    if (!userId || !referralCode) return;
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
