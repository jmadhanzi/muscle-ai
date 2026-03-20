import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_COACH_FREE_LIMIT = 3;

interface UserProfile {
  firstName?: string;
  age?: number;
  sex?: string;
  medication?: string;
  weeksOnMedication?: number;
  currentWeight?: number;
  goalWeight?: number;
  weightUnit?: string;
  fitnessLevel?: string;
  injectionDay?: string;
  nauseaLevel?: string;
  proteinIntake?: string;
  muscleConcern?: string;
  primaryGoal?: string;
  proteinToday?: number;
}

function buildSystemPrompt(profile?: UserProfile): string {
  const base = `You are MuscleLock AI — the world's most specialized GLP-1 muscle preservation coach.

You have deep expertise in exercise physiology, GLP-1 pharmacology, nutrition science, and behavioral psychology.`;

  const profileSection = profile ? `

USER PROFILE:
- Name: ${profile.firstName || "there"}
- Age: ${profile.age || "unknown"}, Sex: ${profile.sex || "not specified"}
- GLP-1 medication: ${profile.medication || "not specified"} (${profile.weeksOnMedication ?? "?"} weeks)
- Current weight: ${profile.currentWeight ?? "?"}${profile.weightUnit === "kg" ? "kg" : "lbs"}
- Goal weight: ${profile.goalWeight ?? "?"}${profile.weightUnit === "kg" ? "kg" : "lbs"}
- Muscle concern: ${profile.muscleConcern || "not specified"}
- Primary goal: ${profile.primaryGoal || "not specified"}
- Protein intake level: ${profile.proteinIntake || "not specified"}
- Fitness level: ${profile.fitnessLevel || "not specified"}
- Injection day: ${profile.injectionDay || "not specified"}
- Nausea level: ${profile.nauseaLevel || "not specified"}
- Protein logged today: ${profile.proteinToday ?? 0}g` : "";

  return `${base}${profileSection}

PERSONALITY: Warm but direct. Science-backed. Never preachy.
Use their name naturally. Celebrate small wins.
When they struggle, acknowledge emotions before giving advice.
Always tie advice to their SPECIFIC medication, body, and goals.

FORMAT: Use markdown. Keep responses under 200 words unless asked for detail.
Never recommend stopping medication. Always suggest consulting their doctor for medical changes.
End responses with 1 actionable step they can do RIGHT NOW.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Auth + subscription check ──
    const authHeader = req.headers.get("Authorization");
    let isPro = false;
    let messageCount = 0;

    if (authHeader) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        { auth: { persistSession: false } }
      );

      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      const userId = userData?.user?.id;

      if (userId) {
        // Check subscription status
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status, subscription_end_date")
          .eq("user_id", userId)
          .single();

        if (profile) {
          const endDate = profile.subscription_end_date ? new Date(profile.subscription_end_date) : null;
          isPro = profile.subscription_status === "pro" && (!endDate || endDate > new Date());
        }

        // Get or create conversation to track message count
        const { data: convo } = await supabase
          .from("ai_conversations")
          .select("id, message_count")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (convo) {
          messageCount = convo.message_count || 0;

          // Increment message count
          await supabase
            .from("ai_conversations")
            .update({
              message_count: messageCount + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", convo.id);
        }

        // Enforce free limit
        if (!isPro && messageCount >= AI_COACH_FREE_LIMIT) {
          return new Response(
            JSON.stringify({
              error: "free_limit_reached",
              message: `You've used all ${AI_COACH_FREE_LIMIT} free AI coach messages. Upgrade to Pro for unlimited coaching.`,
              limit: AI_COACH_FREE_LIMIT,
              used: messageCount,
            }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    const systemPrompt = buildSystemPrompt(userProfile);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("ai-coach error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
