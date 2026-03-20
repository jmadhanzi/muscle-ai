import { useMemo } from "react";

interface StatsRowProps {
  injectionDay: string | null | undefined;
  proteinTarget: number;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StatsRow = ({ injectionDay, proteinTarget }: StatsRowProps) => {
  const daysUntilInjection = useMemo(() => {
    if (!injectionDay) return null;
    const today = new Date().getDay(); // 0=Sun
    const todayIdx = today === 0 ? 6 : today - 1; // 0=Mon
    const injIdx = DAYS.indexOf(injectionDay.toLowerCase());
    if (injIdx === -1) return null;
    const diff = (injIdx - todayIdx + 7) % 7;
    return diff === 0 ? 0 : diff;
  }, [injectionDay]);

  const injectionLabel = daysUntilInjection === null ? "—" : daysUntilInjection === 0 ? "Today!" : `${daysUntilInjection} day${daysUntilInjection > 1 ? "s" : ""}`;

  const stats = [
    {
      icon: "vaccines",
      label: "Next Injection",
      value: injectionLabel,
      color: daysUntilInjection === 0 ? "text-accent-danger" : "text-secondary",
    },
    {
      icon: "egg_alt",
      label: "Protein Today",
      value: `0/${proteinTarget}g`,
      color: "text-primary",
    },
    {
      icon: "local_fire_department",
      label: "Week Streak",
      value: "Day 1",
      color: "text-accent-gold",
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-shrink-0 w-[calc(33.33%-0.33rem)] min-w-[110px] bg-surface-container-low rounded-lg p-4"
        >
          <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
          <p className={`font-headline font-bold text-lg ${stat.color} mt-1.5 leading-none`}>{stat.value}</p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
