// 10-week GLP-1 muscle preservation workout program data

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // "12" or "30s" for timed
  demo?: string; // YouTube ID or placeholder
  muscleGroup: string;
}

export interface WorkoutDay {
  day: string; // "Monday", "Tuesday", etc.
  title: string;
  type: "strength" | "recovery" | "hiit" | "nausea" | "rest";
  duration: number; // minutes
  level: string;
  exercises: Exercise[];
  coachNote: string; // dynamic template with {injectionDaysAgo}
  restPeriod: string;
}

export interface ProgramWeek {
  week: number;
  label: string;
  phase: string;
  days: WorkoutDay[];
  free: boolean; // week 1 is free
}

export const WEEK_PHASES: { weeks: string; label: string; phase: string }[] = [
  { weeks: "1", label: "Foundation", phase: "foundation" },
  { weeks: "2-3", label: "Building", phase: "building" },
  { weeks: "4", label: "Deload", phase: "deload" },
  { weeks: "5-7", label: "Intensity", phase: "intensity" },
  { weeks: "8", label: "Peak", phase: "peak" },
  { weeks: "9-10", label: "Maintenance", phase: "maintenance" },
];

export const GLP1_REST_TIPS = [
  "Eccentric (lowering) movements build 30% more muscle — slow it down.",
  "GLP-1 users retain more muscle when hitting 1.2g protein per kg body weight.",
  "Post-workout protein within 60 minutes maximizes muscle protein synthesis.",
  "Creatine monohydrate (5g/day) is the #1 supplement for preserving muscle on GLP-1.",
  "Your body is burning fat right now — resistance training tells it to keep the muscle.",
  "Compound movements like squats and rows stimulate more growth hormone.",
  "Hydration matters more on GLP-1. Aim for 3+ liters today.",
  "Sleep is when muscle repairs. 7-9 hours = maximum preservation.",
  "Even light resistance on nausea days sends a 'keep muscle' signal to your body.",
  "Progressive overload doesn't mean lifting heavier every time — more reps count too.",
];

const UPPER_EXERCISES: Exercise[] = [
  { name: "Goblet Squat", sets: 3, reps: "12", muscleGroup: "Quads, Glutes" },
  { name: "Dumbbell Row", sets: 3, reps: "10", muscleGroup: "Back, Biceps" },
  { name: "Push-Up Variation", sets: 3, reps: "8", muscleGroup: "Chest, Triceps" },
  { name: "Resistance Band Pull-Apart", sets: 2, reps: "15", muscleGroup: "Rear Delts" },
  { name: "Farmer Carry", sets: 3, reps: "30s", muscleGroup: "Core, Grip" },
];

const LOWER_EXERCISES: Exercise[] = [
  { name: "Romanian Deadlift", sets: 3, reps: "10", muscleGroup: "Hamstrings, Glutes" },
  { name: "Walking Lunge", sets: 3, reps: "12 each", muscleGroup: "Quads, Glutes" },
  { name: "Glute Bridge", sets: 3, reps: "15", muscleGroup: "Glutes" },
  { name: "Calf Raise", sets: 3, reps: "15", muscleGroup: "Calves" },
  { name: "Dead Bug", sets: 3, reps: "10 each", muscleGroup: "Core" },
];

const FULL_BODY_EXERCISES: Exercise[] = [
  { name: "Kettlebell Swing", sets: 3, reps: "15", muscleGroup: "Posterior Chain" },
  { name: "Overhead Press", sets: 3, reps: "10", muscleGroup: "Shoulders" },
  { name: "Sumo Squat", sets: 3, reps: "12", muscleGroup: "Quads, Adductors" },
  { name: "Bent-Over Row", sets: 3, reps: "10", muscleGroup: "Back" },
  { name: "Plank Hold", sets: 3, reps: "30s", muscleGroup: "Core" },
];

const RECOVERY_EXERCISES: Exercise[] = [
  { name: "Cat-Cow Stretch", sets: 2, reps: "10", muscleGroup: "Spine" },
  { name: "Hip 90/90 Stretch", sets: 2, reps: "30s each", muscleGroup: "Hips" },
  { name: "Band Pull-Apart", sets: 2, reps: "15", muscleGroup: "Upper Back" },
  { name: "Foam Roll — Full Body", sets: 1, reps: "5 min", muscleGroup: "All" },
];

const NAUSEA_EXERCISES: Exercise[] = [
  { name: "Seated Band Row", sets: 2, reps: "12", muscleGroup: "Back" },
  { name: "Seated Overhead Press", sets: 2, reps: "10", muscleGroup: "Shoulders" },
  { name: "Seated Leg Extension", sets: 2, reps: "12", muscleGroup: "Quads" },
  { name: "Seated Bicep Curl", sets: 2, reps: "12", muscleGroup: "Biceps" },
  { name: "Seated Calf Raise", sets: 2, reps: "15", muscleGroup: "Calves" },
];

