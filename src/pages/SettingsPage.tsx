import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Crown, Bell, BellOff, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, isPro, subscriptionEnd, signOut, checkSubscription } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [injectionDay, setInjectionDay] = useState("");
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const push = usePushNotifications(user?.id);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: prof }, { data: onb }] = await Promise.all([
        supabase.from("profiles").select("first_name").eq("user_id", user.id).single(),
        supabase.from("onboarding_data").select("injection_day").eq("user_id", user.id).single(),
      ]);
      if (prof?.first_name) setFirstName(prof.first_name);
      if (onb?.injection_day) setInjectionDay(onb.injection_day);
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const [{ error: profErr }, { error: onbErr }] = await Promise.all([
        supabase.from("profiles").update({ first_name: firstName }).eq("user_id", user.id),
        supabase.from("onboarding_data").update({ injection_day: injectionDay }).eq("user_id", user.id),
      ]);
      if (profErr || onbErr) throw profErr || onbErr;
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4 flex items-center gap-3"
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
        </button>
        <h1 className="font-headline font-bold text-xl text-on-surface">Settings</h1>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Profile</span>

          <div>
            <label className="text-xs text-on-surface-variant mb-1.5 block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-on-surface-variant mb-1.5 block">Email</label>
            <div className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface-variant">
              {user?.email || "—"}
            </div>
          </div>
        </motion.div>

        {/* Injection Day */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Injection Schedule</span>

          <div>
            <label className="text-xs text-on-surface-variant mb-2 block">Injection Day</label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setInjectionDay(day.value)}
                  className={`py-2.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.95] ${
                    injectionDay === day.value
                      ? "gradient-hero text-on-primary shadow-md"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {day.label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Notifications</span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${push.isSubscribed ? "gradient-hero" : "bg-surface-container-high"}`}>
                {push.isSubscribed ? (
                  <Bell className="w-4 h-4 text-on-primary" />
                ) : (
                  <BellOff className="w-4 h-4 text-on-surface-variant" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  {push.isSubscribed ? "Push notifications on" : "Push notifications off"}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {push.isSupported
                    ? "Injection day & streak reminders"
                    : "Not supported in this browser"}
                </p>
              </div>
            </div>
            {push.isSupported && (
              <button
                onClick={() => push.isSubscribed ? push.unsubscribe() : push.subscribe()}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  push.isSubscribed
                    ? "bg-surface-container-high text-on-surface-variant"
                    : "gradient-hero text-on-primary"
                }`}
              >
                {push.isSubscribed ? "Disable" : "Enable"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          <button
            onClick={handleSave}
            disabled={saving || !loaded}
            className="w-full py-3.5 rounded-full gradient-hero text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Subscription</span>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPro ? "gradient-hero" : "bg-surface-container-high"}`}>
              <Crown className={`w-4 h-4 ${isPro ? "text-on-primary" : "text-on-surface-variant"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {isPro ? "MuscleLock Pro" : "Free Plan"}
              </p>
              {isPro && subscriptionEnd && (
                <p className="text-xs text-on-surface-variant">
                  Renews {new Date(subscriptionEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
              {!isPro && (
                <p className="text-xs text-on-surface-variant">Upgrade to unlock all features</p>
              )}
            </div>
          </div>

          {isPro ? (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="w-full py-3 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium active:scale-[0.97] transition-transform disabled:opacity-50"
            >
              {portalLoading ? "Opening..." : "Manage Subscription"}
            </button>
          ) : (
            <button
              onClick={() => navigate("/subscribe")}
              className="w-full py-3 rounded-full gradient-hero text-on-primary text-sm font-headline font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </button>
          )}
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease }}
        >
          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-lg border border-accent-danger/20 text-accent-danger text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform hover:bg-accent-danger/5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
