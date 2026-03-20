export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          message_count: number | null
          messages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_count?: number | null
          messages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_count?: number | null
          messages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          checked_items: string[] | null
          created_at: string | null
          date: string | null
          id: string
          injection_done: boolean | null
          mood: string | null
          muscle_score_delta: number | null
          notes: string | null
          protein_logged: number | null
          user_id: string
          workout_completed: boolean | null
          workout_id: string | null
        }
        Insert: {
          checked_items?: string[] | null
          created_at?: string | null
          date?: string | null
          id?: string
          injection_done?: boolean | null
          mood?: string | null
          muscle_score_delta?: number | null
          notes?: string | null
          protein_logged?: number | null
          user_id: string
          workout_completed?: boolean | null
          workout_id?: string | null
        }
        Update: {
          checked_items?: string[] | null
          created_at?: string | null
          date?: string | null
          id?: string
          injection_done?: boolean | null
          mood?: string | null
          muscle_score_delta?: number | null
          notes?: string | null
          protein_logged?: number | null
          user_id?: string
          workout_completed?: boolean | null
          workout_id?: string | null
        }
        Relationships: []
      }
      daily_tracking: {
        Row: {
          checked_items: string[]
          created_at: string
          id: string
          protein_intake: number
          tracking_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_items?: string[]
          created_at?: string
          id?: string
          protein_intake?: number
          tracking_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_items?: string[]
          created_at?: string
          id?: string
          protein_intake?: number
          tracking_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          milestone_data: Json | null
          milestone_type: string | null
          shared_count: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          milestone_data?: Json | null
          milestone_type?: string | null
          shared_count?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          milestone_data?: Json | null
          milestone_type?: string | null
          shared_count?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          activity_level: string | null
          age: number | null
          biggest_fear: string | null
          biological_sex: string | null
          body_concerns: string[] | null
          created_at: string
          fitness_goals: string[] | null
          fitness_level: string | null
          goal_weight: number | null
          height_cm: number | null
          id: string
          injection_day: string | null
          medication: string | null
          muscle_concern: string | null
          nausea_level: string | null
          onboarding_completed: boolean
          primary_goal: string | null
          protein_intake: string | null
          updated_at: string
          user_id: string
          weeks_on_medication: number | null
          weight_kg: number | null
          weight_unit: string | null
          workouts_per_week: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          biggest_fear?: string | null
          biological_sex?: string | null
          body_concerns?: string[] | null
          created_at?: string
          fitness_goals?: string[] | null
          fitness_level?: string | null
          goal_weight?: number | null
          height_cm?: number | null
          id?: string
          injection_day?: string | null
          medication?: string | null
          muscle_concern?: string | null
          nausea_level?: string | null
          onboarding_completed?: boolean
          primary_goal?: string | null
          protein_intake?: string | null
          updated_at?: string
          user_id: string
          weeks_on_medication?: number | null
          weight_kg?: number | null
          weight_unit?: string | null
          workouts_per_week?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          biggest_fear?: string | null
          biological_sex?: string | null
          body_concerns?: string[] | null
          created_at?: string
          fitness_goals?: string[] | null
          fitness_level?: string | null
          goal_weight?: number | null
          height_cm?: number | null
          id?: string
          injection_day?: string | null
          medication?: string | null
          muscle_concern?: string | null
          nausea_level?: string | null
          onboarding_completed?: boolean
          primary_goal?: string | null
          protein_intake?: string | null
          updated_at?: string
          user_id?: string
          weeks_on_medication?: number | null
          weight_kg?: number | null
          weight_unit?: string | null
          workouts_per_week?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          biggest_fear: string | null
          biological_sex: string | null
          body_concerns: string[] | null
          created_at: string
          current_week: number | null
          current_weight: number | null
          first_name: string | null
          fitness_goals: string[] | null
          fitness_level: string | null
          glp1_drug: string | null
          goal_weight: number | null
          height_cm: number | null
          id: string
          injection_day: string | null
          last_active: string | null
          medication: string | null
          muscle_concern: string | null
          muscle_score: number | null
          nausea_frequency: string | null
          nausea_level: string | null
          onboarding_completed: boolean | null
          primary_goal: string | null
          protein_intake: string | null
          protein_target: number | null
          referral_code: string | null
          referred_by: string | null
          sex: string | null
          streak_count: number | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
          weeks_on_medication: number | null
          weight_unit: string | null
          workouts_per_week: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          biggest_fear?: string | null
          biological_sex?: string | null
          body_concerns?: string[] | null
          created_at?: string
          current_week?: number | null
          current_weight?: number | null
          first_name?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          glp1_drug?: string | null
          goal_weight?: number | null
          height_cm?: number | null
          id?: string
          injection_day?: string | null
          last_active?: string | null
          medication?: string | null
          muscle_concern?: string | null
          muscle_score?: number | null
          nausea_frequency?: string | null
          nausea_level?: string | null
          onboarding_completed?: boolean | null
          primary_goal?: string | null
          protein_intake?: string | null
          protein_target?: number | null
          referral_code?: string | null
          referred_by?: string | null
          sex?: string | null
          streak_count?: number | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
          weeks_on_medication?: number | null
          weight_unit?: string | null
          workouts_per_week?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          biggest_fear?: string | null
          biological_sex?: string | null
          body_concerns?: string[] | null
          created_at?: string
          current_week?: number | null
          current_weight?: number | null
          first_name?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          glp1_drug?: string | null
          goal_weight?: number | null
          height_cm?: number | null
          id?: string
          injection_day?: string | null
          last_active?: string | null
          medication?: string | null
          muscle_concern?: string | null
          muscle_score?: number | null
          nausea_frequency?: string | null
          nausea_level?: string | null
          onboarding_completed?: boolean | null
          primary_goal?: string | null
          protein_intake?: string | null
          protein_target?: number | null
          referral_code?: string | null
          referred_by?: string | null
          sex?: string | null
          streak_count?: number | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
          weeks_on_medication?: number | null
          weight_unit?: string | null
          workouts_per_week?: number | null
        }
        Relationships: []
      }
      protein_logs: {
        Row: {
          amount_grams: number | null
          date: string | null
          id: string
          logged_at: string | null
          meal_name: string | null
          user_id: string
        }
        Insert: {
          amount_grams?: number | null
          date?: string | null
          id?: string
          logged_at?: string | null
          meal_name?: string | null
          user_id: string
        }
        Update: {
          amount_grams?: number | null
          date?: string | null
          id?: string
          logged_at?: string | null
          meal_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          id: string
          milestone_id: number
          shared_at: string | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          milestone_id: number
          shared_at?: string | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          milestone_id?: number
          shared_at?: string | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          day_number: number | null
          duration_minutes: number | null
          exercises_completed: Json | null
          id: string
          user_id: string
          week_number: number | null
          workout_id: string | null
        }
        Insert: {
          completed_at?: string | null
          day_number?: number | null
          duration_minutes?: number | null
          exercises_completed?: Json | null
          id?: string
          user_id: string
          week_number?: number | null
          workout_id?: string | null
        }
        Update: {
          completed_at?: string | null
          day_number?: number | null
          duration_minutes?: number | null
          exercises_completed?: Json | null
          id?: string
          user_id?: string
          week_number?: number | null
          workout_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
