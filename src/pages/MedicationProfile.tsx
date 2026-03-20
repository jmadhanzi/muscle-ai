import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/OnboardingLayout";

const medications = [
  { name: "Ozempic", icon: "medication" },
  { name: "Wegovy", icon: "medication_liquid" },
  { name: "Mounjaro", icon: "vaccines" },
  { name: "Zepbound", icon: "healing" },
];

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MedicationProfile = () => {
  const { user } = useAuth();
  const [selectedMed, setSelectedMed] = useState("Ozempic");
  const [weeks, setWeeks] = useState(12);
  const [selectedDay, setSelectedDay] = useState("THU");
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

  const handleCalculate = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase
        .from("onboarding_data")
        .update({
          medication: selectedMed,
          weeks_on_medication: weeks,
          injection_day: selectedDay,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);
      toast.success("Profile saved! Your muscle protection protocol is being calculated.");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar showProfile showNotification />

      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full">
        <header className="mb-12">
          <div className="flex gap-2 mb-8 justify-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-12 rounded-full ${
                  i < 2
                    ? "bg-primary shadow-[0_0_12px_hsla(155,100%,71%,0.4)]"
                    : "bg-surface-container-highest"
                }`}
              />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface leading-tight text-center">
            Which GLP-1 are you on?
          </h1>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-10">
          {medications.map((med) => (
            <button
              key={med.name}
              onClick={() => setSelectedMed(med.name)}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all active:scale-95 ${
                selectedMed === med.name
                  ? "bg-surface-container-high border-2 border-primary"
                  : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container-high"
              }`}
            >
              {selectedMed === med.name && (
                <div className="absolute top-3 right-3">
                  <span className="material-symbols-outlined material-filled text-primary">check_circle</span>
                </div>
              )}
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-4xl transition-opacity ${
                    selectedMed === med.name ? "text-primary opacity-90" : "text-on-surface-variant opacity-50 group-hover:opacity-80"
                  }`}
                >
                  {med.icon}
                </span>
              </div>
              <span
                className={`font-headline font-bold text-lg ${
                  selectedMed === med.name ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"
                }`}
              >
                {med.name}
              </span>
            </button>
          ))}
        </section>

        <div className="bg-secondary-container/10 border-l-4 border-secondary p-6 rounded-r-xl mb-12">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary mt-1">psychology</span>
            <p className="text-on-surface text-sm leading-relaxed">
              <span className="font-bold text-secondary">Classic semaglutide.</span> We have the most data on this. Your protocol is evidence-backed.
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
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[3.5rem] aspect-square rounded-full flex items-center justify-center font-mono text-sm transition-all active:scale-90 ${
                    selectedDay === day
                      ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_0_15px_hsla(155,100%,71%,0.3)]"
                      : "border-2 border-outline-variant/30 text-on-surface-variant hover:border-primary/50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <button
            onClick={handleCalculate}
            disabled={saving}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_hsla(155,100%,71%,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Calculate My Risk"}
            <span className="material-symbols-outlined font-bold">trending_up</span>
          </button>
          <p className="text-center mt-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest opacity-60">
            Clinically validated biometric matching
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MedicationProfile;
