import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface HeaderProps {
  firstName?: string;
  dayNumber: number;
}

const DashboardHeader = ({ firstName, dayNumber }: HeaderProps) => {
  const navigate = useNavigate();
  const greeting = firstName ? `Hi, ${firstName} 👋` : "Welcome back 👋";
  const initials = firstName ? firstName.charAt(0).toUpperCase() : "M";

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="px-5 pt-14 pb-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shrink-0 shadow-[0_0_16px_hsla(160,100%,45%,0.15)]">
            <span className="text-on-primary font-headline font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-on-surface font-medium text-sm">{greeting}</p>
            <p className="text-on-surface-variant text-[11px] font-mono tracking-wide">
              Day {dayNumber} of your MuscleLock journey
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">settings</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
