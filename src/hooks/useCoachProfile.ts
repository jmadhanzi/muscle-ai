import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CoachUserProfile {
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

export function useCoachProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<CoachUserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const [{ data: onboarding }, { data: profileRow }, { data: tracking }] = await Promise.all([
        supabase
          .from("onboarding_data")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("first_name")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("daily_tracking")
          .select("protein_intake")
          .eq("user_id", userId)
          .eq("tracking_date", new Date().toISOString().slice(0, 10))
          .maybeSingle(),
      ]);

      if (onboarding) {
        setProfile({
          firstName: profileRow?.first_name || undefined,
          age: onboarding.age || undefined,
          sex: onboarding.biological_sex || undefined,
          medication: onboarding.medication || undefined,
          weeksOnMedication: onboarding.weeks_on_medication || undefined,
          currentWeight: onboarding.weight_kg ? Number(onboarding.weight_kg) : undefined,
          goalWeight: onboarding.goal_weight ? Number(onboarding.goal_weight) : undefined,
          weightUnit: onboarding.weight_unit || "lbs",
          fitnessLevel: onboarding.fitness_level || undefined,
          injectionDay: onboarding.injection_day || undefined,
          nauseaLevel: onboarding.nausea_level || undefined,
          proteinIntake: onboarding.protein_intake || undefined,
          muscleConcern: onboarding.muscle_concern || undefined,
          primaryGoal: onboarding.primary_goal || undefined,
          proteinToday: tracking?.protein_intake ?? 0,
        });
      }
    };

    load();
  }, [userId]);

  return profile;
}
