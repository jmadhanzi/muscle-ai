import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const HookScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden">
      <Navbar showNotification />

      <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[795px]">
        {/* Hero */}
        <section className="text-center space-y-4 mb-12">
          <h1 className="font-headline font-bold text-5xl md:text-6xl tracking-tight leading-[1.1] text-on-surface">
            Losing weight on <span className="text-primary italic">GLP-1?</span>
          </h1>
          <p className="text-on-surface-variant text-xl max-w-md mx-auto leading-relaxed">
            There's something your doctor probably didn't tell you.
          </p>
        </section>

        {/* Stat Card */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-on-tertiary-container/40 to-error-container/40 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative bg-surface-container-lowest border-2 border-on-tertiary-container/20 rounded-lg p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-on-tertiary-container/10 border border-on-tertiary-container/20">
                <span className="material-symbols-outlined material-filled text-on-tertiary-container text-sm">warning</span>
                <span className="text-on-tertiary-container font-label text-xs font-bold tracking-widest uppercase italic">Clinical Alert</span>
              </div>
              <div className="space-y-2">
                <div className="font-headline font-black text-8xl md:text-9xl text-on-tertiary-container tracking-tighter leading-none">
                  40%
                </div>
                <p className="font-headline text-2xl font-bold text-on-surface">
                  of weight lost on Ozempic/Wegovy is{" "}
                  <span className="text-on-tertiary-container uppercase underline decoration-4 underline-offset-4">MUSCLE</span>, not fat
                </p>
              </div>
              <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-on-tertiary-container to-error h-full w-[40%] rounded-full" />
              </div>
              <p className="font-label text-xs text-on-surface-variant opacity-60 tracking-tight">
                Source: New England Journal of Medicine, 2024
              </p>
            </div>
          </div>
        </div>

        {/* Explainer */}
        <section className="mt-12 w-full text-center space-y-10">
          <div className="space-y-6">
            <div className="relative py-8 px-6 bg-surface-container-low rounded-lg flex flex-col items-center justify-center overflow-hidden">
              <div className="flex gap-12 items-end justify-center mb-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-40 bg-surface-variant rounded-full relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[60%] bg-secondary opacity-40" />
                  </div>
                  <span className="text-[10px] font-label uppercase text-on-surface-variant">Target</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-40 bg-surface-variant rounded-full relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[30%] bg-on-tertiary-container" />
                    <div className="absolute bottom-[30%] w-full h-[15%] bg-on-tertiary-container opacity-40 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-label uppercase text-on-tertiary-container font-bold">Muscle Loss</span>
                </div>
              </div>
              <p className="text-on-surface text-lg leading-relaxed max-w-sm font-medium">
                That means for every 10 lbs you lose... <span className="text-on-tertiary-container font-bold">4 lbs</span> could be your muscle disappearing forever.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/personal-identity")}
              className="w-full py-6 px-8 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-xl flex items-center justify-center gap-3 active:scale-95 duration-200 shadow-[0_20px_40px_hsla(155,100%,71%,0.2)]"
            >
              Show me how to stop this
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="space-y-8 pt-8 border-t border-outline-variant/10">
            <div className="flex flex-col items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm">person</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm">person</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface">
                  47k+
                </div>
              </div>
              <p className="text-on-surface-variant font-label text-sm">
                Join <span className="text-on-surface font-bold">47,832 people</span> protecting their muscle
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-2 p-3 bg-surface-container-lowest rounded-xl">
                <span className="material-symbols-outlined text-secondary text-xl">science</span>
                <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant text-center leading-none font-bold">
                  Clinically<br />Referenced
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-surface-container-lowest rounded-xl">
                <span className="material-symbols-outlined text-secondary text-xl">verified_user</span>
                <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant text-center leading-none font-bold">
                  HIPAA<br />Compliant
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-surface-container-lowest rounded-xl">
                <span className="material-symbols-outlined material-filled text-primary text-xl">star</span>
                <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant text-center leading-none font-bold">
                  4.9 App Store<br />Rating
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Step indicator */}
      <div className="fixed bottom-12 w-full flex justify-center pointer-events-none opacity-20">
        <span className="text-[10px] uppercase font-label tracking-[0.4em] text-on-surface-variant">Step 1 of 4 • The Reveal</span>
      </div>
    </div>
  );
};

export default HookScreen;
