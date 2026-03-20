// Central feature tier configuration for MuscleLock free vs pro

export type FeatureTier = "free" | "pro";

export interface FeatureConfig {
  id: string;
  label: string;
  description: string;
  tier: FeatureTier;
  icon: string; // Material Symbols icon name
}

// AI Coach limits
export const AI_COACH_FREE_LIMIT = 3;

// Free tier features
export const FREE_FEATURES: FeatureConfig[] = [
  { id: "muscle_projection", label: "Muscle loss projection", description: "Personalized calculation from onboarding", tier: "free", icon: "monitoring" },
  { id: "week1_day1", label: "Week 1 workout (Day 1)", description: "Just enough to taste it", tier: "free", icon: "fitness_center" },
  { id: "injection_meals", label: "3 injection day meals", description: "Basic meal suggestions", tier: "free", icon: "restaurant" },
  { id: "protein_calc", label: "Protein target calculator", description: "Based on your body weight", tier: "free", icon: "egg_alt" },
  { id: "ai_coach_limited", label: "AI Coach (3 messages)", description: "Limited coaching access", tier: "free", icon: "psychology" },
  { id: "muscle_score", label: "Muscle Score", description: "Risk score with dramatic reveal", tier: "free", icon: "monitor_heart" },
  { id: "injection_reminder", label: "Injection day reminder", description: "Basic weekly notification", tier: "free", icon: "notifications" },
  { id: "milestone_card", label: "1 shareable milestone", description: "Share your first win", tier: "free", icon: "share" },
];

// Pro tier features
export const PRO_FEATURES: FeatureConfig[] = [
  { id: "full_workouts", label: "10-week workout program", description: "Progressive resistance training", tier: "pro", icon: "fitness_center" },
  { id: "unlimited_coach", label: "Unlimited AI Coach", description: "24/7 muscle preservation expert", tier: "pro", icon: "psychology" },
  { id: "full_meals", label: "Full meal library (47 meals)", description: "Injection-day synced nutrition", tier: "pro", icon: "restaurant" },
  { id: "analytics", label: "Advanced analytics", description: "Body composition tracker", tier: "pro", icon: "analytics" },
  { id: "community", label: "Community challenges", description: "Compete and stay motivated", tier: "pro", icon: "groups" },
  { id: "supplements", label: "Custom supplement stack", description: "Evidence-based recommendations", tier: "pro", icon: "science" },
  { id: "video_checkins", label: "Weekly video check-ins", description: "AI-generated progress reviews", tier: "pro", icon: "videocam" },
  { id: "injection_protocol", label: "Full injection protocol", description: "Complete injection day system", tier: "pro", icon: "vaccines" },
  { id: "all_milestones", label: "All 12 milestone cards", description: "Shareable progress cards", tier: "pro", icon: "emoji_events" },
];

// Comparison table for subscription page
export const FEATURE_COMPARISON = [
  { feature: "Muscle loss projection", free: true, pro: true },
  { feature: "Day 1 workout", free: true, pro: true },
  { feature: "3 injection day meals", free: true, pro: true },
  { feature: "Protein target calculator", free: true, pro: true },
  { feature: "AI Coach (3 messages)", free: true, pro: true },
  { feature: "Muscle risk score", free: true, pro: true },
  { feature: "Basic injection reminder", free: true, pro: true },
  { feature: "1 milestone card", free: true, pro: true },
  { feature: "Full 10-week workouts", free: false, pro: true },
  { feature: "Unlimited AI Coach", free: false, pro: true },
  { feature: "47-meal library", free: false, pro: true },
  { feature: "Body composition tracker", free: false, pro: true },
  { feature: "Community challenges", free: false, pro: true },
  { feature: "Supplement recommendations", free: false, pro: true },
  { feature: "Weekly video check-ins", free: false, pro: true },
  { feature: "Full injection protocol", free: false, pro: true },
  { feature: "All 12 milestone cards", free: false, pro: true },
];

// Dashboard daily protocol items
export const DAILY_PROTOCOL = [
  { id: "protein", icon: "egg_alt", label: "Hit protein target", detail: "1.2g per kg body weight", free: true },
  { id: "resistance", icon: "fitness_center", label: "Resistance training", detail: "3 compound exercises", free: true },
  { id: "creatine", icon: "science", label: "Creatine monohydrate", detail: "5g daily", free: true },
  { id: "sleep", icon: "bedtime", label: "Sleep optimization", detail: "7-9 hours window", free: false },
  { id: "timing", icon: "schedule", label: "Meal timing protocol", detail: "Synced to injection day", free: false },
  { id: "recovery", icon: "self_improvement", label: "Recovery protocol", detail: "Active recovery plan", free: false },
];
