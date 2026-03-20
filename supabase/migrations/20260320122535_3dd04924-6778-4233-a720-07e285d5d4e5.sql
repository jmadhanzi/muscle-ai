
CREATE TABLE public.daily_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tracking_date date NOT NULL DEFAULT CURRENT_DATE,
  protein_intake integer NOT NULL DEFAULT 0,
  checked_items text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tracking_date)
);

ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tracking" ON public.daily_tracking
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracking" ON public.daily_tracking
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracking" ON public.daily_tracking
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_daily_tracking_updated_at
  BEFORE UPDATE ON public.daily_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
