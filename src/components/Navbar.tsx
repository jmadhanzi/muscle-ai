import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  showBack?: boolean;
  showSteps?: boolean;
  activeStep?: number;
  totalSteps?: number;
  showNotification?: boolean;
  showProfile?: boolean;
}

const dotVariants = {
  inactive: { scale: 1, backgroundColor: "hsl(var(--surface-variant))" },
  active: {
    scale: 1.4,
    backgroundColor: "hsl(var(--primary))",
    boxShadow: "0 0 8px hsla(155,100%,71%,0.6)",
    transition: { type: "spring" as const, stiffness: 400, damping: 15 },
  },
  completed: {
    scale: 1,
    backgroundColor: "hsl(var(--primary))",
    boxShadow: "0 0 8px hsla(155,100%,71%,0.6)",
  },
};

const Navbar = ({
  showBack,
  showSteps,
  activeStep = 1,
  totalSteps = 7,
  showNotification,
  showProfile,
}: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-4">
        {/* FIX: back button now actually navigates */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          {!showBack && (
            <span className="material-symbols-outlined material-filled text-primary text-3xl">lock</span>
          )}
          <span className="text-primary font-black italic tracking-tighter font-headline text-2xl uppercase">
            MuscleLock AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSteps && (
          <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={activeStep} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNum = i + 1;
              const variant =
                stepNum === activeStep ? "active" : stepNum < activeStep ? "completed" : "inactive";
              return (
                <motion.div
                  key={i}
                  variants={dotVariants}
                  initial="inactive"
                  animate={variant}
                  className="w-2 h-2 rounded-full"
                  aria-hidden="true"
                />
              );
            })}
          </div>
        )}
        {showProfile && (
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
          </div>
        )}
        {showNotification && (
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
