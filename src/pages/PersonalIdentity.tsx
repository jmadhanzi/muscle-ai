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
        .single();
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
      await supabase.from("profiles").update({
        first_name: firstName.trim(),
        age,
        biological_sex: selectedSex,
      }).eq("user_id", user.id);

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
            <label className="block text-sm font-medium text-on-surface-variant mb-3 px-1" htmlFor="first_name">
              What's your first name?
            </label>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-5 text-xl font-headline text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-surface-variant transition-all outline-none"
              id="first_name"
              placeholder="Enter name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <AnimatePresence>
              {nameVal && (
                <motion.p
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-primary text-sm mt-3 px-1 overflow-hidden"
                >
                  Nice to meet you, {nameVal}! 👋
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── 02 Age ── */}
        <motion.div className="space-y-5" variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase">02 / Biometrics</span>
          <div className="bg-surface-container-low rounded-2xl p-8">
            <label className="block text-sm font-medium text-on-surface-variant mb-6 text-center">Your age?</label>
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={() => setAge(Math.max(18, age - 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center select-none">
                <span className="font-mono text-6xl font-bold text-on-surface leading-none">{age}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest">YEARS</span>
              </div>
              <button
                onClick={() => setAge(Math.min(100, age + 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>

            <motion.div
              key={age < 40 ? "young" : age <= 55 ? "mid" : "senior"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-secondary"
            >
              <span className="material-symbols-outlined material-filled text-secondary shrink-0">info</span>
              <p className="text-sm leading-relaxed text-on-surface">
                {nameVal ? `${nameVal}, ` : ""}
                {ageMessage(age)}{" "}
                <span className="text-secondary font-medium">MuscleLock AI</span> will tailor Type II fiber protocols for your age group.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── 03 Sex ── */}
        <motion.div className="space-y-5" variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase">03 / Metabolism</span>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-on-surface-variant px-1">Biological sex?</label>
            <div className="grid grid-cols-3 gap-3">
              {sexOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedSex(opt.value)}
                  className={`py-4 px-2 rounded-full font-medium transition-all duration-200 ${
                    selectedSex === opt.value
                      ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_hsla(160,100%,45%,0.3)]"
                      : "bg-surface-container-highest text-on-surface hover:border-primary/20 border border-transparent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {selectedSex === "female" && (
                <motion.div
                  key="female-msg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-primary">
                    <span className="material-symbols-outlined material-filled text-primary shrink-0">analytics</span>
                    <p className="text-sm leading-relaxed text-on-surface">
                      {nameVal ? `${nameVal}, w` : "W"}omen on GLP-1s lose proportionally more muscle — we'll customize your plan for this.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default PersonalIdentity;
