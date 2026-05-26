import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, FileText, AlertTriangle, CreditCard, Ban,
  RefreshCw, Mail, Shield, Scale, Cpu, UserCheck,
  Zap, Globe, Lock,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Reusable sub-components ──────────────────────────────────────────────────

const SectionHeader = ({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className={`text-[10px] font-mono uppercase tracking-widest ${danger ? "text-accent-danger" : "text-on-surface-variant"}`}>
      {label}
    </span>
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

const Bullet = ({ children, danger }: { children: React.ReactNode; danger?: boolean }) => (
  <li className="flex items-start gap-2">
    <span className={`mt-0.5 shrink-0 ${danger ? "text-accent-danger" : "text-primary"}`}>•</span>
    <span className="text-xs text-on-surface-variant leading-relaxed">{children}</span>
  </li>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-on-surface mt-3 mb-1">{children}</p>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const TermsPage = () => {
  const navigate = useNavigate();

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
        <h1 className="font-headline font-bold text-xl text-on-surface">Terms of Service</h1>
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

        {/* 1 — Agreement */}
        <Card delay={0.08}>
          <SectionHeader icon={<FileText className="w-4 h-4 text-primary" />} label="Agreement to These Terms" />
          <p className="text-sm text-on-surface leading-relaxed">
            By creating an account or using Muscle AI in any way, you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any additional guidelines posted in the app.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            If you do not agree, do not create an account or use the service. For questions, contact us at{" "}
            <span className="text-primary font-medium">legal@muscleai.app</span>.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            These Terms form a binding legal agreement between you and Muscle AI, Inc. ("Muscle AI", "we", "us"). They govern all versions of the app — iOS, Android, and web.
          </p>
        </Card>

        {/* 2 — Medical Disclaimer (danger card — most important) */}
        <Card delay={0.14} danger>
          <SectionHeader
            icon={<AlertTriangle className="w-4 h-4 text-accent-danger" />}
            label="Critical Medical Disclaimer — Read Carefully"
            danger
          />
          <p className="text-sm text-on-surface font-medium leading-relaxed">
            Muscle AI is a wellness and fitness application. It is NOT a medical device, clinical service, or healthcare provider.
          </p>

          <SubHeading>What this means for you</SubHeading>
          <ul className="space-y-1.5">
            <Bullet danger>Nothing in the app — including the AI Coach, Muscle Score, workout plans, nutrition suggestions, or any content — constitutes medical advice, clinical diagnosis, or treatment.</Bullet>
            <Bullet danger>The app is not FDA-cleared or FDA-approved as a medical device. It is classified as general wellness software under FDA guidance on mobile medical applications.</Bullet>
            <Bullet danger>Muscle AI is not a HIPAA Covered Entity. We are not your healthcare provider and do not create a provider-patient relationship with you.</Bullet>
            <Bullet danger>Always consult your prescribing physician or a licensed healthcare professional before changing your GLP-1 medication dose, schedule, or brand.</Bullet>
            <Bullet danger>Always consult a physician before starting, modifying, or stopping any exercise or nutrition program — especially while on GLP-1 therapy.</Bullet>
          </ul>

          <SubHeading>Emergency situations</SubHeading>
          <p className="text-xs text-on-surface leading-relaxed">
            If you are experiencing a medical emergency, <strong>call 911 (US) or your local emergency number immediately</strong>. Do not use the AI Coach or any feature of this app in place of emergency services.
          </p>

          <SubHeading>Symptom red flags — seek immediate care for:</SubHeading>
          <ul className="space-y-1">
            <Bullet danger>Severe or persistent abdominal pain, nausea, or vomiting</Bullet>
            <Bullet danger>Signs of pancreatitis (upper abdominal pain radiating to back)</Bullet>
            <Bullet danger>Significant unexplained muscle weakness or sudden strength loss</Bullet>
            <Bullet danger>Rapid weight loss exceeding 1–1.5% of body weight per week</Bullet>
            <Bullet danger>Thyroid nodules, neck swelling, or difficulty swallowing</Bullet>
            <Bullet danger>Any new or worsening symptoms following a dose change</Bullet>
          </ul>

          <p className="text-[11px] text-on-surface-variant/80 pt-2">
            Individual results vary. The Muscle Score, workout plans, and nutrition recommendations are estimates based on population-level research and the self-reported information you provide. They are not guarantees of any specific health outcome.
          </p>
        </Card>

        {/* 3 — Eligibility */}
        <Card delay={0.22}>
          <SectionHeader icon={<UserCheck className="w-4 h-4 text-primary" />} label="Eligibility" />
          <ul className="space-y-1.5">
            <Bullet>You must be at least <strong className="text-on-surface">18 years old</strong> to use Muscle AI.</Bullet>
            <Bullet>You must have the legal capacity to enter a binding agreement in your jurisdiction.</Bullet>
            <Bullet>You must not be subject to sanctions or export restrictions that would prohibit use of the service.</Bullet>
            <Bullet>Creating an account on behalf of a minor is strictly prohibited. If we discover a user is under 18, we will immediately delete the account and all associated data.</Bullet>
          </ul>
        </Card>

        {/* 4 — Your Account */}
        <Card delay={0.28}>
          <SectionHeader icon={<Lock className="w-4 h-4 text-primary" />} label="Your Account & Responsibilities" />
          <ul className="space-y-1.5">
            <Bullet>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</Bullet>
            <Bullet>You agree to provide accurate, current, and complete information during onboarding and to keep it updated. Inaccurate health data directly affects the quality of your Muscle Score and recommendations.</Bullet>
            <Bullet>You may not share your account, create multiple accounts, or transfer your account to another person.</Bullet>
            <Bullet>Notify us immediately at <span className="text-primary">support@muscleai.app</span> if you suspect unauthorised access to your account.</Bullet>
            <Bullet>We reserve the right to suspend or terminate accounts that violate these Terms.</Bullet>
          </ul>
        </Card>

        {/* 5 — AI Coach */}
        <Card delay={0.34}>
          <SectionHeader icon={<Cpu className="w-4 h-4 text-primary" />} label="AI Coach — Scope & Limitations" />

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-primary mb-1.5">✓ The Coach CAN</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Provide general fitness and nutrition education</li>
                <li>• Suggest protein-rich meal ideas based on your preferences</li>
                <li>• Explain exercise modifications for GLP-1 side-effect days</li>
                <li>• Answer evidence-based questions about muscle preservation on GLP-1 therapy</li>
                <li>• Help you interpret your Muscle Score and weekly trends</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-accent-danger mb-1.5">✗ The Coach CANNOT</p>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                <li>• Diagnose any medical condition</li>
                <li>• Adjust, recommend, or comment on specific medication dosages</li>
                <li>• Provide emergency or crisis mental health support</li>
                <li>• Access your medical records, lab results, or prescriptions</li>
                <li>• Replace the clinical judgment of your physician or dietitian</li>
              </ul>
            </div>
          </div>

          <p className="text-[11px] text-on-surface-variant/80 pt-1">
            The AI Coach may occasionally produce inaccurate or outdated information. Always verify health-related guidance with a qualified professional before acting on it.
          </p>
        </Card>

        {/* 6 — Subscriptions & Billing */}
        <Card delay={0.40}>
          <SectionHeader icon={<CreditCard className="w-4 h-4 text-primary" />} label="Subscriptions & Billing" />

          <SubHeading>Plans & Pricing</SubHeading>
          <ul className="space-y-1">
            <Bullet>Muscle AI offers free and paid subscription tiers. Paid plans renew automatically on a monthly or annual basis at the price shown at checkout.</Bullet>
            <Bullet>Prices are in USD unless stated otherwise. Taxes may apply based on your location.</Bullet>
            <Bullet>We will give you 30 days' advance notice via email of any price increase before it takes effect on your renewal.</Bullet>
          </ul>

          <SubHeading>Free Trial</SubHeading>
          <ul className="space-y-1">
            <Bullet>Where a free trial is offered, it converts automatically to a paid plan at the end of the trial period unless you cancel beforehand.</Bullet>
            <Bullet>Only one free trial per user. Creating multiple accounts to claim additional trials is prohibited.</Bullet>
          </ul>

          <SubHeading>Cancellation</SubHeading>
          <ul className="space-y-1">
            <Bullet>Cancel any time via Settings → Subscription. Cancellation takes effect at the end of your current billing period; you retain access until then.</Bullet>
            <Bullet>Cancelling does not automatically delete your data. To delete data, use About & Trust → Delete Account.</Bullet>
          </ul>

          <SubHeading>Refunds</SubHeading>
          <ul className="space-y-1">
            <Bullet>Payments are generally non-refundable for partial billing periods, except where required by applicable consumer protection law (e.g. EU/UK 14-day cooling-off right for digital services not yet accessed).</Bullet>
            <Bullet>If the app is materially unavailable for an extended period due to our fault, we will pro-rate a credit to your account.</Bullet>
            <Bullet>Dispute a charge? Email <span className="text-primary">billing@muscleai.app</span> before initiating a chargeback — we resolve billing issues quickly.</Bullet>
          </ul>
        </Card>

        {/* 7 — Acceptable Use */}
        <Card delay={0.46}>
          <SectionHeader icon={<Ban className="w-4 h-4 text-primary" />} label="Acceptable Use" />
          <p className="text-xs text-on-surface-variant leading-relaxed">You agree NOT to:</p>
          <ul className="space-y-1.5 mt-1">
            <Bullet danger>Use the AI Coach in place of emergency medical services or for crisis intervention.</Bullet>
            <Bullet danger>Reverse engineer, decompile, disassemble, or attempt to extract the app's source code or proprietary algorithms.</Bullet>
            <Bullet danger>Scrape, copy, or redistribute any content, including workout plans, clinical references, or AI responses.</Bullet>
            <Bullet danger>Use automated tools (bots, scrapers) to access the service or overload our infrastructure.</Bullet>
            <Bullet danger>Attempt to gain unauthorised access to other users' accounts, our databases, or backend systems.</Bullet>
            <Bullet danger>Transmit malware, viruses, or any code designed to disrupt or damage the service.</Bullet>
            <Bullet danger>Use the service for any purpose that is unlawful or violates applicable regulations.</Bullet>
            <Bullet danger>Provide false health data with the intent to manipulate scores or recommendations in a medically harmful way.</Bullet>
          </ul>
        </Card>

        {/* 8 — IP */}
        <Card delay={0.52}>
          <SectionHeader icon={<Shield className="w-4 h-4 text-primary" />} label="Intellectual Property" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All content in Muscle AI — including the Muscle Score algorithm, workout protocols, nutrition frameworks, clinical reference database, UI design, and AI Coach system prompts — is the exclusive property of Muscle AI, Inc. and protected by copyright, trade secret, and other intellectual property laws.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
            Your personal data remains yours. By using the service you grant us a limited, non-exclusive, royalty-free licence to process your data solely to deliver the features described in these Terms. This licence ends when you delete your account.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
            Feedback and suggestions you share with us may be used to improve the service without obligation to you.
          </p>
        </Card>

        {/* 9 — Third-Party Services */}
        <Card delay={0.58}>
          <SectionHeader icon={<Globe className="w-4 h-4 text-primary" />} label="Third-Party Services" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Muscle AI integrates with the following third-party services. Your use of those services is subject to their own terms and privacy policies:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Bullet><strong className="text-on-surface">Supabase</strong> — database and authentication infrastructure. <span className="text-primary">supabase.com/privacy</span></Bullet>
            <Bullet><strong className="text-on-surface">Stripe</strong> — payment processing. <span className="text-primary">stripe.com/privacy</span></Bullet>
            <Bullet><strong className="text-on-surface">Anthropic</strong> — AI inference for the Coach feature. <span className="text-primary">anthropic.com/privacy</span></Bullet>
          </ul>
          <p className="text-[11px] text-on-surface-variant/70 pt-1">
            We are not responsible for the practices of third-party services. If a third-party integration is unavailable, we will endeavour to maintain core app functionality but cannot guarantee it.
          </p>
        </Card>

        {/* 10 — Disclaimers */}
        <Card delay={0.64}>
          <SectionHeader icon={<Zap className="w-4 h-4 text-primary" />} label="Disclaimer of Warranties" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MUSCLE AI IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
            We do not warrant that the service will be uninterrupted, error-free, or that defects will be corrected. Health and fitness information provided is for general wellness purposes only and is not a substitute for professional medical judgment.
          </p>
        </Card>

        {/* 11 — Limitation of Liability */}
        <Card delay={0.70}>
          <SectionHeader icon={<Scale className="w-4 h-4 text-primary" />} label="Limitation of Liability" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, MUSCLE AI, INC. AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Bullet>Any indirect, incidental, special, consequential, or punitive damages</Bullet>
            <Bullet>Loss of profits, data, goodwill, or other intangible losses</Bullet>
            <Bullet>Physical injury or health outcomes resulting from following app recommendations without independent medical advice</Bullet>
            <Bullet>Service interruptions, data breaches caused by circumstances outside our reasonable control</Bullet>
          </ul>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
            Our total aggregate liability for any claim arising from these Terms or your use of the service shall not exceed the greater of (a) the amount you paid to us in the 12 months preceding the claim, or (b) $100 USD.
          </p>
          <p className="text-[11px] text-on-surface-variant/70 mt-2">
            Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability. In those jurisdictions, our liability is limited to the greatest extent permitted by law.
          </p>
        </Card>

        {/* 12 — Indemnification */}
        <Card delay={0.76}>
          <SectionHeader icon={<Shield className="w-4 h-4 text-primary" />} label="Indemnification" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            You agree to defend, indemnify, and hold harmless Muscle AI, Inc. and its affiliates, officers, and employees from any claims, damages, losses, or expenses (including reasonable legal fees) arising from: (a) your use of the service in violation of these Terms; (b) inaccurate health information you provide; or (c) your infringement of any third-party right.
          </p>
        </Card>

        {/* 13 — Governing Law */}
        <Card delay={0.82}>
          <SectionHeader icon={<Scale className="w-4 h-4 text-primary" />} label="Governing Law & Dispute Resolution" />

          <SubHeading>Governing Law</SubHeading>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            These Terms are governed by the laws of the State of Delaware, USA, without regard to its conflict-of-law provisions. EU/UK users retain the benefit of mandatory consumer-protection laws in their country of residence.
          </p>

          <SubHeading>Informal Resolution First</SubHeading>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Before filing any legal claim, email <span className="text-primary">legal@muscleai.app</span> describing the dispute. We will attempt to resolve it within 30 days.
          </p>

          <SubHeading>Binding Arbitration (US Users)</SubHeading>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            If informal resolution fails, US users agree to binding individual arbitration under the American Arbitration Association (AAA) Commercial Arbitration Rules. Class actions and jury trials are waived to the extent permitted by law.
          </p>

          <SubHeading>EU/UK Users</SubHeading>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            EU users may refer disputes to the competent court in their country of domicile. UK users may use the courts of England and Wales. We also participate in the EU Online Dispute Resolution platform: <span className="text-primary">ec.europa.eu/odr</span>.
          </p>
        </Card>

        {/* 14 — Termination */}
        <Card delay={0.88}>
          <SectionHeader icon={<Ban className="w-4 h-4 text-primary" />} label="Termination" />
          <ul className="space-y-1.5">
            <Bullet>You may stop using the service and delete your account at any time.</Bullet>
            <Bullet>We may suspend or terminate your account immediately, without notice, if you materially breach these Terms, engage in fraud, or pose a safety risk to other users or our systems.</Bullet>
            <Bullet>Upon termination, your right to use the service ceases. Sections that by their nature survive termination (including Disclaimers, Limitation of Liability, Indemnification, and Governing Law) will continue to apply.</Bullet>
          </ul>
        </Card>

        {/* 15 — Changes */}
        <Card delay={0.94}>
          <SectionHeader icon={<RefreshCw className="w-4 h-4 text-primary" />} label="Changes to These Terms" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We may update these Terms to reflect product changes, legal requirements, or business needs. For material changes we will:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Bullet>Notify you by in-app banner or email at least <strong className="text-on-surface">14 days</strong> before the changes take effect.</Bullet>
            <Bullet>Post the updated Terms here with a new "Last updated" date.</Bullet>
            <Bullet>Where required by law (e.g. GDPR material changes to processing purposes), request fresh consent before the new Terms apply to your data.</Bullet>
          </ul>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
            Continued use of Muscle AI after the effective date of updated Terms constitutes acceptance. If you disagree, you must delete your account before the effective date.
          </p>
        </Card>

        {/* 16 — Contact */}
        <Card delay={1.00}>
          <SectionHeader icon={<Mail className="w-4 h-4 text-primary" />} label="Contact Us" />
          <div className="space-y-1.5 text-xs text-on-surface-variant">
            <p><strong className="text-on-surface">Legal</strong> · <span className="text-primary">legal@muscleai.app</span></p>
            <p><strong className="text-on-surface">Privacy</strong> · <span className="text-primary">privacy@muscleai.app</span></p>
            <p><strong className="text-on-surface">Billing</strong> · <span className="text-primary">billing@muscleai.app</span></p>
            <p><strong className="text-on-surface">Support</strong> · <span className="text-primary">support@muscleai.app</span></p>
            <p className="text-[11px] text-on-surface-variant/70 pt-1">
              We aim to respond to all enquiries within 5 business days.
            </p>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default TermsPage;
