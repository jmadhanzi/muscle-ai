import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";

const medications = [
  { value: "ozempic", label: "Ozempic", icon: "medication" },
  { value: "wegovy", label: "Wegovy", icon: "medication_liquid" },
  { value: "mounjaro", label: "Mounjaro", icon: "vaccines" },
  { value: "zepbound", label: "Zepbound", icon: "healing" },
  { value: "other", label: "Other", icon: "more_horiz" },
];

const dayValues = [
  { value: "monday", label: "MON" },
  { value: "tuesday", label: "TUE" },
  { value: "wednesday", label: "WED" },
  { value: "thursday", label: "THU" },
  { value: "friday", label: "FRI" },
  { value: "saturday", label: "SAT" },
  { value: "sunday", label: "SUN" },
];

const MedicationProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMed, setSelectedMed] = useState("ozempic");
  const [weeks, setWeeks] = useState(12);
  const [selectedDay, setSelectedDay] = useState("thursday");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const { data } = await supabase
        .from("onboarding_data")
        .select("medication, weeks_on_medication, injection_day")
        .eq("user_id", user.id)
        .single();
      if (data?.medication) setSelectedMed(data.medication);
      if (data?.weeks_on_medication != null) setWeeks(data.weeks_on_medication);
      if (data?.injection_day) setSelectedDay(data.injection_day);
    };
    loadData();
  }, [user]);

  const handleNext = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase
        .from("onboarding_data")
        .update({
          medication: selectedMed,
          weeks_on_medication: weeks,
          injection_day: selectedDay,
        })
        .eq("user_id", user.id);
      navigate("/onboarding/weight");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const medInfo: Record<string, string> = {
    ozempic: "Classic semaglutide. We have the most data on this. Your protocol is evidence-backed.",
    wegovy: "Higher-dose semaglutide. Muscle loss risk is amplified — your protocol will be more aggressive.",
    mounjaro: "Dual GIP/GLP-1 agonist. Unique metabolic profile — we'll optimize accordingly.",
    zepbound: "Tirzepatide for weight management. Similar profile to Mounjaro with distinct dosing.",
    other: "We'll use general GLP-1 protocols. You can update this later for more specific guidance.",
  };

  return (
    <OnboardingLayout
      step={2}
      footer={
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface leading-tight">
          Which GLP-1 are you on?
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-10">
        {medications.map((med) => (
          <button
            key={med.value}
            onClick={() => setSelectedMed(med.value)}
            className={`group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all active:scale-95 ${
              med.value === "other" ? "col-span-2" : ""
            } ${
              selectedMed === med.value
                ? "bg-surface-container-high border-2 border-primary"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container-high"
            }`}
          >
            {selectedMed === med.value && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined material-filled text-primary">check_circle</span>
              </div>
            )}
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <span className={`material-symbols-outlined text-4xl transition-opacity ${
                selectedMed === med.value ? "text-primary opacity-90" : "text-on-surface-variant opacity-50 group-hover:opacity-80"
              }`}>{med.icon}</span>
            </div>
            <span className={`font-headline font-bold text-lg ${
              selectedMed === med.value ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"
            }`}>{med.label}</span>
          </button>
        ))}
      </section>

      <div className="bg-secondary-container/10 border-l-4 border-secondary p-6 rounded-r-xl mb-12">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-secondary mt-1">psychology</span>
          <p className="text-on-surface text-sm leading-relaxed">
            <span className="font-bold text-secondary">{medications.find(m => m.value === selectedMed)?.label}.</span>{" "}
            {medInfo[selectedMed]}
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="font-headline font-bold text-xl text-on-surface">How many weeks have you been on it?</label>
            <span className="font-mono text-primary text-2xl font-bold">
              {weeks} <span className="text-xs uppercase tracking-widest text-on-surface-variant">weeks</span>
            </span>
          </div>
          <div className="px-2">
            <input
              className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
              type="range"
              min="0"
              max="104"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            />
            <div className="flex justify-between mt-3 px-1 text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">
              <span>0 weeks</span>
              <span>52 weeks (1yr)</span>
              <span>104 weeks</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="font-headline font-bold text-xl text-on-surface block">What day do you inject?</label>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {dayValues.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`flex-1 min-w-[3.5rem] aspect-square rounded-full flex items-center justify-center font-mono text-sm transition-all active:scale-90 ${
                  selectedDay === day.value
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_0_15px_hsla(160,100%,45%,0.3)]"
                    : "border-2 border-outline-variant/30 text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default MedicationProfile;
