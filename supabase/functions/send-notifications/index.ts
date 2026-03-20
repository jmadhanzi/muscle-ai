import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// ── Nudge rule evaluators ──

interface UserContext {
  userId: string;
  firstName: string | null;
  injectionDay: string | null;
  weeksOnMedication: number | null;
  proteinTarget: number;
  todayProtein: number;
  checkedItems: string[];
  streakDays: number;
  lastOpenedAt: string | null; // ISO timestamp
  todayIdx: number;
  hour: number;
  weekNumber: number;
}

interface Notification {
  title: string;
  body: string;
  tag: string;
  url: string;
  priority: string;
}

function evaluateNudges(ctx: UserContext): Notification[] {
  const notifs: Notification[] = [];
  const name = ctx.firstName || "there";

  // ── 1. Injection Day Protocol (HIGHEST PRIORITY) ──
  if (ctx.injectionDay) {
    const injIdx = DAYS.indexOf(ctx.injectionDay.toLowerCase());
    if (injIdx !== -1) {
      const diff = (injIdx - ctx.todayIdx + 7) % 7;

      // Day before injection — morning alert
      if (diff === 1 && ctx.hour >= 7 && ctx.hour < 10) {
        notifs.push({
          title: "💉 Injection day tomorrow",
          body: `${name}, your pre-injection meal plan is ready. Prep tonight for a smooth day.`,
          tag: "injection-tomorrow",
          url: "/nutrition",
          priority: "critical",
        });
      }

      // Injection day morning
      if (diff === 0 && ctx.hour >= 7 && ctx.hour < 10) {
        notifs.push({
          title: "💉 Injection Day Protocol",
          body: `Injection day, ${name}. Protein shake first. Injection second. Your full plan 👇`,
          tag: "injection-day",
          url: "/dashboard",
          priority: "critical",
        });
      }
    }
  }

  // ── 2. Protein Nudges (Behavioral) ──
  // Midday low protein — if < 30g by noon
  if (ctx.hour >= 12 && ctx.hour < 13 && ctx.todayProtein < 30) {
    const gap = ctx.proteinTarget - ctx.todayProtein;
    notifs.push({
      title: "🥩 Protein check-in",
      body: `${name}, you've logged ${ctx.todayProtein}g so far. ${gap}g to go — quick 20g recipe inside →`,
      tag: "midday-protein",
      url: "/nutrition",
      priority: "high",
    });
  }

  // Evening protein gap — if > 40g short by 6pm
  if (ctx.hour >= 18 && ctx.hour < 19) {
    const remaining = ctx.proteinTarget - ctx.todayProtein;
    if (remaining > 40) {
      notifs.push({
        title: "💪 Protein gap alert",
        body: `${remaining}g to go before midnight, ${name}. One shake gets you there.`,
        tag: "evening-protein",
        url: "/nutrition",
        priority: "high",
      });
    }
  }

  // ── 3. Streak Protection ──
  // Evening — no activity logged
  if (ctx.hour >= 20 && ctx.hour < 21 && ctx.checkedItems.length === 0) {
    notifs.push({
      title: ctx.streakDays > 0 ? `🔥 ${ctx.streakDays}-day streak at risk!` : "🔥 Don't miss today",
      body: "Even 10 minutes of movement counts. Open your nausea-day quick workout →",
      tag: "streak-risk",
      url: "/workouts",
      priority: "high",
    });
  }

  // Streak milestones — 7, 14, 21, 30
  if ([7, 14, 21, 30].includes(ctx.streakDays) && ctx.hour >= 9 && ctx.hour < 10) {
    notifs.push({
      title: `🏆 ${ctx.streakDays}-DAY STREAK!`,
      body: "Your muscle score jumped. Share this win with your community →",
      tag: "streak-milestone",
      url: "/progress",
      priority: "celebration",
    });
  }

  // ── 4. Monday Briefing ──
  if (ctx.todayIdx === 1 && ctx.hour >= 7 && ctx.hour < 8) {
    notifs.push({
      title: "📋 Weekly protocol is live",
      body: `Week ${ctx.weekNumber} protocol is ready, ${name}. Your AI coach left you a note →`,
      tag: "monday-briefing",
      url: "/workouts",
      priority: "medium",
    });
  }

  // ── 5. Re-engagement (48h no open) ──
  if (ctx.lastOpenedAt) {
    const hoursSinceOpen = (Date.now() - new Date(ctx.lastOpenedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceOpen >= 48 && ctx.hour >= 10 && ctx.hour < 11) {
      const riskGrams = Math.round((hoursSinceOpen / 24) * 3.5);
      notifs.push({
        title: "📉 Muscle Score dropping",
        body: `${name}, your protocol paused for ${Math.round(hoursSinceOpen / 24)} days = ~${riskGrams}g estimated muscle risk.`,
        tag: "reengagement",
        url: "/dashboard",
        priority: "re-engagement",
      });
    }
  }

  return notifs;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const todayIdx = now.getDay();
    const hour = now.getUTCHours(); // Note: adjust for user timezone if stored
    const todayStr = now.toISOString().slice(0, 10);

    // Get all push subscriptions
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (!subscriptions?.length) {
      return new Response(JSON.stringify({ sent: 0, evaluated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userIds = [...new Set(subscriptions.map((s: any) => s.user_id))];

    // Batch fetch all user data
    const [
      { data: profileRows },
      { data: trackingRows },
    ] = await Promise.all([
      supabase.from("profiles")
        .select("user_id, first_name, injection_day, weeks_on_medication, current_weight, weight_unit, goal_weight")
        .in("user_id", userIds),
      supabase.from("daily_logs")
        .select("user_id, protein_logged, checked_items")
        .eq("date", todayStr)
        .in("user_id", userIds),
    ]);

    const profMap = new Map((profileRows || []).map((r: any) => [r.user_id, r]));
    const trackMap = new Map((trackingRows || []).map((r: any) => [r.user_id, r]));

    // Calculate streak days per user (check last 7 days of tracking)
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weekTracking } = await supabase
      .from("daily_logs")
      .select("user_id, date, checked_items")
      .gte("date", weekAgo.toISOString().slice(0, 10))
      .in("user_id", userIds);

    const streakMap = new Map<string, number>();
    for (const uid of userIds) {
      const rows = (weekTracking || [])
        .filter((r: any) => r.user_id === uid && r.checked_items?.length > 0)
        .sort((a: any, b: any) => b.date.localeCompare(a.date));
      
      let streak = 0;
      const checkDate = new Date(now);
      for (let i = 0; i < 7; i++) {
        const dateStr = checkDate.toISOString().slice(0, 10);
        if (rows.some((r: any) => r.tracking_date === dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      streakMap.set(uid, streak);
    }

    let sent = 0;
    let evaluated = 0;
    const errors: string[] = [];

    // Group subscriptions by user
    const subsByUser = new Map<string, any[]>();
    for (const sub of subscriptions) {
      if (!subsByUser.has(sub.user_id)) subsByUser.set(sub.user_id, []);
      subsByUser.get(sub.user_id)!.push(sub);
    }

    for (const [userId, userSubs] of subsByUser) {
      const onb = onbMap.get(userId);
      const prof = profMap.get(userId);
      const track = trackMap.get(userId);

      // Calculate protein target
      const goalLbs = onb?.weight_unit === "kg"
        ? (onb?.goal_weight || 70) * 2.205
        : (onb?.goal_weight || 154);
      const proteinTarget = Math.round(goalLbs * 0.7);
      const weekNumber = Math.max(1, Math.ceil((onb?.weeks_on_medication || 1) * 7 / 7));

      const ctx: UserContext = {
        userId,
        firstName: prof?.first_name || null,
        injectionDay: onb?.injection_day || null,
        weeksOnMedication: onb?.weeks_on_medication || null,
        proteinTarget,
        todayProtein: track?.protein_intake || 0,
        checkedItems: track?.checked_items || [],
        streakDays: streakMap.get(userId) || 0,
        lastOpenedAt: null, // Would need a last_active tracking column
        todayIdx,
        hour,
        weekNumber,
      };

      const notifications = evaluateNudges(ctx);
      evaluated++;

      // Send to all of user's devices
      for (const notif of notifications) {
        for (const sub of userSubs) {
          try {
            const response = await fetch(sub.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                TTL: "86400",
              },
              body: JSON.stringify({
                title: notif.title,
                body: notif.body,
                tag: notif.tag,
                data: { url: notif.url },
              }),
            });

            if (response.ok) {
              sent++;
            } else if (response.status === 410) {
              // Subscription expired — clean up
              await supabase.from("push_subscriptions").delete().eq("id", sub.id);
            }
          } catch (err) {
            errors.push(`${sub.endpoint}: ${err}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ sent, evaluated, errors: errors.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-notifications error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
