ALTER TABLE public.onboarding_data
  ADD COLUMN height_cm NUMERIC,
  ADD COLUMN weight_kg NUMERIC,
  ADD COLUMN activity_level TEXT,
  ADD COLUMN fitness_goals TEXT[],
  ADD COLUMN body_concerns TEXT[];