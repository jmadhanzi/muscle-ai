import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { ClinicalReference } from "@/data/clinicalReferences";

const ease = [0.16, 1, 0.3, 1] as const;

interface ClinicalReferenceSheetProps {
  reference: ClinicalReference | null;
  open: boolean;
  onClose: () => void;
}

const ClinicalReferenceSheet = ({ reference, open, onClose }: ClinicalReferenceSheetProps) => {
  if (!reference) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest rounded-t-2xl border-t border-border max-h-[75vh] overflow-y-auto"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-on-surface-variant/20" />
            </div>

            <div className="px-5 pb-8 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">science</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Clinical Reference</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4 text-on-surface-variant" />
                </button>
              </div>

              {/* Claim */}
              <p className="text-on-surface font-medium text-sm leading-relaxed">
                "{reference.claim}"
              </p>

              {/* Plain English Summary */}
              <div className="bg-surface-container-low rounded-lg p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">In Plain English</span>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  {reference.summary}
                </p>
              </div>

              {/* Full Citation */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Full Citation</span>
                <p className="text-on-surface-variant text-xs leading-relaxed font-mono">
                  {reference.citation}
                </p>
              </div>

              {/* PubMed Link */}
              <a
                href={reference.pubmedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full py-3 rounded-lg bg-primary/10 text-primary text-sm font-medium justify-center active:scale-[0.97] transition-transform"
              >
                <ExternalLink className="w-4 h-4" />
                View on PubMed
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/** Inline citation tap target */
export const CitationMark = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/15 text-primary text-[9px] font-bold ml-1 align-super active:scale-90 transition-transform hover:bg-primary/25"
    aria-label="View source"
  >
    ⓘ
  </button>
);

export default ClinicalReferenceSheet;
