import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const PersonalIdentity = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState(48);
  const [selectedSex, setSelectedSex] = useState<string>("Female");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Ambient glow */}
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <Navbar showBack showSteps activeStep={1} />

      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-12">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface leading-tight tracking-tight mb-4">
            Let's build your MuscleLock profile.
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md">
            Precise biometric calibration is required to prevent medication-induced muscle atrophy.
          </p>
        </section>

        <div className="space-y-16">
          {/* Name */}
          <div className="space-y-6">
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
              />
            </div>
          </div>

          {/* Age */}
          <div className="space-y-6">
            <span className="font-mono text-primary text-sm tracking-widest uppercase">02 / Biometrics</span>
            <div className="bg-surface-container-low rounded-lg p-8">
              <label className="block text-sm font-medium text-on-surface-variant mb-6 text-center">Your age?</label>
              <div className="flex items-center justify-center gap-12">
                <button
                  onClick={() => setAge(Math.max(18, age - 1))}
                  className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-3xl">remove</span>
                </button>
                <div className="text-center">
                  <span className="font-mono text-6xl font-bold text-on-surface">{age}</span>
                  <span className="block text-xs font-mono text-primary mt-2 tracking-widest">YEARS</span>
                </div>
                <button
                  onClick={() => setAge(Math.min(100, age + 1))}
                  className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              </div>
              <div className="mt-10 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-secondary shadow-sm">
                <span className="material-symbols-outlined material-filled text-secondary">info</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  This is the most critical decade for muscle preservation.{" "}
                  <span className="text-secondary font-medium">MuscleLock AI</span> will prioritize Type II fiber retention protocols for your age group.
                </p>
              </div>
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-6">
            <span className="font-mono text-primary text-sm tracking-widest uppercase">03 / Metabolism</span>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-on-surface-variant px-1">Biological sex?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((sex) => (
                  <button
                    key={sex}
                    onClick={() => setSelectedSex(sex)}
                    className={`py-4 px-2 rounded-full font-medium transition-all ${
                      selectedSex === sex
                        ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_hsla(155,100%,71%,0.3)]"
                        : "bg-surface-container-highest text-on-surface border border-transparent hover:border-primary/20"
                    }`}
                  >
                    {sex}
                  </button>
                ))}
              </div>
              {selectedSex === "Female" && (
                <div className="mt-6 flex items-start gap-4 p-5 rounded-xl bg-surface-container-high border-l-4 border-primary shadow-sm">
                  <span className="material-symbols-outlined material-filled text-primary">analytics</span>
                  <p className="text-sm leading-relaxed text-on-surface">
                    Women on GLP-1s lose proportionally more muscle — we'll customize for this by adjusting protein-to-weight ratios in your daily telemetry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-24" />
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/medication-profile")}
            className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(155,100%,71%,0.25)] active:scale-95 transition-transform duration-200"
          >
            Next step
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalIdentity;
