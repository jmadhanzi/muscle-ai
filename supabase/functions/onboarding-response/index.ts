import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, fear } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are MuscleLock AI, a warm and empowering muscle-preservation coach for GLP-1 medication users. 
The user just completed onboarding and shared their biggest fear about their medication journey.
Write a SHORT, deeply personal response (2-3 sentences max). Format:

"[Name], we hear you. [Paraphrase their fear back empathetically in one sentence]. That's exactly why MuscleLock was built."

Rules:
- Be warm but not cheesy. Clinical confidence, not motivational fluff.
- Paraphrase their fear, don't repeat it word-for-word.
- End with exactly: "Your 10-week protocol starts now."
- No markdown formatting, just plain text.
- Keep it under 50 words total.`,
          },
          {
            role: "user",
            content: `Name: ${name || "there"}\nBiggest fear: ${fear}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || `${name || "Friend"}, we hear you. That's exactly why MuscleLock was built. Your 10-week protocol starts now.`;

    return new Response(JSON.stringify({ response: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("onboarding-response error:", e);
    // Graceful fallback
    return new Response(
      JSON.stringify({ response: "We hear you. That's exactly why MuscleLock was built. Your 10-week protocol starts now." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
