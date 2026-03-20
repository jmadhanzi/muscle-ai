import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingLayout from "@/components/OnboardingLayout";

const levels = [
  {
    value: "never_exercised",
    emoji: "🛋️",
    label: "Just Starting",
    desc: "I rarely exercise currently",
    protocol: "2-day",
    preservation: "60%",
  },
  {
    value: "beginner",
    emoji: "🚶",
    label: "Light Mover",
    desc: "Walks, light activity 1–2x/week",
    protocol: "3-day",
    preservation: "75%",
  },
  {
    value: "intermediate",
    emoji: "🏃",
    label: "Active",
    desc: "Gym or sports 3–4x/week",
    protocol: "4-day",
    preservation: "88%",
  },
  {
    value: "advanced",
    emoji: "💪",
    label: "Athlete",
    desc: "Training 5+ days/week",
    protocol: "5-day",
    preservation: "95%",
  },
];

const nauseaOptions = [
  { value: "never", label: "Never" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
  { value: "always", label: "Almost always" },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const FitnessLevel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [level, setLevel] = useState<string | null>(null);
  const [nausea, setNausea] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("fitness_level, nausea_level, first_name")
        .eq("user_id", user.id)
        .single();
      if (data?.fitness_level) setLevel(data.fitness_level);
      if (data?.nausea_level) setNausea(data.nausea_level);
      if (data?.first_name) setFirstName(data.first_name);
    };
    load();
  }, [user]);

  const handleNext = async () => {
    if (!user || !level || !nausea) return;
    setSaving(true);
    try {
      await supabase.from("onboarding_data").update({
        fitness_level: level,
        nausea_level: nausea,
      } as Record<string, unknown>).eq("user_id", user.id);
      navigate("/onboarding/protein");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const selected = levels.find((l) => l.value === level);
  const name = firstName.trim();
  const isHighNausea = nausea === "often" || nausea === "always";

  return (
    <OnboardingLayout
      step={5}
      footer={
        <button
          onClick={handleNext}
          disabled={!level || !nausea || saving}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-[0.97] transition-transform duration-200 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Next step"}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <motion.header className="mb-10" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-[1.1] tracking-tight mb-3">
          How active are you right now{name ? `, ${name}` : ""}?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          We'll match your resistance protocol to where you are today.
        </p>
      </motion.header>

      <motion.div className="space-y-14" variants={stagger} initial="hidden" animate="show">
        {/* ── Activity Level Cards ── */}
        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-5 block">01 / Activity Level</span>
          <div className="space-y-3">
            {levels.map((fl, i) => (
              <motion.button
                key={fl.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLevel(fl.value)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                  level === fl.value
                    ? "bg-surface-container-high border-2 border-primary shadow-[0_0_24px_hsla(160,100%,45%,0.12)]"
                    : "bg-surface-container-low border-2 border-transparent hover:border-outline-variant/20"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl ${
                  level === fl.value ? "bg-primary/15" : "bg-surface-container-highest"
                }`}>
                  {fl.emoji}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-headline font-bold text-lg leading-tight ${
                    level === fl.value ? "text-on-surface" : "text-on-surface-variant"
                  }`}>{fl.label}</div>
                  <div className="text-sm text-on-surface-variant mt-0.5">{fl.desc}</div>
                </div>
                {level === fl.value && (
                  <span className="material-symbols-outlined material-filled text-primary text-xl shrink-0">check_circle</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Protocol result */}
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.value}
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="overflow-hidden"
              >
                <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-[0_0_24px_hsla(160,100%,45%,0.06)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined material-filled text-primary">fitness_center</span>
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">Your Program</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-on-surface-variant text-xs mb-1">Resistance Protocol</p>
                      <p className="font-mono text-2xl font-bold text-on-surface">{selected.protocol}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs mb-1">Est. Muscle Preservation</p>
                      <p className="font-mono text-2xl font-bold text-primary">{selected.preservation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Nausea / Side Effects ── */}
        <motion.div variants={fadeUp}>
          <span className="font-mono text-primary text-sm tracking-widest uppercase mb-4 block">02 / Side Effects</span>
          <label className="text-sm font-medium text-on-surface-variant block mb-4 px-1">
            How often do you experience GLP-1 side effects (nausea, fatigue)?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {nauseaOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setNausea(opt.value)}
                className={`py-4 px-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.97] ${
                  nausea === opt.value
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_hsla(160,100%,45%,0.25)]"
                    : "bg-surface-container-low border-2 border-transparent text-on-surface-variant hover:border-outline-variant/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {isHighNausea && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-secondary">
                  <span className="material-symbols-outlined material-filled text-secondary shrink-0">self_improvement</span>
                  <p className="text-sm leading-relaxed text-on-surface">
                    {name ? `${name}, w` : "W"}e'll build a <span className="text-secondary font-medium">low-intensity protocol</span> for bad days.
                    Modified exercises, shorter sessions, zero skipped days.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default FitnessLevel;
