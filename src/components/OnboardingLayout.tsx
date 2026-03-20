import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  children: ReactNode;
  footer?: ReactNode;
}

const OnboardingLayout = ({ step, totalSteps = 7, children, footer }: OnboardingLayoutProps) => (
  <div className="min-h-screen bg-background overflow-x-hidden relative">
    {/* Ambient glow */}
    <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    <div className="fixed bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

    <Navbar showBack showSteps activeStep={step} totalSteps={totalSteps} />

    <motion.main
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="pt-28 pb-32 px-6 max-w-2xl mx-auto"
    >
      {children}
    </motion.main>

    {footer && (
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-2xl mx-auto">{footer}</div>
      </div>
    )}
  </div>
);

export default OnboardingLayout;