function buildWeek(week: number): ProgramWeek {
  const phases: Record<number, { label: string; phase: string }> = {
    1: { label: "Foundation", phase: "foundation" },
    2: { label: "Building", phase: "building" },
    3: { label: "Building", phase: "building" },
    4: { label: "Deload", phase: "deload" },
    5: { label: "Intensity", phase: "intensity" },
    6: { label: "Intensity", phase: "intensity" },
    7: { label: "Intensity", phase: "intensity" },
    8: { label: "Peak", phase: "peak" },
    9: { label: "Maintenance", phase: "maintenance" },
    10: { label: "Results", phase: "maintenance" },
  };

  const { label, phase } = phases[week];

  const days: WorkoutDay[] = [
    {
      day: "Monday",
      title: "Upper Body Strength",
      type: "strength",
      duration: 35,
      level: week <= 3 ? "Beginner" : week <= 7 ? "Intermediate" : "Advanced",
      exercises: UPPER_EXERCISES.map((e) => ({
        ...e,
        sets: phase === "deload" ? Math.max(2, e.sets - 1) : phase === "intensity" || phase === "peak" ? e.sets + 1 : e.sets,
      })),
      coachNote: "Your injection was {injectionDaysAgo} days ago. Energy should be good today. Focus on the eccentric (lowering) phase — that's where muscle is built.",
      restPeriod: "90 seconds between sets",
    },
    {
      day: "Tuesday",
      title: "Active Recovery",
      type: "recovery",
      duration: 20,
      level: "All Levels",
      exercises: RECOVERY_EXERCISES,
      coachNote: "Recovery days aren't rest days — they're growth days. Light movement increases blood flow to healing muscle tissue.",
      restPeriod: "As needed",
    },
    {
      day: "Wednesday",
      title: "Lower Body Strength",
      type: "strength",
      duration: 40,
      level: week <= 3 ? "Beginner" : week <= 7 ? "Intermediate" : "Advanced",
      exercises: LOWER_EXERCISES.map((e) => ({
        ...e,
        sets: phase === "deload" ? Math.max(2, e.sets - 1) : phase === "intensity" || phase === "peak" ? e.sets + 1 : e.sets,
      })),
      coachNote: "Lower body has the largest muscles — preserving these is critical on GLP-1. Don't skip this one.",
      restPeriod: "90 seconds between sets",
    },
    {
      day: "Thursday",
      title: "Rest Day",
      type: "rest",
      duration: 0,
      level: "Rest",
      exercises: [],
      coachNote: "Full rest today. Focus on hitting your protein target and hydration. Muscles grow during rest.",
      restPeriod: "",
    },
    {
      day: "Friday",
      title: "Full Body Power",
      type: "strength",
      duration: 40,
      level: week <= 3 ? "Beginner" : week <= 7 ? "Intermediate" : "Advanced",
      exercises: FULL_BODY_EXERCISES.map((e) => ({
        ...e,
        sets: phase === "deload" ? Math.max(2, e.sets - 1) : phase === "intensity" || phase === "peak" ? e.sets + 1 : e.sets,
      })),
      coachNote: "Full body compound movements = maximum muscle preservation signal. Quality over quantity.",
      restPeriod: "90-120 seconds between sets",
    },
    {
      day: "Saturday",
      title: "HIIT-Light Circuit",
      type: "hiit",
      duration: 25,
      level: "Moderate",
      exercises: [
        { name: "Jump Squat", sets: 3, reps: "10", muscleGroup: "Quads" },
        { name: "Mountain Climber", sets: 3, reps: "20", muscleGroup: "Core" },
        { name: "Kettlebell Swing", sets: 3, reps: "12", muscleGroup: "Posterior Chain" },
        { name: "Burpee (modified)", sets: 3, reps: "8", muscleGroup: "Full Body" },
      ],
      coachNote: "Keep intensity moderate — we're preserving muscle, not running a marathon. If nauseous, switch to the nausea protocol.",
      restPeriod: "60 seconds between rounds",
    },
    {
      day: "Sunday",
      title: "Rest Day",
      type: "rest",
      duration: 0,
      level: "Rest",
      exercises: [],
      coachNote: "Rest and recover. Tomorrow we go again. You're building a body that keeps its muscle.",
      restPeriod: "",
    },
  ];

  return { week, label, phase, days, free: week === 1 };
}

export const PROGRAM: ProgramWeek[] = Array.from({ length: 10 }, (_, i) => buildWeek(i + 1));

export const NAUSEA_PROTOCOL: WorkoutDay = {
  day: "Any Day",
  title: "Nausea-Day Gentle Resistance",
  type: "nausea",
  duration: 15,
  level: "Seated Only",
  exercises: NAUSEA_EXERCISES,
  coachNote: "Having a rough GLP-1 day? This seated-only routine takes 15 minutes and still sends a 'keep muscle' signal to your body. Even this counts.",
  restPeriod: "60 seconds or as needed",
};
