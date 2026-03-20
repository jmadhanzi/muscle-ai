CREATE OR REPLACE FUNCTION public.get_referral_leaderboard()
RETURNS TABLE (
  display_name text,
  medication text,
  referral_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(
      LEFT(p.first_name, 1) || REPEAT('*', GREATEST(LENGTH(p.first_name) - 1, 2)),
      'User'
    ) AS display_name,
    COALESCE(p.medication, 'GLP-1') AS medication,
    COUNT(r.id) AS referral_count
  FROM public.profiles p
  INNER JOIN public.referrals r ON r.referrer_id = p.user_id AND r.status = 'converted'
  GROUP BY p.user_id, p.first_name, p.medication
  ORDER BY referral_count DESC
  LIMIT 10;
$$;