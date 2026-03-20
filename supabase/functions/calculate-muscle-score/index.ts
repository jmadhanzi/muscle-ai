import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Drug-specific muscle-loss risk multipliers (higher = more risk)
const DRUG_RISK: Record<string, number> = {
  semaglutide: 1.0,
  wegovy: 1.0,
  ozempic: 0.9,
  tirzepatide: 1.15,
  mounjaro: 1.15,
  zepbound: 1.15,
  liraglutide: 0.8,
  saxenda: 0.8,
};

interface ScoreFactors {
  proteinAdherence: number;   // 0-100: % of target met (avg last 7 days)
  workoutCompletion: number;  // 0-100: % of scheduled workouts completed
  streakDays: number;         // consecutive active days
  weeksOnMedication: number;
  drugType: string;
  currentWeight: number;
  goalWeight: number;
}

function calculateScore(f: ScoreFactors): { score: number; delta: number; breakdown: Record<string, number> } {
  // Base score starts at 50 (neutral)
  let score = 50;

  // 1. Protein adherence (max ±20 points)
  const proteinScore = ((f.proteinAdherence - 50) / 50) * 20;
  score += proteinScore;

  // 2. Workout completion (max ±15 points)
  const workoutScore = ((f.workoutCompletion - 50) / 50) * 15;
  score += workoutScore;

  // 3. Streak bonus (max +10 points, logarithmic)
  const streakScore = Math.min(10, Math.log2(f.streakDays + 1) * 3);
  score += streakScore;

  // 4. Drug risk penalty (0 to -10 points based on weeks)
  const drugMultiplier = DRUG_RISK[f.drugType?.toLowerCase()] ?? 1.0;
  const weeksPenalty = Math.min(10, (f.weeksOnMedication / 12) * 10 * drugMultiplier);
  score -= weeksPenalty;

  // 5. Weight loss velocity bonus/penalty
  // Losing weight too fast = more muscle risk
  if (f.currentWeight > 0 && f.goalWeight > 0) {
    const pctToGoal = ((f.currentWeight - f.goalWeight) / f.currentWeight) * 100;
    if (pctToGoal > 20) {
      score -= 5; // aggressive goal = higher risk
    }
  }

  // Clamp to 0-100
  score = Math.round(Math.max(0, Math.min(100, score)));

  // Delta from previous neutral baseline
  const delta = score - 50;

  return {
    score,
    delta,
    breakdown: {
      protein: Math.round(proteinScore),
      workout: Math.round(workoutScore),
      streak: Math.round(streakScore),
      drugRisk: -Math.round(weeksPenalty),
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId } = await req.json();
    if (!userId) throw new Error("userId is required");

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_weight, goal_weight, weight_unit, weeks_on_medication, medication, glp1_drug, protein_target, streak_count, muscle_score")
      .eq("user_id", userId)
      .single();

    if (!profile) throw new Error("Profile not found");

    const todayStr = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().slice(0, 10);

    // Fetch last 7 days of daily logs
    const { data: logs } = await supabase
      .from("daily_logs")
      .select("protein_logged, workout_completed, checked_items")
      .eq("user_id", userId)
      .gte("date", weekAgoStr)
      .lte("date", todayStr);

    // Calculate protein adherence
    const proteinTarget = profile.protein_target || 120;
    const proteinDays = (logs || []).filter((l: any) => l.protein_logged > 0);
    const avgProtein = proteinDays.length > 0
      ? proteinDays.reduce((sum: number, l: any) => sum + (l.protein_logged || 0), 0) / proteinDays.length
      : 0;
    const proteinAdherence = Math.min(100, (avgProtein / proteinTarget) * 100);

    // Calculate workout completion (assume 3 per week target)
    const workoutsCompleted = (logs || []).filter((l: any) => l.workout_completed).length;
    const workoutCompletion = Math.min(100, (workoutsCompleted / 3) * 100);

    const drugName = profile.glp1_drug || profile.medication || "semaglutide";

    const factors: ScoreFactors = {
      proteinAdherence,
      workoutCompletion,
      streakDays: profile.streak_count || 0,
      weeksOnMedication: profile.weeks_on_medication || 0,
      drugType: drugName,
      currentWeight: Number(profile.current_weight) || 0,
      goalWeight: Number(profile.goal_weight) || 0,
    };

    const result = calculateScore(factors);

    // Update profile with new score
    const previousScore = profile.muscle_score || 35;
    const scoreDelta = result.score - previousScore;

    await supabase
      .from("profiles")
      .update({ muscle_score: result.score, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    // Log delta in today's daily log
    await supabase
      .from("daily_logs")
      .update({ muscle_score_delta: scoreDelta })
      .eq("user_id", userId)
      .eq("date", todayStr);

    return new Response(
      JSON.stringify({ score: result.score, delta: scoreDelta, breakdown: result.breakdown }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("calculate-muscle-score error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
