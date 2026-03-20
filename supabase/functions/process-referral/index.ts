import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[PROCESS-REFERRAL] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { referralCode, referredUserId } = await req.json();

    if (!referralCode || !referredUserId) {
      throw new Error("referralCode and referredUserId are required");
    }

    logStep("Processing referral", { referralCode, referredUserId });

    // Find the referral record
    const { data: referral, error: refError } = await supabase
      .from("referrals")
      .select("*")
      .eq("referral_code", referralCode)
      .eq("status", "pending")
      .is("referred_id", null)
      .single();

    if (refError || !referral) {
      logStep("No valid pending referral found");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or already used referral code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const referrerId = referral.referrer_id;

    // Prevent self-referral
    if (referrerId === referredUserId) {
      return new Response(
        JSON.stringify({ success: false, error: "Cannot refer yourself" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Found referral", { referrerId, referralId: referral.id });

    // Mark referral as converted
    await supabase
      .from("referrals")
      .update({
        referred_id: referredUserId,
        status: "converted",
        converted_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    // Award referrer: extend subscription by 30 days
    const { data: referrerProfile } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_end_date")
      .eq("user_id", referrerId)
      .single();

    if (referrerProfile) {
      const currentEnd = referrerProfile.subscription_end_date
        ? new Date(referrerProfile.subscription_end_date)
        : new Date();
      const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()));
      newEnd.setDate(newEnd.getDate() + 30); // +30 days free

      await supabase
        .from("profiles")
        .update({
          subscription_status: "pro",
          subscription_end_date: newEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", referrerId);

      logStep("Referrer rewarded with 30 days", { referrerId, newEnd: newEnd.toISOString() });
    }

    // Award referred user: 7-day extended trial
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await supabase
      .from("profiles")
      .update({
        subscription_status: "pro",
        subscription_end_date: trialEnd.toISOString(),
        referred_by: referralCode,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", referredUserId);

    logStep("Referred user granted 7-day trial", { referredUserId });

    return new Response(
      JSON.stringify({
        success: true,
        referrerReward: "30 days free",
        referredReward: "7-day Pro trial",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("process-referral error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
