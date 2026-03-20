import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

interface UseInAppNotificationsProps {
  injectionDay: string | null | undefined;
  streakDays: number;
  checkedItemsCount: number;
  isPro: boolean;
}

export function useInAppNotifications({
  injectionDay,
  streakDays,
  checkedItemsCount,
  isPro,
}: UseInAppNotificationsProps) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    const now = new Date();
    const todayIdx = now.getDay();
    const hour = now.getHours();

    // ── Injection day alerts ──
    if (injectionDay) {
      const injIdx = DAYS.indexOf(injectionDay.toLowerCase());
      if (injIdx !== -1) {
        const diff = (injIdx - todayIdx + 7) % 7;

        if (diff === 0) {
          // It's injection day
          setTimeout(() => {
            toast({
              title: "💉 Injection Day",
              description: "Follow your injection protocol — eat protein before & after, stay hydrated.",
              variant: "destructive",
              duration: 8000,
            });
          }, 2000);
        } else if (diff === 1) {
          // Tomorrow is injection day
          setTimeout(() => {
            toast({
              title: "⏰ Injection day is tomorrow",
              description: "Prep your high-protein meals and plan a lighter workout.",
              duration: 6000,
            });
          }, 2000);
        }
      }
    }

    // ── Streak protection alerts ──
    if (hour >= 18 && checkedItemsCount === 0) {
      // Evening and no protocol items checked
      setTimeout(() => {
        toast({
          title: streakDays > 0 ? `🔥 Protect your ${streakDays}-day streak!` : "💪 Don't miss today",
          description: "You haven't logged any protocol items yet. Even one counts!",
          duration: 6000,
        });
      }, 4000);
    } else if (hour >= 14 && checkedItemsCount > 0 && checkedItemsCount < 3) {
      // Afternoon with partial completion
      setTimeout(() => {
        toast({
          title: "📋 Almost there!",
          description: `${3 - checkedItemsCount} more protocol items to complete today.`,
          duration: 5000,
        });
      }, 5000);
    }
  }, [injectionDay, streakDays, checkedItemsCount, isPro]);
}
