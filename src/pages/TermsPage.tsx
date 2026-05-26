import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, AlertTriangle, CreditCard, Ban, RefreshCw, Mail } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ease = [0.16, 1, 0.3, 1] as const;

const TermsPage = () => {
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
        <h1 className="font-headline font-bold text-xl text-on-surface">Terms of Service</h1>
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

        {/* Agreement */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Agreement to Terms</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            By creating an account or using Muscle AI, you agree to these Terms of Service. Please read them carefully — they govern your use of the app and our relationship with you.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            If you do not agree to these terms, please do not use Muscle AI. For questions, contact us at <span className="text-primary">legal@muscleai.app</span>.
          </p>
        </motion.section>

        {/* Medical Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="bg-accent-danger/5 rounded-lg border border-accent-danger/15 p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-danger" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger">Medical Disclaimer</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Muscle AI is a wellness and fitness application, <strong>not a medical service</strong>. Nothing in the app — including the AI Coach, Muscle Score, workout plans, or nutrition suggestions — constitutes medical advice, diagnosis, or treatment.
          </p>
          <ul className="space-y-1.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Always consult your prescribing physician before changing your GLP-1 dosage or exercise routine.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>In a medical emergency, call your local emergency services immediately.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Individual results vary. The app does not guarantee specific health or fitness outcomes.</span>
            </li>
          </ul>
        </motion.section>

        {/* Eligibility & Account */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">person_check</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Eligibility & Your Account</span>
          </div>
          <ul className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>You must be at least 18 years old to use Muscle AI.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>You are responsible for keeping your login credentials confidential.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>You agree to provide accurate information during onboarding and keep it up to date.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>You may not share your account with others or create multiple accounts.</span>
            </li>
          </ul>
        </motion.section>

        {/* Subscriptions & Billing */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Subscriptions & Billing</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-on-surface mb-1.5">Subscription Plans</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Muscle AI offers free and paid subscription tiers.</li>
                <li>• Paid plans are billed on a recurring basis (monthly or annual) as shown at checkout.</li>
                <li>• Prices may change with 30 days' notice to your registered email.</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface mb-1.5">Cancellation & Refunds</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• You may cancel your subscription at any time from Settings.</li>
                <li>• Cancellation takes effect at the end of the current billing period.</li>
                <li>• Refunds are not provided for partial billing periods, except where required by law.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Prohibited Use */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Prohibited Use</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">You agree not to:</p>
          <ul className="space-y-1.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Attempt to reverse engineer, decompile, or extract the app's source code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Use the AI Coach to seek emergency medical guidance in place of professional care</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Scrape, copy, or redistribute app content, including workout plans and protocols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Use the service for any unlawful purpose or in violation of any regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-danger mt-0.5 shrink-0">•</span>
              <span>Attempt to gain unauthorised access to other users' accounts or our systems</span>
            </li>
          </ul>
        </motion.section>

        {/* Changes to Terms */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Changes to These Terms</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We may update these terms from time to time. When we make material changes, we'll notify you via the app or email at least 14 days before they take effect. Continued use of Muscle AI after that date means you accept the updated terms.
          </p>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48, ease }}
          className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Contact</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Questions about these terms? Email us at{" "}
            <span className="text-primary">legal@muscleai.app</span>. We aim to respond within 5 business days.
          </p>
        </motion.section>
      </div>

      <BottomNav />
    </div>
  );
};

export default TermsPage;
