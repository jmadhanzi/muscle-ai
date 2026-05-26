import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Shield, Eye, Database, UserX, Mail } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ease = [0.16, 1, 0.3, 1] as const;

const PrivacyPage = () => {
  const navigate = useNavigate();

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
        <h1 className="font-headline font-bold text-xl text-on-surface">Privacy Policy</h1>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Effective date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
          className="text-[11px] text-on-surface-variant font-mono"
        >
          Effective date: June 1, 2025 · Last updated: June 1, 2025
        </motion.p>

        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Our Commitment</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            Muscle AI is built on a foundation of trust. We handle your health data with the same care you'd expect from a medical provider — because that's the standard you deserve.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This policy explains what we collect, why we collect it, and the choices you have over your information. If you have questions, reach us at <span className="text-primary">privacy@muscleai.app</span>.
          </p>
        </motion.section>

        {/* Data We Collect */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Information We Collect</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-on-surface mb-1.5">Account & Identity</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Email address and authentication credentials</li>
                <li>• Name and basic profile details you provide</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface mb-1.5">Health & Fitness Data</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• GLP-1 medication type and usage duration</li>
                <li>• Weight goals, fitness level, and protein intake</li>
                <li>• Daily workout and nutrition logs you enter</li>
                <li>• Progress milestones and body composition goals</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface mb-1.5">Usage Data</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• App interactions and feature usage (anonymised)</li>
                <li>• Device type and operating system version</li>
                <li>• Crash reports and performance diagnostics</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* How We Use Data */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">How We Use Your Data</span>
          </div>
          <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>Personalise workout plans, nutrition recommendations, and your Muscle Score</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>Power the AI Coach to answer your questions contextually and safely</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>Track your progress over time and surface meaningful milestones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>Send optional push notifications for reminders you configure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>Improve reliability and fix bugs using aggregated, anonymised diagnostics</span>
            </li>
          </ul>
          <p className="text-[11px] text-on-surface-variant/70 pt-1">
            We do <strong>not</strong> use your health data for advertising, sell it to third parties, or share it with insurers.
          </p>
        </motion.section>

        {/* Security */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Security & Storage</span>
          </div>
          <ul className="space-y-2 text-xs text-on-surface leading-relaxed">
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>We follow HIPAA-aligned practices for storing health-related information.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>AI coach conversations are not stored permanently and are never used to train AI models.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>Access to your data within our team is role-restricted and logged.</span>
            </li>
          </ul>
        </motion.section>

        {/* Your Rights */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Your Rights & Choices</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Depending on your location you may have the following rights regarding your personal data:
          </p>
          <ul className="space-y-1.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span><strong className="text-on-surface">Access</strong> — request a copy of the data we hold about you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span><strong className="text-on-surface">Correction</strong> — update inaccurate or incomplete information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span><strong className="text-on-surface">Deletion</strong> — erase your account and all associated data via the About page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span><strong className="text-on-surface">Portability</strong> — export your data in a machine-readable format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span><strong className="text-on-surface">Opt-out</strong> — disable push notifications any time in Settings</span>
            </li>
          </ul>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Contact</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            For privacy-related questions or to exercise any of your rights, email us at{" "}
            <span className="text-primary">privacy@muscleai.app</span>. We aim to respond within 5 business days.
          </p>
        </motion.section>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrivacyPage;
