import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
