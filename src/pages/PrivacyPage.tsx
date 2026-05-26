import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Lock, Shield, Eye, Database, UserX, Mail,
  Server, Globe, Clock, AlertTriangle, Cpu, FileSearch,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Reusable sub-components ──────────────────────────────────────────────────

const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">{label}</span>
  </div>
);

const Card = ({
  children,
  delay,
  danger,
}: {
  children: React.ReactNode;
  delay: number;
  danger?: boolean;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease }}
    className={
      danger
        ? "bg-accent-danger/5 rounded-lg border border-accent-danger/15 p-5 space-y-3"
        : "bg-surface-container-lowest rounded-lg border border-border p-5 space-y-3"
    }
  >
    {children}
  </motion.section>
);

const Bullet = ({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <li className="flex items-start gap-2">
    <span className={`mt-0.5 shrink-0 ${danger ? "text-accent-danger" : "text-primary"}`}>•</span>
    <span className="text-xs text-on-surface-variant leading-relaxed">{children}</span>
  </li>
);

const ShieldBullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
    <span className="text-xs text-on-surface leading-relaxed">{children}</span>
  </li>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-on-surface mt-3 mb-1">{children}</p>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const PrivacyPage = () => {
  const navigate = useNavigate();

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* ── Header ── */}
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
        <div>
          <h1 className="font-headline font-bold text-xl text-on-surface">Privacy Policy</h1>
        </div>
      </motion.header>

      <div className="px-5 space-y-6">
        {/* Version stamp */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
          className="text-[11px] text-on-surface-variant font-mono"
        >
          Version 1.0 · Effective June 1, 2025 · Last updated June 1, 2025
        </motion.p>

        {/* 1 — Our Commitment */}
        <Card delay={0.08}>
          <SectionHeader icon={<Lock className="w-4 h-4 text-primary" />} label="Our Commitment" />
          <p className="text-sm text-on-surface leading-relaxed">
            Muscle AI handles your health information with clinical-grade care. Because you share medication details, body composition data, and wellness goals with us, we hold ourselves to the same confidentiality standard you would expect from a healthcare provider.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This policy describes exactly what we collect, the legal basis for processing it, who we share it with, and the controls you have. We will never sell your data, use it for advertising, or share it with insurers or employers — full stop.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Questions? Email our Privacy team at{" "}
            <span className="text-primary font-medium">privacy@muscleai.app</span>.
          </p>
        </Card>

        {/* 2 — Scope */}
        <Card delay={0.14}>
          <SectionHeader icon={<Globe className="w-4 h-4 text-primary" />} label="Scope & Who This Covers" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This policy applies to all users of the Muscle AI mobile and web application, regardless of location. Where applicable, it covers rights under US federal law (including HIPAA-aligned standards), the California Consumer Privacy Act (CCPA / CPRA), the EU/UK General Data Protection Regulation (GDPR), and other applicable state and national privacy laws.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Muscle AI is intended for adults aged 18 and over. We do not knowingly collect data from minors. If you believe a minor has created an account, contact us immediately and we will delete it.
          </p>
        </Card>

        {/* 3 — Information We Collect */}
        <Card delay={0.20}>
          <SectionHeader icon={<Database className="w-4 h-4 text-primary" />} label="Information We Collect" />

          <SubHeading>1 · Account & Identity</SubHeading>
          <ul className="space-y-1">
            <Bullet>Email address and hashed authentication credentials</Bullet>
            <Bullet>Display name and optional profile photo</Bullet>
            <Bullet>Referral code (if applicable)</Bullet>
          </ul>

          <SubHeading>2 · Sensitive Health Information</SubHeading>
          <p className="text-[11px] text-on-surface-variant/80 italic mb-1">
            Treated with heightened protection consistent with HIPAA and GDPR Article 9.
          </p>
          <ul className="space-y-1">
            <Bullet>GLP-1 medication type (e.g. semaglutide, tirzepatide) and duration of use</Bullet>
            <Bullet>Current weight, goal weight, and rate-of-loss targets</Bullet>
            <Bullet>Fitness level, training frequency, and exercise history</Bullet>
            <Bullet>Daily protein intake and dietary preferences</Bullet>
            <Bullet>Self-reported body composition goals and muscle-preservation concerns</Bullet>
            <Bullet>Workout logs and nutrition check-ins you enter manually</Bullet>
            <Bullet>Progress milestones and Muscle Score history</Bullet>
          </ul>

          <SubHeading>3 · AI Coach Conversations</SubHeading>
          <ul className="space-y-1">
            <Bullet>Messages you send to the AI Coach are processed in real time and are <strong className="text-on-surface">not stored permanently</strong> on our servers after the session ends.</Bullet>
            <Bullet>Session transcripts are held in volatile memory only and purged upon session close.</Bullet>
            <Bullet>Conversation content is <strong className="text-on-surface">never</strong> used to train or fine-tune AI models.</Bullet>
          </ul>

          <SubHeading>4 · Technical & Usage Data</SubHeading>
          <ul className="space-y-1">
            <Bullet>Anonymous feature-usage events (e.g. "workout logged") with no health payload</Bullet>
            <Bullet>Device type, OS version, and app version</Bullet>
            <Bullet>Crash reports and performance traces — stripped of personally identifiable fields before storage</Bullet>
            <Bullet>IP address (used for fraud prevention only; not logged against your profile)</Bullet>
          </ul>

          <SubHeading>5 · Payment Information</SubHeading>
          <ul className="space-y-1">
            <Bullet>Billing is handled entirely by Stripe. We never see or store your full card number, CVV, or bank details.</Bullet>
            <Bullet>We retain only a Stripe customer token and subscription status.</Bullet>
          </ul>
        </Card>

        {/* 4 — Legal Basis */}
        <Card delay={0.26}>
          <SectionHeader icon={<FileSearch className="w-4 h-4 text-primary" />} label="Legal Basis for Processing" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We process your data only where we have a lawful basis. For users in the EU/UK this means:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Bullet><strong className="text-on-surface">Explicit Consent (GDPR Art. 6(1)(a) & 9(2)(a))</strong> — for all sensitive health data you enter during onboarding and daily use. You may withdraw consent at any time by deleting your account.</Bullet>
            <Bullet><strong className="text-on-surface">Contract Performance (Art. 6(1)(b))</strong> — to deliver the core app features you signed up for.</Bullet>
            <Bullet><strong className="text-on-surface">Legitimate Interests (Art. 6(1)(f))</strong> — for anonymised crash reporting and fraud prevention, where our interests do not override your rights.</Bullet>
            <Bullet><strong className="text-on-surface">Legal Obligation (Art. 6(1)(c))</strong> — where we must retain records to comply with applicable law.</Bullet>
          </ul>
        </Card>

        {/* 5 — How We Use It */}
        <Card delay={0.32}>
          <SectionHeader icon={<Eye className="w-4 h-4 text-primary" />} label="How We Use Your Information" />
          <ul className="space-y-2">
            <Bullet>Compute and update your Muscle Score based on your inputs</Bullet>
            <Bullet>Generate personalised workout plans and nutrition recommendations</Bullet>
            <Bullet>Power the AI Coach to respond contextually and safely within each session</Bullet>
            <Bullet>Surface progress milestones and trend insights on your Dashboard</Bullet>
            <Bullet>Send push notifications for reminders you configure in Settings</Bullet>
            <Bullet>Process payments and manage your subscription status via Stripe</Bullet>
            <Bullet>Detect and prevent fraud, abuse, or security threats</Bullet>
            <Bullet>Diagnose technical issues using anonymised crash data</Bullet>
          </ul>
          <div className="mt-2 p-3 rounded-md bg-primary/5 border border-primary/15">
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              <strong className="text-primary">We will never:</strong> sell your data · use health data for targeted advertising · share data with insurers, employers, or data brokers · use your data to train any AI model · disclose your identity alongside your health information to third parties without your explicit written consent.
            </p>
          </div>
        </Card>

        {/* 6 — Sharing & Subprocessors */}
        <Card delay={0.38}>
          <SectionHeader icon={<Server className="w-4 h-4 text-primary" />} label="Sharing & Subprocessors" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We share data only with the vendors listed below, each bound by a Data Processing Agreement (DPA) with protections at least as strong as this policy:
          </p>

          <div className="mt-2 space-y-2">
            {[
              { name: "Supabase", role: "Database hosting & authentication", transfer: "US (AWS us-east-1)" },
              { name: "Stripe", role: "Payment processing", transfer: "US / EU (SCCs in place)" },
              { name: "Anthropic", role: "AI Coach inference (session only, no storage)", transfer: "US" },
              { name: "Sentry", role: "Anonymised crash reporting", transfer: "US" },
            ].map((sp) => (
              <div key={sp.name} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-on-surface">{sp.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{sp.role}</p>
                </div>
                <span className="text-[10px] text-on-surface-variant/70 font-mono shrink-0">{sp.transfer}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-on-surface-variant/70 pt-1">
            We may also disclose data where required by a valid court order or law-enforcement request. We will notify you if legally permitted to do so before complying.
          </p>
        </Card>

        {/* 7 — Security */}
        <Card delay={0.44}>
          <SectionHeader icon={<Shield className="w-4 h-4 text-primary" />} label="Security Safeguards" />

          <SubHeading>Technical Controls</SubHeading>
          <ul className="space-y-1.5">
            <ShieldBullet>All data encrypted in transit using TLS 1.3; at rest using AES-256.</ShieldBullet>
            <ShieldBullet>Database-level row security (RLS) ensures you can only access your own records.</ShieldBullet>
            <ShieldBullet>Multi-factor authentication available for all staff accounts; mandatory for privileged access.</ShieldBullet>
            <ShieldBullet>Regular third-party penetration tests; critical findings patched within 72 hours.</ShieldBullet>
          </ul>

          <SubHeading>Administrative Controls</SubHeading>
          <ul className="space-y-1.5">
            <ShieldBullet>Role-based access control — engineers cannot access production health data without a documented, time-limited justification.</ShieldBullet>
            <ShieldBullet>All internal data access is logged and reviewed quarterly.</ShieldBullet>
            <ShieldBullet>Staff undergo annual HIPAA-aligned privacy and security training.</ShieldBullet>
          </ul>

          <SubHeading>Breach Response</SubHeading>
          <ul className="space-y-1.5">
            <ShieldBullet>In the event of a data breach affecting your information, we will notify you within 72 hours of discovery — consistent with GDPR Article 33 and state breach-notification laws.</ShieldBullet>
          </ul>
        </Card>

        {/* 8 — AI & Machine Learning */}
        <Card delay={0.50}>
          <SectionHeader icon={<Cpu className="w-4 h-4 text-primary" />} label="AI Coach & Machine Learning" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We take an explicit stance on how your data interacts with AI:
          </p>
          <ul className="space-y-2 mt-1">
            <Bullet><strong className="text-on-surface">No model training.</strong> Your conversations and health data are never used to train, fine-tune, or evaluate any AI model — ours or any third party's.</Bullet>
            <Bullet><strong className="text-on-surface">Session isolation.</strong> Each AI Coach session is stateless. The model receives only the context you provide in that session; prior sessions are not accessible.</Bullet>
            <Bullet><strong className="text-on-surface">Anthropic API.</strong> Prompts are sent to Anthropic for inference under their zero-data-retention API policy. Anthropic does not log or store your messages.</Bullet>
            <Bullet><strong className="text-on-surface">No automated decisions.</strong> No legally significant or similarly impactful decisions are made about you by automated means without human review.</Bullet>
          </ul>
        </Card>

        {/* 9 — Retention */}
        <Card delay={0.56}>
          <SectionHeader icon={<Clock className="w-4 h-4 text-primary" />} label="Data Retention" />
          <div className="space-y-2">
            {[
              { type: "Account & health data", period: "For the life of your account, then 30 days after deletion request" },
              { type: "AI Coach transcripts", period: "Purged from memory at session end — never written to disk" },
              { type: "Anonymised usage analytics", period: "24 months rolling, then aggregated beyond re-identification" },
              { type: "Payment records", period: "7 years (tax & legal obligation via Stripe)" },
              { type: "Crash / diagnostic logs", period: "90 days, then automatically deleted" },
              { type: "Backups", period: "Encrypted backups retained for 30 days, then destroyed" },
            ].map((row) => (
              <div key={row.type} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <p className="text-xs font-medium text-on-surface">{row.type}</p>
                <p className="text-[11px] text-on-surface-variant text-right max-w-[55%]">{row.period}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 10 — Your Rights */}
        <Card delay={0.62}>
          <SectionHeader icon={<UserX className="w-4 h-4 text-primary" />} label="Your Rights & How to Exercise Them" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The following rights apply to all users. Additional rights for California (CCPA) and EU/UK (GDPR) residents are noted.
          </p>
          <ul className="space-y-2 mt-1">
            <Bullet><strong className="text-on-surface">Access</strong> — request a structured export of all personal data we hold about you.</Bullet>
            <Bullet><strong className="text-on-surface">Correction</strong> — update inaccurate or incomplete information at any time in Settings → Personal Identity.</Bullet>
            <Bullet><strong className="text-on-surface">Deletion ("Right to be Forgotten")</strong> — permanently erase your account and all associated data via About & Trust → Delete Account. We will process within 30 days.</Bullet>
            <Bullet><strong className="text-on-surface">Portability</strong> — receive your health and fitness data in a machine-readable format (JSON/CSV). Email us to request.</Bullet>
            <Bullet><strong className="text-on-surface">Withdraw Consent</strong> — stop all non-essential data processing by deleting your account. This does not affect the lawfulness of prior processing.</Bullet>
            <Bullet><strong className="text-on-surface">Objection / Restriction (GDPR)</strong> — object to processing based on legitimate interests or request restriction pending a dispute.</Bullet>
            <Bullet><strong className="text-on-surface">Opt-Out of Sale (CCPA)</strong> — we do not sell personal data. This right is inherently satisfied.</Bullet>
            <Bullet><strong className="text-on-surface">Non-Discrimination (CCPA)</strong> — exercising any privacy right will never result in reduced service quality or different pricing.</Bullet>
          </ul>
          <p className="text-[11px] text-on-surface-variant/80 mt-2">
            To submit any request, email <span className="text-primary">privacy@muscleai.app</span> from your registered address. We respond within 30 days (GDPR) or 45 days (CCPA), with one possible extension if we notify you.
          </p>
        </Card>

        {/* 11 — Cross-Border Transfers */}
        <Card delay={0.68}>
          <SectionHeader icon={<Globe className="w-4 h-4 text-primary" />} label="International Data Transfers" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Muscle AI is operated from the United States. If you access the service from the EU, UK, or other regions with data-transfer restrictions, your information will be transferred to the US. We rely on:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Bullet><strong className="text-on-surface">Standard Contractual Clauses (SCCs)</strong> — for EU-to-US transfers with all subprocessors where a UK/EU adequacy decision is not in place.</Bullet>
            <Bullet><strong className="text-on-surface">UK International Data Transfer Agreements (IDTAs)</strong> — for UK-specific transfers.</Bullet>
          </ul>
        </Card>

        {/* 12 — Sensitive — Health Data Warning */}
        <Card delay={0.74} danger>
          <SectionHeader
            icon={<AlertTriangle className="w-4 h-4 text-accent-danger" />}
            label="Important: Health Data Is Sensitive"
          />
          <p className="text-xs text-on-surface leading-relaxed">
            The health information you enter — including GLP-1 medication status, weight, and body composition goals — is classified as <strong>sensitive personal data</strong> under GDPR Article 9 and as information warranting heightened care under US state health-data laws (including Washington My Health MY Data Act, Nevada SB 370, and similar statutes).
          </p>
          <ul className="space-y-1.5">
            <Bullet danger>We process this category of data only on the basis of your explicit, informed consent, which you can withdraw at any time.</Bullet>
            <Bullet danger>We never disclose your medication or diagnosis status to any third party without a separate, specific consent.</Bullet>
            <Bullet danger>We apply the HIPAA "minimum necessary" principle — only the data required to deliver a specific feature is accessed or transmitted.</Bullet>
          </ul>
        </Card>

        {/* 13 — Contact / DPO */}
        <Card delay={0.80}>
          <SectionHeader icon={<Mail className="w-4 h-4 text-primary" />} label="Contact & Data Protection Officer" />
          <div className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <p>For privacy requests, data subject rights, or policy questions:</p>
            <p className="font-medium text-on-surface">Privacy Team · <span className="text-primary">privacy@muscleai.app</span></p>
            <p>EU/UK users may also lodge a complaint with your local supervisory authority (e.g. ICO in the UK, or the relevant EU Data Protection Authority). We would always prefer the chance to resolve concerns directly first.</p>
            <p className="text-[11px] text-on-surface-variant/70 pt-1">
              We aim to respond to all requests within 5 business days and to resolve them within 30 days.
            </p>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrivacyPage;
