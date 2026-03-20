import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InjectionCountdownProps {
  injectionDay: string | null | undefined;
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const InjectionCountdown = ({ injectionDay }: InjectionCountdownProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const { days, hours, isToday, isUrgent } = useMemo(() => {
    if (!injectionDay) return { days: 0, hours: 0, isToday: false, isUrgent: false };
    const injIdx = DAYS.indexOf(injectionDay.toLowerCase());
    if (injIdx === -1) return { days: 0, hours: 0, isToday: false, isUrgent: false };

    const nowDate = new Date(now);
    const todayIdx = nowDate.getDay();
    let diff = (injIdx - todayIdx + 7) % 7;
    const isToday = diff === 0;

    // Calculate hours remaining in the day
    const hoursLeft = 23 - nowDate.getHours();
    const totalHours = diff * 24 + hoursLeft;
    const isUrgent = totalHours <= 24 && !isToday;

    return { days: diff, hours: hoursLeft, isToday, isUrgent };
  }, [injectionDay, now]);

  if (!injectionDay) return null;

  const borderColor = isToday
    ? "border-accent-danger/40 shadow-[0_0_20px_hsla(0,100%,63%,0.1)]"
    : isUrgent
    ? "border-accent-gold/40 shadow-[0_0_20px_hsla(38,92%,50%,0.08)]"
    : "border-border";

  const accentColor = isToday ? "text-accent-danger" : isUrgent ? "text-accent-gold" : "text-secondary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-surface-container-lowest rounded-lg border-2 p-5 transition-colors duration-500 ${borderColor}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`material-symbols-outlined ${accentColor} text-xl`}>
          {isToday ? "warning" : "vaccines"}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">
          {isToday ? "Injection Day — Protocol Active" : isUrgent ? "Injection Day Tomorrow" : "Next Injection"}
        </span>
      </div>

      {isToday ? (
        <div>
          <p className="font-headline font-bold text-2xl text-accent-danger mb-3">Injection Day Protocol</p>
          <div className="space-y-2">
            {[
              { icon: "restaurant", label: "Pre-injection meal 2hrs before", done: false },
              { icon: "vaccines", label: "Administer injection", done: false },
              { icon: "egg_alt", label: "High-protein post-injection meal", done: false },
              { icon: "fitness_center", label: "Light resistance training only", done: false },
              { icon: "water_drop", label: "Extra hydration — 10+ cups", done: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="material-symbols-outlined text-accent-danger/70 text-base">{item.icon}</span>
                <span className="text-on-surface">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className={`font-mono font-bold text-4xl ${accentColor}`}>{days}</span>
          <span className="text-on-surface-variant text-sm font-mono mr-2">d</span>
          <span className={`font-mono font-bold text-4xl ${accentColor}`}>{hours}</span>
          <span className="text-on-surface-variant text-sm font-mono">h</span>
          {isUrgent && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-3 text-xs font-medium text-accent-gold"
            >
              Prepare your protocol
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default InjectionCountdown;
