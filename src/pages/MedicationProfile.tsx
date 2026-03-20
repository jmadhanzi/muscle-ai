import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingLayout from "@/components/OnboardingLayout";

const medications = [
  { value: "ozempic", label: "Ozempic", sub: "semaglutide", color: "from-[hsl(210,60%,35%)] to-[hsl(210,50%,25%)]" },
  { value: "wegovy", label: "Wegovy", sub: "semaglutide", color: "from-[hsl(280,40%,35%)] to-[hsl(280,35%,25%)]" },
  { value: "mounjaro", label: "Mounjaro", sub: "tirzepatide", color: "from-[hsl(25,70%,35%)] to-[hsl(25,60%,25%)]" },
  { value: "zepbound", label: "Zepbound", sub: "tirzepatide", color: "from-[hsl(340,50%,35%)] to-[hsl(340,45%,25%)]" },
];

const dayValues = [
  { value: "monday", label: "M" },
  { value: "tuesday", label: "T" },
  { value: "wednesday", label: "W" },
  { value: "thursday", label: "T" },
  { value: "friday", label: "F" },
  { value: "saturday", label: "S" },
  { value: "sunday", label: "S" },
];

const dayFull: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

const medResponse: Record<string, { icon: string; text: string; border: string }> = {
  ozempic: { icon: "science", text: "Classic semaglutide. We have the most data on this — your protocol is fully evidence-backed.", border: "border-secondary" },
  wegovy: { icon: "warning", text: "Higher-dose semaglutide means faster weight loss — and faster muscle loss. Your protocol will be more aggressive.", border: "border-secondary" },
  mounjaro: { icon: "bolt", text: "Tirzepatide users lose weight 23% faster than semaglutide — which means muscle loss risk is HIGHER. Your protocol will be more aggressive.", border: "border-destructive" },
  zepbound: { icon: "bolt", text: "Tirzepatide users lose weight 23% faster than semaglutide — which means muscle loss risk is HIGHER. Your protocol will be more aggressive.", border: "border-destructive" },
  other: { icon: "info", text: "We'll use general GLP-1 protocols and optimize as we learn more about your response.", border: "border-on-surface-variant" },
};

const weeksMessage = (w: number) => {
  if (w <= 4) return { text: "Perfect timing. You're in the early phase — we can protect you from day 1.", icon: "rocket_launch", color: "text-primary" };
  if (w <= 12) return { text: "You're in the peak loss phase. Muscle protection is urgent right now.", icon: "warning", color: "text-destructive" };
  if (w <= 52) return { text: "You may have already lost some muscle. Let's stop it here and rebuild.", icon: "fitness_center", color: "text-secondary" };
  return { text: "Long-term user. Maintenance protocol activated. Let's optimize.", icon: "verified", color: "text-primary" };
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const MedicationProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMed, setSelectedMed] = useState("ozempic");
  const [weeks, setWeeks] = useState(12);
  const [selectedDay, setSelectedDay] = useState("thursday");
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("medication, weeks_on_medication, injection_day, first_name")
        .eq("user_id", user.id)
        .single();
      if (data?.medication) setSelectedMed(data.medication);
      if (data?.weeks_on_medication != null) setWeeks(data.weeks_on_medication);
      if (data?.injection_day) setSelectedDay(data.injection_day);
      if (data?.first_name) setFirstName(data.first_name);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase
        .from("profiles")
        .update({ medication: selectedMed, glp1_drug: selectedMed, weeks_on_medication: weeks, injection_day: selectedDay })
        .eq("user_id", user.id);
      navigate("/onboarding/weight");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const wMsg = weeksMessage(weeks);
  const resp = medResponse[selectedMed];
  const name = firstName.trim();

  return (
    <OnboardingLayout
      step={2}
      footer={
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <motion.header className="mb-10" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface leading-[1.1]">
          Which GLP-1 are you on{name ? `, ${name}` : ""}?
        </h1>
      </motion.header>

      <motion.div className="space-y-14" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-5 block">01 / Medication</span>
          <div className="grid grid-cols-2 gap-3">
            {medications.map((med) => (
              <button
                key={med.value}
                onClick={() => setSelectedMed(med.value)}
                className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-200 active:scale-[0.96] ${
                  selectedMed === med.value
                    ? `bg-gradient-to-br ${med.color} border-2 border-primary shadow-[0_0_24px_hsla(160,100%,45%,0.15)]`
                    : "bg-surface-container-low border-2 border-transparent hover:border-outline-variant/30"
                }`}
              >
                {selectedMed === med.value && (
                  <div className="absolute top-3 right-3">
                    <span className="material-symbols-outlined material-filled text-primary text-lg">check_circle</span>
                  </div>
                )}
                <span className="text-3xl mb-2">💉</span>
                <span className={`font-headline font-bold text-lg leading-tight ${
                  selectedMed === med.value ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"
                }`}>{med.label}</span>
                <span className={`text-xs font-mono mt-1 ${
                  selectedMed === med.value ? "text-primary" : "text-on-surface-variant/60"
                }`}>{med.sub}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedMed("other")}
            className={`w-full mt-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
              selectedMed === "other"
                ? "bg-surface-container-high border-2 border-primary text-on-surface"
                : "bg-surface-container-low border-2 border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Other GLP-1 medication
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMed}
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="overflow-hidden"
            >
              <div className={`mt-5 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 ${resp.border}`}>
                <span className={`material-symbols-outlined material-filled shrink-0 ${
                  resp.border.includes("destructive") ? "text-destructive" : "text-secondary"
                }`}>{resp.icon}</span>
                <p className="text-sm leading-relaxed text-on-surface">{resp.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-5 block">02 / Duration</span>
          <div className="bg-surface-container-low rounded-2xl p-8">
            <div className="flex justify-between items-end mb-6">
              <label className="text-sm font-medium text-on-surface-variant">How many weeks have you been on it?</label>
              <span className="font-mono text-3xl font-bold text-on-surface">
                {weeks}<span className="text-xs ml-1.5 text-on-surface-variant tracking-widest uppercase">wk</span>
              </span>
            </div>
            <input
              className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsla(160,100%,45%,0.4)]"
              type="range" min="0" max="104" value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            />
            <div className="flex justify-between mt-3 text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
              <span>0</span><span>26</span><span>52 (1yr)</span><span>104</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={weeks <= 4 ? "a" : weeks <= 12 ? "b" : weeks <= 52 ? "c" : "d"}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="mt-6 flex items-start gap-3"
              >
                <span className={`material-symbols-outlined material-filled ${wMsg.color} shrink-0`}>{wMsg.icon}</span>
                <p className="text-sm leading-relaxed text-on-surface">{name ? `${name}, ` : ""}{wMsg.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-5 block">03 / Schedule</span>
          <label className="text-sm font-medium text-on-surface-variant block mb-4 px-1">What day do you inject?</label>
          <div className="flex gap-2">
            {dayValues.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`flex-1 aspect-square rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-200 active:scale-90 ${
                  selectedDay === day.value
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_0_15px_hsla(160,100%,45%,0.3)]"
                    : "border-2 border-outline-variant/20 text-on-surface-variant hover:border-primary/40"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant mt-4 px-1">
            Every <span className="text-primary font-medium">{dayFull[selectedDay]}</span> we'll activate your{" "}
            <span className="text-on-surface font-medium">Injection Day Protocol</span> — adjusted workouts &amp; nutrition around your shot.
          </p>
        </motion.div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default MedicationProfile;
