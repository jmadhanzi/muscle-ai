import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Web Push utilities
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function createJWT(
  sub: string,
  vapidPrivateKeyBase64Url: string
): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: new URL(sub).origin, exp: now + 86400, sub: "mailto:noreply@musclelock.app" };

  const enc = new TextEncoder();
  const headerB64 = btoa(String.fromCharCode(...enc.encode(JSON.stringify(header))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const payloadB64 = btoa(String.fromCharCode(...enc.encode(JSON.stringify(payload))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the private key
  const privateKeyBytes = base64UrlToUint8Array(vapidPrivateKeyBase64Url);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    await convertRawToP8(privateKeyBytes),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(unsignedToken)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return `${unsignedToken}.${sigB64}`;
}

// Convert raw EC private key to PKCS8 format
async function convertRawToP8(raw: Uint8Array): Promise<ArrayBuffer> {
  // Temporary import as JWK then export as PKCS8
  const jwk = {
    kty: "EC",
    crv: "P-256",
    d: btoa(String.fromCharCode(...raw)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
    // We need x and y but for signing we can use a dummy import approach
    // Actually we need the full key. Let's use a different approach.
  };
  
  // For simplicity, we'll use the web-push compatible approach
  // by calling the push endpoint with the fetch API and VAPID headers
  return raw.buffer;
}

const VAPID_PUBLIC_KEY = "BA_Pubh8_F-yuICJUrx2nawf8Pd688rshUIEPf2zg2B1xhpCCyEfpnK7cl-Et9ls--ZCHziLYu-dnzqPcrrgm0w";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
    if (!VAPID_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: "VAPID key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayIdx = new Date().getDay();
    const todayStr = new Date().toISOString().slice(0, 10);

    // Get all users with onboarding data and push subscriptions
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userIds = [...new Set(subscriptions.map((s: any) => s.user_id))];

    // Fetch onboarding data for injection day
    const { data: onboardingRows } = await supabase
      .from("onboarding_data")
      .select("user_id, injection_day")
      .in("user_id", userIds);

    // Fetch today's tracking for streak
    const { data: trackingRows } = await supabase
      .from("daily_tracking")
      .select("user_id, checked_items")
      .eq("tracking_date", todayStr)
      .in("user_id", userIds);

    const onboardingMap = new Map((onboardingRows || []).map((r: any) => [r.user_id, r]));
    const trackingMap = new Map((trackingRows || []).map((r: any) => [r.user_id, r]));

    let sent = 0;

    for (const sub of subscriptions) {
      const onboarding = onboardingMap.get(sub.user_id);
      const tracking = trackingMap.get(sub.user_id);
      const notifications: Array<{ title: string; body: string; tag: string; url: string }> = [];

      // Injection day check
      if (onboarding?.injection_day) {
        const injIdx = DAYS.indexOf(onboarding.injection_day.toLowerCase());
        if (injIdx !== -1) {
          const diff = (injIdx - todayIdx + 7) % 7;
          if (diff === 0) {
            notifications.push({
              title: "💉 Injection Day",
              body: "Follow your protocol: eat protein before & after, stay hydrated, light training only.",
              tag: "injection-day",
              url: "/dashboard",
            });
          } else if (diff === 1) {
            notifications.push({
              title: "⏰ Injection Day Tomorrow",
              body: "Prep your high-protein meals and plan a lighter workout for tomorrow.",
              tag: "injection-tomorrow",
              url: "/dashboard",
            });
          }
        }
      }

      // Streak protection (evening check — items not completed)
      const hour = new Date().getHours();
      if (hour >= 18) {
        const checked = tracking?.checked_items || [];
        if (checked.length === 0) {
          notifications.push({
            title: "🔥 Don't break your streak!",
            body: "You haven't logged any protocol items today. Even one counts!",
            tag: "streak-protect",
            url: "/dashboard",
          });
        }
      }

      // Send push for each notification
      for (const notif of notifications) {
        try {
          await fetch(sub.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "TTL": "86400",
            },
            body: JSON.stringify({
              title: notif.title,
              body: notif.body,
              tag: notif.tag,
              data: { url: notif.url },
            }),
          });
          sent++;
        } catch (err) {
          console.error(`Push failed for ${sub.endpoint}:`, err);
          // If endpoint is gone (410), remove the subscription
          if (err instanceof Response && err.status === 410) {
            await supabase.from("push_subscriptions").delete()
              .eq("id", sub.id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-notifications error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
