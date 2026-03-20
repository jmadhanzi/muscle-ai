import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  children: ReactNode;
  footer?: ReactNode;
}

const slideVariants = {
  enter: { opacity: 0, x: 60, filter: "blur(4px)" },
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -60,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

const OnboardingLayout = ({ step, totalSteps = 8, children, footer }: OnboardingLayoutProps) => (
  <div className="min-h-screen bg-background overflow-x-hidden relative">
    {/* Ambient glow */}
    <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    <div className="fixed bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

    <Navbar showBack showSteps activeStep={step} totalSteps={totalSteps} />

    <AnimatePresence mode="wait">
      <motion.main
        key={step}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="pt-28 pb-32 px-6 max-w-2xl mx-auto"
      >
        {children}
      </motion.main>
    </AnimatePresence>

    {footer && (
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-2xl mx-auto">{footer}</div>
      </div>
    )}
  </div>
);

export default OnboardingLayout;
