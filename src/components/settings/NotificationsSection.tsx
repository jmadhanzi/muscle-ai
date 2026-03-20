import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Syringe, Dumbbell, Flame, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const ease = [0.16, 1, 0.3, 1] as const;

const NOTIF_KEY = "musclelock_notif_prefs";

interface NotifPrefs {
  injectionReminder: boolean;
  injectionTime: string;
  proteinReminder: boolean;
  proteinFrequency: string;
  workoutReminder: boolean;
  workoutTime: string;
  streakAlerts: boolean;
  weeklyBriefing: boolean;
}

const defaultPrefs: NotifPrefs = {
  injectionReminder: true,
  injectionTime: "09:00",
  proteinReminder: true,
  proteinFrequency: "twice",
  workoutReminder: true,
  workoutTime: "07:00",
  streakAlerts: true,
  weeklyBriefing: true,
};

interface NotificationsSectionProps {
  userId: string | undefined;
}

const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const push = usePushNotifications(userId);
  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    try {
      const stored = localStorage.getItem(NOTIF_KEY);
      return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    } catch { return defaultPrefs; }
  });

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const update = (key: keyof NotifPrefs, value: any) => {
    setPrefs(p => ({ ...p, [key]: value }));
  };

  const rows: { key: keyof NotifPrefs; icon: React.ReactNode; label: string; desc: string; timeKey?: keyof NotifPrefs; freqKey?: keyof NotifPrefs }[] = [
    { key: "injectionReminder", icon: <Syringe className="w-4 h-4" />, label: "Injection Reminders", desc: "Get reminded on your injection day", timeKey: "injectionTime" },
    { key: "proteinReminder", icon: <span className="text-base">🥩</span>, label: "Protein Reminders", desc: "Stay on top of your protein goals", freqKey: "proteinFrequency" },
    { key: "workoutReminder", icon: <Dumbbell className="w-4 h-4" />, label: "Workout Reminders", desc: "Never miss a training session", timeKey: "workoutTime" },
    { key: "streakAlerts", icon: <Flame className="w-4 h-4" />, label: "Streak Alerts", desc: "Protect your daily streak" },
    { key: "weeklyBriefing", icon: <BarChart3 className="w-4 h-4" />, label: "Weekly Briefing", desc: "Sunday summary of your progress" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18, ease }}
      className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Notifications</span>

      {/* Master push toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${push.isSubscribed ? "gradient-hero" : "bg-surface-container-high"}`}>
            {push.isSubscribed ? <Bell className="w-4 h-4 text-on-primary" /> : <BellOff className="w-4 h-4 text-on-surface-variant" />}
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Push Notifications</p>
            <p className="text-[10px] text-on-surface-variant">
              {push.isSupported ? (push.isSubscribed ? "Enabled" : "Disabled") : "Not supported"}
            </p>
          </div>
        </div>
        {push.isSupported && (
          <Switch
            checked={push.isSubscribed}
            onCheckedChange={() => push.isSubscribed ? push.unsubscribe() : push.subscribe()}
          />
        )}
      </div>

      {/* Individual toggles */}
      <div className="space-y-3">
        {rows.map(({ key, icon, label, desc, timeKey, freqKey }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-on-surface-variant">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-on-surface">{label}</p>
                  <p className="text-[10px] text-on-surface-variant">{desc}</p>
                </div>
              </div>
              <Switch
                checked={prefs[key] as boolean}
                onCheckedChange={(v) => update(key, v)}
              />
            </div>

            {/* Time selector */}
            {timeKey && prefs[key] && (
              <div className="ml-11">
                <input
                  type="time"
                  value={prefs[timeKey] as string}
                  onChange={(e) => update(timeKey, e.target.value)}
                  className="bg-surface-container-low border border-border rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            )}

            {/* Frequency selector */}
            {freqKey && prefs[key] && (
              <div className="ml-11 flex gap-2">
                {[
                  { value: "once", label: "Once/day" },
                  { value: "twice", label: "Twice/day" },
                  { value: "thrice", label: "3×/day" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update(freqKey, opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
                      prefs[freqKey] === opt.value
                        ? "gradient-hero text-on-primary"
                        : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsSection;
