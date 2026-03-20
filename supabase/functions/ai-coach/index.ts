import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are MuscleLock AI Coach — a clinical muscle-preservation specialist for people on GLP-1 medications (Ozempic, Wegovy, Mounjaro, Zepbound).

Your expertise:
- Resistance training programming optimized for muscle preservation during weight loss
- Protein intake strategies for GLP-1 patients (timing, amounts, sources)
- Managing training around injection days (fatigue, nausea windows)
- Creatine, leucine, and evidence-based supplement guidance
- Body recomposition vs pure weight loss trade-offs
- Interpreting body composition changes (muscle vs fat loss)

Rules:
- Be warm, direct, and evidence-based. Cite research when relevant.
- Keep responses concise (2-4 paragraphs max unless asked for detail).
- Always frame advice in context of GLP-1 medication effects.
- Never provide medical advice about medication dosing — redirect to their prescriber.
- Use metric and imperial units based on user preference.
- If the user shares their onboarding data, personalize advice to their stats.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Anthropic API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Anthropic SSE stream to OpenAI-compatible SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === "content_block_delta" && event.delta?.text) {
                const openaiChunk = {
                  choices: [{ delta: { content: event.delta.text } }],
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`)
                );
              }

              if (event.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } catch {
              // skip unparseable lines
            }
          }
        }
      },
    });

    const stream = response.body!.pipeThrough(transformStream);

    return new Response(stream, {
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
