import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMilestones(userId: string | undefined) {
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [sharedIds, setSharedIds] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_milestones")
        .select("milestone_id, shared_at")
        .eq("user_id", userId);
      if (data) {
        setUnlockedIds(new Set(data.map((d) => d.milestone_id)));
        setSharedIds(new Set(data.filter((d) => d.shared_at).map((d) => d.milestone_id)));
      }
      setLoaded(true);
    };
    load();
  }, [userId]);

  const unlock = useCallback(
    async (milestoneId: number) => {
      if (!userId || unlockedIds.has(milestoneId)) return;
      setUnlockedIds((prev) => new Set(prev).add(milestoneId));
      await supabase.from("user_milestones").insert({
        user_id: userId,
        milestone_id: milestoneId,
      });
    },
    [userId, unlockedIds]
  );

  const markShared = useCallback(
    async (milestoneId: number) => {
      if (!userId) return;
      setSharedIds((prev) => new Set(prev).add(milestoneId));
      await supabase
        .from("user_milestones")
        .update({ shared_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("milestone_id", milestoneId);
    },
    [userId]
  );

  return { unlockedIds, sharedIds, loaded, unlock, markShared };
}
