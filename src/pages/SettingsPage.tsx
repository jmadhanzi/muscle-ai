import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import ProfileSection from "@/components/settings/ProfileSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import AboutSection from "@/components/settings/AboutSection";

const ease = [0.16, 1, 0.3, 1] as const;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [injectionDay, setInjectionDay] = useState("");
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [proteinTarget, setProteinTarget] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("first_name, injection_day, current_weight, weight_unit, protein_target, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (prof) {
        if (prof.first_name) setFirstName(prof.first_name);
        if (prof.injection_day) setInjectionDay(prof.injection_day);
        if (prof.current_weight) setCurrentWeight(Number(prof.current_weight));
        if (prof.weight_unit) setWeightUnit(prof.weight_unit);
        if (prof.protein_target) setProteinTarget(prof.protein_target);
        if (prof.avatar_url) setAvatarUrl(prof.avatar_url);
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          injection_day: injectionDay,
          current_weight: currentWeight,
          protein_target: proteinTarget,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
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
        {/* Profile */}
        {user && (
          <ProfileSection
            userId={user.id}
            firstName={firstName}
            setFirstName={setFirstName}
            email={user.email || ""}
            currentWeight={currentWeight}
            setCurrentWeight={setCurrentWeight}
            weightUnit={weightUnit}
            proteinTarget={proteinTarget}
            setProteinTarget={setProteinTarget}
            injectionDay={injectionDay}
            setInjectionDay={setInjectionDay}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />
        )}

        {/* Save */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease }}
        >
          <button
            onClick={handleSave}
            disabled={saving || !loaded}
            className="w-full py-3.5 rounded-full gradient-hero text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-200 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </motion.div>

        {/* Notifications */}
        <NotificationsSection userId={user?.id} />

        {/* Subscription */}
        <SubscriptionSection userId={user?.id} firstName={firstName} />

        {/* About, Disclaimer, Delete */}
        <AboutSection />

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52, ease }}
          className="pb-4"
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
