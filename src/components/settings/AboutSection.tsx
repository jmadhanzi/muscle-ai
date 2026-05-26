import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Shield, FileText, Scale, Trash2, Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ClinicalReferenceSheet, { CitationMark } from "@/components/ClinicalReferenceSheet";
import { CLINICAL_REFERENCES } from "@/data/clinicalReferences";
import type { ClinicalReference } from "@/data/clinicalReferences";

const ease = [0.16, 1, 0.3, 1] as const;

const AboutSection = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedRef, setSelectedRef] = useState<ClinicalReference | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openRef = (id: string) => {
    const ref = CLINICAL_REFERENCES.find((r) => r.id === id);
    if (ref) { setSelectedRef(ref); setSheetOpen(true); }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      if (user) {
        await Promise.all([
          supabase.from("daily_logs").delete().eq("user_id", user.id),
          supabase.from("milestones").delete().eq("user_id", user.id),
          supabase.from("push_subscriptions").delete().eq("user_id", user.id),
          supabase.from("referrals").delete().eq("referrer_id", user.id),
          supabase.from("profiles").delete().eq("user_id", user.id),
        ]);
      }
      await signOut();
      toast.success("Account data deleted. You've been signed out.");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const linkRows = [
    { icon: <Brain className="w-4 h-4 text-primary" />, label: "How Muscle Score Works", action: () => navigate("/about") },
    { icon: <Stethoscope className="w-4 h-4 text-primary" />, label: "Clinical References", action: () => navigate("/about") },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: "Privacy Policy", action: () => navigate("/privacy") },
    { icon: <FileText className="w-4 h-4 text-primary" />, label: "Terms of Service", action: () => navigate("/terms") },
  ];

  return (
    <>
      {/* About links */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34, ease }}
        className="bg-surface-container-lowest rounded-lg border border-border divide-y divide-border/50"
      >
        <div className="px-5 py-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">About</span>
        </div>
        {linkRows.map((row) => (
          <button
            key={row.label}
            onClick={row.action}
            className="w-full px-5 py-3.5 flex items-center gap-3 text-sm text-on-surface hover:bg-surface-container-low active:scale-[0.99] transition-all"
          >
            {row.icon}
            <span className="flex-1 text-left">{row.label}</span>
            <span className="material-symbols-outlined text-on-surface-variant text-base">chevron_right</span>
          </button>
        ))}
      </motion.div>

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease }}
        className="bg-accent-danger/5 rounded-lg border border-accent-danger/15 p-5 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-accent-danger" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger">Medical Disclaimer</span>
        </div>
        <p className="text-xs text-on-surface leading-relaxed">
          MuscleLock AI is an educational and motivational tool. It is <span className="font-medium">not medical advice</span>.
        </p>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Always consult your prescribing physician before changing your GLP-1 protocol, exercise program, or nutrition plan.
        </p>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.46, ease }}
        className="bg-surface-container-lowest rounded-lg border border-accent-danger/15 p-5 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-accent-danger" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Delete Account & Data</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Permanently delete all your data including profile, tracking, milestones, and sign you out.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-all ${
            confirmDelete
              ? "bg-accent-danger text-white"
              : "border border-accent-danger/20 text-accent-danger hover:bg-accent-danger/5"
          } disabled:opacity-50`}
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? "Deleting…" : confirmDelete ? "Tap again to confirm deletion" : "Delete my account and all data"}
        </button>
      </motion.div>

      <ClinicalReferenceSheet reference={selectedRef} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
};

export default AboutSection;
