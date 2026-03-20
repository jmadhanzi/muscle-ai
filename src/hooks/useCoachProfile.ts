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
      const [{ data: profileRow }, { data: tracking }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("daily_logs")
          .select("protein_logged")
          .eq("user_id", userId)
          .eq("date", new Date().toISOString().slice(0, 10))
          .maybeSingle(),
      ]);

      if (profileRow) {
        setProfile({
          firstName: profileRow.first_name || undefined,
          age: profileRow.age || undefined,
          sex: profileRow.biological_sex || undefined,
          medication: profileRow.medication || undefined,
          weeksOnMedication: profileRow.weeks_on_medication || undefined,
          currentWeight: profileRow.current_weight ? Number(profileRow.current_weight) : undefined,
          goalWeight: profileRow.goal_weight ? Number(profileRow.goal_weight) : undefined,
          weightUnit: profileRow.weight_unit || "lbs",
          fitnessLevel: profileRow.fitness_level || undefined,
          injectionDay: profileRow.injection_day || undefined,
          nauseaLevel: profileRow.nausea_level || undefined,
          proteinIntake: profileRow.protein_intake || undefined,
          muscleConcern: profileRow.muscle_concern || undefined,
          primaryGoal: profileRow.primary_goal || undefined,
          proteinToday: tracking?.protein_logged ?? 0,
        });
      }
    };

    load();
  }, [userId]);

  return profile;
}
