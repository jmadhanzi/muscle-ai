import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

interface UseInAppNotificationsProps {
  injectionDay: string | null | undefined;
  streakDays: number;
  checkedItemsCount: number;
  proteinIntake: number;
  proteinTarget: number;
  firstName?: string;
  isPro: boolean;
}

export function useInAppNotifications({
  injectionDay,
  streakDays,
  checkedItemsCount,
  proteinIntake,
  proteinTarget,
  firstName,
  isPro,
}: UseInAppNotificationsProps) {
  const hasShown = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    const now = new Date();
    const todayIdx = now.getDay();
    const hour = now.getHours();
    const name = firstName || "there";

    // ── 1. Injection Day Alerts (HIGHEST PRIORITY) ──
    if (injectionDay) {
      const injIdx = DAYS.indexOf(injectionDay.toLowerCase());
      if (injIdx !== -1) {
        const diff = (injIdx - todayIdx + 7) % 7;

        if (diff === 0) {
          setTimeout(() => {
            toast({
              title: `💉 Injection Day, ${name}`,
              description: "Protein shake first. Injection second. Your full plan is ready.",
              variant: "destructive",
              duration: 8000,
            });
          }, 2000);
          return; // Don't stack with other notifs
        }

        if (diff === 1) {
          setTimeout(() => {
            toast({
              title: `⏰ Injection day is tomorrow, ${name}`,
              description: "Your pre-injection meal plan is ready. Prep tonight.",
              duration: 6000,
            });
          }, 2000);
        }
      }
    }

    // ── 2. Protein Nudges ──
    if (hour >= 12 && hour < 14 && proteinIntake < 30) {
      const remaining = proteinTarget - proteinIntake;
      setTimeout(() => {
        toast({
          title: `🥩 ${proteinIntake}g logged so far`,
          description: `${remaining}g to go, ${name}. Quick 20g protein recipe inside →`,
          duration: 6000,
        });
      }, 3000);
    } else if (hour >= 18 && (proteinTarget - proteinIntake) > 40) {
      const remaining = proteinTarget - proteinIntake;
      setTimeout(() => {
        toast({
          title: `💪 ${remaining}g to go before midnight`,
          description: "One shake gets you there. Open your meal plan →",
          duration: 6000,
        });
      }, 3000);
    }

    // ── 3. Streak Protection ──
    if (hour >= 20 && checkedItemsCount === 0) {
      setTimeout(() => {
        toast({
          title: streakDays > 0
            ? `🔥 ${streakDays}-day streak at risk!`
            : "🔥 Don't miss today",
          description: "Even 10 minutes of movement counts. Open your quick workout →",
          duration: 6000,
        });
      }, 4000);
    } else if (hour >= 14 && checkedItemsCount > 0 && checkedItemsCount < 3) {
      setTimeout(() => {
        toast({
          title: "📋 Almost there!",
          description: `${3 - checkedItemsCount} more protocol items to complete today.`,
          duration: 5000,
        });
      }, 5000);
    }

    // ── 4. Streak Milestones ──
    if ([7, 14, 21, 30].includes(streakDays)) {
      setTimeout(() => {
        toast({
          title: `🏆 ${streakDays}-DAY STREAK!`,
          description: "Your muscle score jumped. Share this win →",
          duration: 8000,
        });
      }, 2500);
    }

    // ── 5. Monday Briefing ──
    if (todayIdx === 1 && hour >= 7 && hour < 12) {
      const weekNum = Math.max(1, Math.ceil(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 10 + 1);
      setTimeout(() => {
        toast({
          title: `📋 Week ${weekNum} protocol is live`,
          description: `${name}, your AI coach left you a note →`,
          duration: 6000,
        });
      }, 3000);
    }
  }, [injectionDay, streakDays, checkedItemsCount, proteinIntake, proteinTarget, firstName, isPro, navigate]);
}
