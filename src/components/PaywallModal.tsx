import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { PRO_FEATURES } from "@/config/features";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
}

const PaywallModal = ({ open, onClose, feature = "this feature" }: PaywallModalProps) => {
  const navigate = useNavigate();

  // Pick 4 relevant pro features to show
  const highlights = PRO_FEATURES.slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-4 z-[61] max-w-md mx-auto bg-surface-container-lowest rounded-lg p-6 border border-primary/20 shadow-[0_-8px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 gradient-hero rounded-t-lg" />

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-on-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
                  Unlock {feature}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  This is a Pro feature. Upgrade to access your full muscle preservation protocol.
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {highlights.map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  {f.label}
                </div>
              ))}
            </div>

            <button
              onClick={() => { onClose(); navigate("/subscribe"); }}
              className="w-full py-4 rounded-full gradient-hero text-on-primary font-headline font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_24px_hsla(160,100%,45%,0.2)] active:scale-[0.97] transition-transform duration-200 mb-2"
            >
              See Plans
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-on-surface-variant text-sm active:scale-[0.97] transition-transform"
            >
              Not now
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;
