
-- =============================================
-- STEP 1: Expand profiles table with all onboarding + new fields
-- =============================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sex text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS glp1_drug text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weeks_on_medication integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS injection_day text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_weight decimal;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goal_weight decimal;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight_unit text DEFAULT 'lbs';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fitness_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nausea_frequency text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protein_target integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS muscle_score integer DEFAULT 35;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_week integer DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biggest_fear text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_goal text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protein_intake text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS muscle_concern text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm decimal;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS workouts_per_week integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fitness_goals text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS body_concerns text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biological_sex text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medication text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nausea_level text;

-- Add unique constraint on referral_code (allow NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_unique ON public.profiles (referral_code) WHERE referral_code IS NOT NULL;

-- =============================================
-- STEP 2: Migrate data from onboarding_data into profiles
-- =============================================

UPDATE public.profiles p SET
  age = o.age,
  biological_sex = o.biological_sex,
  medication = o.medication,
  glp1_drug = o.medication,
  weeks_on_medication = o.weeks_on_medication,
  injection_day = o.injection_day,
  current_weight = o.weight_kg,
  goal_weight = o.goal_weight,
  weight_unit = COALESCE(o.weight_unit, 'lbs'),
  fitness_level = o.fitness_level,
  nausea_frequency = o.nausea_level,
  nausea_level = o.nausea_level,
  protein_intake = o.protein_intake,
  primary_goal = o.primary_goal,
  muscle_concern = o.muscle_concern,
  activity_level = o.activity_level,
  height_cm = o.height_cm,
  workouts_per_week = o.workouts_per_week,
  fitness_goals = o.fitness_goals,
  body_concerns = o.body_concerns,
  biggest_fear = o.biggest_fear,
  onboarding_completed = o.onboarding_completed
FROM public.onboarding_data o
WHERE p.user_id = o.user_id;

-- =============================================
-- STEP 3: Create new tables
-- =============================================

-- Daily logs (replaces daily_tracking with richer schema)
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  date date DEFAULT CURRENT_DATE,
  protein_logged integer DEFAULT 0,
  workout_completed boolean DEFAULT false,
  workout_id text,
  injection_done boolean DEFAULT false,
  muscle_score_delta integer DEFAULT 0,
  mood text,
  notes text,
  checked_items text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily logs" ON public.daily_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily logs" ON public.daily_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs" ON public.daily_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Migrate existing daily_tracking data to daily_logs
INSERT INTO public.daily_logs (user_id, date, protein_logged, checked_items, created_at)
SELECT user_id, tracking_date, protein_intake, checked_items, created_at
FROM public.daily_tracking
ON CONFLICT (user_id, date) DO NOTHING;

-- Workout logs
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  workout_id text,
  week_number integer,
  day_number integer,
  exercises_completed jsonb,
  duration_minutes integer,
  completed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout logs" ON public.workout_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" ON public.workout_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" ON public.workout_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- AI conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  messages jsonb DEFAULT '[]',
  message_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI conversations" ON public.ai_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI conversations" ON public.ai_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations" ON public.ai_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Milestones (replaces user_milestones with richer schema)
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  milestone_type text,
  milestone_data jsonb,
  shared_count integer DEFAULT 0,
  unlocked_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones" ON public.milestones
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" ON public.milestones
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" ON public.milestones
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Migrate existing user_milestones data
INSERT INTO public.milestones (user_id, milestone_type, milestone_data, unlocked_at)
SELECT user_id, 'achievement', jsonb_build_object('milestone_id', milestone_id, 'shared_at', shared_at), unlocked_at
FROM public.user_milestones
ON CONFLICT DO NOTHING;

-- Protein logs
CREATE TABLE IF NOT EXISTS public.protein_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  date date DEFAULT CURRENT_DATE,
  amount_grams integer,
  meal_name text,
  logged_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.protein_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own protein logs" ON public.protein_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own protein logs" ON public.protein_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own protein logs" ON public.protein_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- STEP 4: Update the handle_new_user trigger function
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, onboarding_completed, muscle_score, current_week, streak_count, subscription_status, weight_unit)
  VALUES (NEW.id, false, 35, 1, 0, 'free', 'lbs');
  RETURN NEW;
END;
$function$;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_logs;
