
ALTER TABLE public.onboarding_data
  ADD COLUMN IF NOT EXISTS goal_weight numeric,
  ADD COLUMN IF NOT EXISTS weight_unit text DEFAULT 'lbs',
  ADD COLUMN IF NOT EXISTS muscle_concern text,
  ADD COLUMN IF NOT EXISTS fitness_level text,
  ADD COLUMN IF NOT EXISTS workouts_per_week integer,
  ADD COLUMN IF NOT EXISTS protein_intake text,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS biggest_fear text;
