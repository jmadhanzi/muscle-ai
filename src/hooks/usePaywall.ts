import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type PaywallTrigger =
  | "workout_day2"
  | "ai_message_4"
  | "meal_locked"
  | "week2_unlock"
  | "analytics_tap"
  | "day3_return"
  | "injection_day"
  | "score_improvement"
  | "milestone_share"
  | "protocol_locked"
  | "generic";

interface PaywallCopy {
  feature: string;
  headline: string;
  body: string;
}

const PAYWALL_COPY: Record<PaywallTrigger, PaywallCopy> = {
  workout_day2: {
    feature: "Full Workout Program",
    headline: "Day 1 done — don't lose momentum",
    body: "Unlock the full 10-week progressive program designed to preserve every pound of muscle on GLP-1.",
  },
  ai_message_4: {
    feature: "Unlimited AI Coach",
    headline: "Your AI Coach has more to say",
    body: "You've used your 3 free messages. Go Pro for unlimited, personalized muscle-preservation coaching.",
  },
  meal_locked: {
    feature: "Full Meal Library",
    headline: "Fuel your muscle preservation",
    body: "Access all 47 injection-day-synced meals with macro breakdowns and timing protocols.",
  },
  week2_unlock: {
    feature: "Week 2+ Workouts",
    headline: "Week 1 complete — keep building",
    body: "You've proven you can show up. Unlock the next 9 weeks of progressive training.",
  },
  analytics_tap: {
    feature: "Progress Analytics",
    headline: "See the full picture",
    body: "Track body composition, strength index, and protocol adherence with advanced analytics.",
  },
  day3_return: {
    feature: "Streak Protection",
    headline: "Welcome back — protect your streak",
    body: "You're building consistency. Lock it in with Pro to track your progress and never lose a day.",
  },
  injection_day: {
    feature: "Injection Day Protocol",
    headline: "Tomorrow's injection day",
    body: "Get the full injection-day protocol: optimal meal timing, workout adjustments, and supplement schedule.",
  },
  score_improvement: {
    feature: "Muscle Score Insights",
    headline: "Your score is climbing — lock it in",
    body: "You're making real progress. Upgrade to see detailed insights and keep your score rising.",
  },
  milestone_share: {
    feature: "All Milestone Cards",
    headline: "Share your wins",
    body: "Unlock all 12 shareable milestone cards to celebrate your muscle preservation journey.",
  },
  protocol_locked: {
    feature: "Full Protocol",
    headline: "Unlock your complete protocol",
    body: "Get access to sleep optimization, meal timing, and recovery protocols for maximum muscle retention.",
  },
  generic: {
    feature: "Pro Features",
    headline: "Go Pro for full access",
    body: "Upgrade to access your full muscle preservation protocol.",
  },
};

// Session-level dedup: tracks which triggers have already fired this session
const firedThisSession = new Set<PaywallTrigger>();

export function usePaywall() {
  const { isPro } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState<PaywallTrigger>("generic");
  const isWorkoutActive = useRef(false);

  const setWorkoutActive = useCallback((active: boolean) => {
    isWorkoutActive.current = active;
  }, []);

  const fire = useCallback(
    (trigger: PaywallTrigger): boolean => {
      // Pro users never see paywall
      if (isPro) return false;
      // Never interrupt active workout
      if (isWorkoutActive.current) return false;
      // Never show twice in same session
      if (firedThisSession.has(trigger)) return false;

      firedThisSession.add(trigger);
      setActiveTrigger(trigger);
      setOpen(true);
      return true;
    },
    [isPro],
  );

  const close = useCallback(() => setOpen(false), []);

  const copy = PAYWALL_COPY[activeTrigger];

  return { open, fire, close, copy, activeTrigger, setWorkoutActive };
}

// Allow resetting for testing
export function resetPaywallSession() {
  firedThisSession.clear();
}
