import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { motion } from "framer-motion";
import { staggerItem } from "@/components/motion/PageTransition";

const heights = Array.from({ length: 81 }, (_, i) => 120 + i); // 120-200cm

const BodyMetrics = () => {
  const navigate = useNavigate();
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(75);

  return (
    <OnboardingLayout
      step={3}
      footer={
        <button
          onClick={() => navigate("/onboarding/activity", { state: { heightCm, weightKg } })}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(160,100%,45%,0.25)] active:scale-95 transition-transform duration-200"
        >
          Next step
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      }
    >
      <section className="mb-10">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
          Your body metrics.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md">
          We need precise measurements to calculate your lean mass and muscle loss risk.
        </p>
      </section>

      <div className="space-y-14">
        {/* Height */}
        <motion.div {...staggerItem} className="space-y-6">
          <span className="font-mono text-primary text-sm tracking-widest uppercase">04 / Height</span>
          <div className="bg-surface-container-low rounded-lg p-8">
            <label className="block text-sm font-medium text-on-surface-variant mb-6 text-center">Your height?</label>
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={() => setHeightCm(Math.max(120, heightCm - 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center">
                <span className="font-mono text-6xl font-bold text-on-surface">{heightCm}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest">CM</span>
              </div>
              <button
                onClick={() => setHeightCm(Math.min(220, heightCm + 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Weight */}
        <motion.div {...staggerItem} className="space-y-6">
          <span className="font-mono text-primary text-sm tracking-widest uppercase">05 / Weight</span>
          <div className="bg-surface-container-low rounded-lg p-8">
            <label className="block text-sm font-medium text-on-surface-variant mb-6 text-center">Current weight?</label>
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={() => setWeightKg(Math.max(30, weightKg - 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">remove</span>
              </button>
              <div className="text-center">
                <span className="font-mono text-6xl font-bold text-on-surface">{weightKg}</span>
                <span className="block text-xs font-mono text-primary mt-2 tracking-widest">KG</span>
              </div>
              <button
                onClick={() => setWeightKg(Math.min(250, weightKg + 1))}
                className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>

            {/* BMI preview */}
            <div className="mt-8 text-center">
              <span className="text-xs font-mono text-on-surface-variant tracking-widest uppercase">Estimated BMI</span>
              <div className="font-mono text-2xl font-bold text-secondary mt-1">
                {(weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default BodyMetrics;
