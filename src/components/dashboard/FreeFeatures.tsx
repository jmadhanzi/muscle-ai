import { useNavigate } from "react-router-dom";
import { FREE_FEATURES } from "@/config/features";

interface FreeFeaturesProps {
  onPaywall: (feature: string) => void;
}

const DashboardFreeFeatures = ({ onPaywall }: FreeFeaturesProps) => {
  const navigate = useNavigate();

  const handleTap = (id: string) => {
    switch (id) {
      case "ai_coach_limited": navigate("/coach"); break;
      case "week1_day1": navigate("/workouts"); break;
      case "injection_meals": navigate("/nutrition"); break;
      case "protein_calc": navigate("/nutrition"); break;
      default: break;
    }
  };

  return (
    <div>
      <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Your Free Tools</h2>
      <div className="grid grid-cols-2 gap-2">
        {FREE_FEATURES.slice(0, 6).map((feat) => (
          <button
            key={feat.id}
            onClick={() => handleTap(feat.id)}
            className="bg-surface-container-low rounded-lg p-4 text-left hover:bg-surface-container transition-colors active:scale-[0.97] duration-200"
          >
            <span className="material-symbols-outlined text-primary text-xl mb-2 block">{feat.icon}</span>
            <p className="text-sm font-medium text-on-surface leading-tight">{feat.label}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{feat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardFreeFeatures;
