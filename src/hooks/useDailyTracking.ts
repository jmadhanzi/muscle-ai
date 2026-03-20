import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const todayStr = () => new Date().toISOString().slice(0, 10);

export function useDailyTracking(userId: string | undefined) {
  const [proteinIntake, setProteinIntake] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const saving = useRef(false);

  // Load today's data
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data } = await supabase
        .from("daily_tracking")
        .select("protein_intake, checked_items")
        .eq("user_id", userId)
        .eq("tracking_date", todayStr())
        .maybeSingle();
      if (data) {
        setProteinIntake(data.protein_intake);
        setCheckedItems(new Set(data.checked_items || []));
      }
      setLoaded(true);
    };
    load();
  }, [userId]);

  // Persist helper
  const persist = useCallback(
    async (protein: number, items: Set<string>) => {
      if (!userId || saving.current) return;
      saving.current = true;
      const checked_items = Array.from(items);
      const row = {
        user_id: userId,
        tracking_date: todayStr(),
        protein_intake: protein,
        checked_items,
      };
      // Upsert by unique (user_id, tracking_date)
      await supabase.from("daily_tracking").upsert(row, {
        onConflict: "user_id,tracking_date",
      });
      saving.current = false;
    },
    [userId]
  );

  const addProtein = useCallback(
    (amount: number) => {
      setProteinIntake((prev) => {
        const next = prev + amount;
        persist(next, checkedItems);
        return next;
      });
    },
    [checkedItems, persist]
  );

  const toggleItem = useCallback(
    (id: string) => {
      setCheckedItems((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        persist(proteinIntake, next);
        return next;
      });
    },
    [proteinIntake, persist]
  );

  return { proteinIntake, checkedItems, addProtein, toggleItem, loaded };
}
