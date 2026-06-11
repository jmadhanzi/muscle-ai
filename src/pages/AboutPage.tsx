import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Brain, Stethoscope, Lock, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import ClinicalReferenceSheet, { CitationMark } from "@/components/ClinicalReferenceSheet";
import { CLINICAL_REFERENCES } from "@/data/clinicalReferences";
import type { ClinicalReference } from "@/data/clinicalReferences";

const ease = [0.16, 1, 0.3, 1] as const;

const AboutPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedRef, setSelectedRef] = useState<ClinicalReference | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openRef = (id: string) => {
    const ref = CLINICAL_REFERENCES.find((r) => r.id === id);
    if (ref) { setSelectedRef(ref); setSheetOpen(true); }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      // Delete user data from all tables
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

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="px-5 pt-14 pb-4 flex items-center gap-3"
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
        </button>
        <h1 className="font-headline font-bold text-xl text-on-surface">About & Trust</h1>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Expert Advisory */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Expert Advisory</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            Our science is reviewed by our clinical advisory board — registered dietitians and certified exercise physiologists specializing in GLP-1 therapy and body composition.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All protocols, scoring algorithms, and nutritional recommendations are evidence-based and regularly updated with the latest research.
          </p>
        </motion.section>

        {/* Transparency — Muscle Score */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">How Your Muscle Score Works</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            Your Muscle Score (20–85) estimates your muscle preservation potential based on:
          </p>
          <ul className="space-y-1.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Fitness level & training frequency
                <CitationMark onClick={() => openRef("resistance-training-glp1")} />
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Daily protein intake relative to bodyweight
                <CitationMark onClick={() => openRef("protein-muscle-preservation")} />
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Duration on GLP-1 medication
                <CitationMark onClick={() => openRef("glp1-muscle-loss")} />
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Weight loss targets & body composition goals
                <CitationMark onClick={() => openRef("body-composition-monitoring")} />
              </span>
            </li>
          </ul>
          <p className="text-[11px] text-on-surface-variant/70 mt-2">
            This score is an estimate based on population-level research. Individual results may vary significantly.
          </p>
        </motion.section>

        {/* AI Coach Limitations */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">psychology</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">What the AI Coach Can & Cannot Do</span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-primary mb-1.5">✓ The coach CAN</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Provide general fitness and nutrition guidance</li>
                <li>• Suggest protein-rich meals based on your preferences</li>
                <li>• Explain exercise modifications for nausea days</li>
                <li>• Answer questions about GLP-1 and muscle preservation</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-accent-danger mb-1.5">✗ The coach CANNOT</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Diagnose medical conditions or replace your doctor</li>
                <li>• Adjust your GLP-1 dosage or medication schedule</li>
                <li>• Provide emergency medical advice</li>
                <li>• Access your medical records or lab results</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* When to Consult Your Doctor */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-accent-danger/5 rounded-lg border border-accent-danger/15 p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-danger text-base">warning</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger">When to Consult Your Doctor</span>
          </div>
          <ul className="space-y-1.5 text-xs text-on-surface leading-relaxed">
            <li>• Severe or persistent nausea, vomiting, or abdominal pain</li>
            <li>• Unexplained muscle weakness or significant strength loss</li>
            <li>• Rapid weight loss exceeding 1% body weight per week</li>
            <li>• Any new or worsening symptoms after dose changes</li>
            <li>• Before starting or modifying any exercise program</li>
          </ul>
        </motion.section>

        {/* Data Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Data Privacy</span>
          </div>
          <ul className="space-y-2 text-xs text-on-surface leading-relaxed">
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>Your health data is encrypted in transit and at rest. We never sell your data to third parties.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>We follow HIPAA-compliant practices for handling health-related information.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>AI coach conversations are not stored permanently and are never used to train AI models.</span>
            </li>
          </ul>
        </motion.section>

        {/* Delete Account */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease }}
          className="bg-surface-container-lowest rounded-lg border border-accent-danger/15 p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-accent-danger" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Delete Account & Data</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This will permanently delete all your data including onboarding, tracking history, milestones, and sign you out.
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
            {deleting ? "Deleting..." : confirmDelete ? "Tap again to confirm deletion" : "Delete my account and all data"}
          </button>
        </motion.section>
      </div>

      <ClinicalReferenceSheet reference={selectedRef} open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <BottomNav />
    </div>
  );
};

export default AboutPage;
