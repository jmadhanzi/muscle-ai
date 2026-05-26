import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingLayout from "@/components/OnboardingLayout";

const ageMessage = (age: number) => {
  if (age < 40) return "Great timing to start protecting muscle.";
  if (age <= 55) return "This is the most critical decade for muscle preservation.";
  return "After 55, muscle protection becomes essential — you're smart to start now.";
};

const PersonalIdentity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState(48);
  const [selectedSex, setSelectedSex] = useState<string>("female");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, age, biological_sex")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.first_name) setFirstName(profile.first_name);
      if (profile?.age) setAge(profile.age);
      if (profile?.biological_sex) setSelectedSex(profile.biological_sex);
    };
    loadData();
  }, [user]);

  const handleNext = async () => {
    if (!user || !firstName.trim()) return;
    setSaving(true);
    try {
      // FIX: use upsert instead of update so it works for new users
      // who may not have a profile row yet (if the DB trigger failed).
      const { error } = await supabase.from("profiles").upsert({
        user_id: user.id,
        first_name: firstName.trim(),
        age,
        biological_sex: selectedSex,
      }, { onConflict: "user_id" });

      if (error) throw error;
      navigate("/medication-profile");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const nameVal = firstName.trim();

  return (
    <OnboardingLayout
      step={1}
      footer={
        <button
          onClick={handleNext}
          disabled={saving || !nameVal}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <motion.section className="mb-12" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.1] tracking-tight mb-4">
          Let's build your MuscleLock profile{nameVal ? `, ${nameVal}` : ""}.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          Precise biometric calibration to prevent medication-induced muscle loss.
        </p>
      </motion.section>

      <motion.div className="space-y-14" variants={stagger} initial="hidden" animate="show">
        {/* ── 01 First Name ── */}
        <motion.div className="space-y-5" variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase">01 / Identity</span>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-3">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-on-surface text-lg focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/40 transition-all outline-none"
            />
          </div>
        </motion.div>

        {/* ── 02 Age ── */}
        <motion.div className="space-y-5" variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase">02 / Age</span>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-on-surface-variant">Your age</label>
              <span className="font-headline font-bold text-2xl text-primary">{age}</span>
            </div>
            <input
              type="range" min={18} max={80} step={1} value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={age}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-on-surface-variant mt-3 italic"
              >
                {ageMessage(age)}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── 03 Biological Sex ── */}
        <motion.div className="space-y-5" variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase">03 / Biological Sex</span>
          <p className="text-xs text-on-surface-variant -mt-3">Used to calibrate protein targets and muscle preservation benchmarks.</p>
          <div className="grid grid-cols-3 gap-3">
            {sexOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedSex(opt.value)}
                className={`py-4 rounded-xl font-headline font-bold text-sm transition-all active:scale-95 ${
                  selectedSex === opt.value
                    ? "bg-primary text-primary-foreground shadow-[0_4px_16px_hsla(160,100%,45%,0.3)]"
                    : "bg-surface-container-low text-on-surface-variant border border-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default PersonalIdentity;
