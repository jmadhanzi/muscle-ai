import type { OnboardingData } from "@/pages/Dashboard";

interface QuickStatsProps {
  data: OnboardingData;
}

const DashboardQuickStats = ({ data }: QuickStatsProps) => (
  <div className="grid grid-cols-3 gap-2">
    <div className="bg-surface-container-low rounded-lg p-4 text-center">
      <span className="material-symbols-outlined text-secondary text-xl">fitness_center</span>
      <p className="font-headline font-bold text-on-surface text-lg mt-1 capitalize">
        {data.fitness_level?.replace("_", " ") || "—"}
      </p>
      <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Fitness</p>
    </div>
    <div className="bg-surface-container-low rounded-lg p-4 text-center">
      <span className="material-symbols-outlined text-primary text-xl">egg_alt</span>
      <p className="font-headline font-bold text-on-surface text-sm mt-1">
        {data.protein_intake?.replace(/_/g, " ") || "—"}
      </p>
      <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Protein</p>
    </div>
    <div className="bg-surface-container-low rounded-lg p-4 text-center">
      <span className="material-symbols-outlined text-accent-gold text-xl">flag</span>
      <p className="font-headline font-bold text-on-surface text-sm mt-1 capitalize">
        {data.primary_goal?.replace(/_/g, " ") || "—"}
      </p>
      <p className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant">Goal</p>
    </div>
  </div>
);

export default DashboardQuickStats;
