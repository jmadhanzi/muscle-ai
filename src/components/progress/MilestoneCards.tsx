import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Share2, Download, Check, Loader2, X, Eye, Instagram, Copy } from "lucide-react";
import { generateMilestoneCard, shareMilestoneCard, downloadMilestoneCard } from "./milestoneCardGenerator";
import { toast } from "sonner";

interface MilestoneCardsProps {
  muscleScore: number;
  proteinTarget: number;
  medication: string;
  preservePct: number;
  currentWeight: number;
  weightUnit: string;
  dayNumber: number;
  isPro: boolean;
  onPaywall: () => void;
  unlockedIds: Set<number>;
  sharedIds: Set<number>;
  onUnlock: (id: number) => void;
  onShare: (id: number) => void;
}

interface Milestone {
  id: number;
  emoji: string;
  template: string;
  unlocksAt: number;
}

const MILESTONES: Milestone[] = [
  { id: 1, emoji: "🎯", template: "Day 1 — I started protecting my muscle on {drug}", unlocksAt: 1 },
  { id: 2, emoji: "💪", template: "Week 1 complete — Muscle Score: {score}/100", unlocksAt: 7 },
  { id: 3, emoji: "🔥", template: "7-Day Streak — {streak} days of protein goals hit", unlocksAt: 7 },
  { id: 4, emoji: "🥩", template: "Hit my {protein}g protein goal — 3 days in a row!", unlocksAt: 10 },
  { id: 5, emoji: "💉", template: "Survived injection day and still trained 💪", unlocksAt: 8 },
  { id: 6, emoji: "📈", template: "My Muscle Score jumped +{change} points this week", unlocksAt: 14 },
  { id: 7, emoji: "🏆", template: "1 Month on MuscleLock — {preserve}% muscle preserved", unlocksAt: 30 },
  { id: 8, emoji: "⚡", template: "Week 5 complete — halfway through my protocol!", unlocksAt: 35 },
  { id: 9, emoji: "🦾", template: "Nausea day? I modified and trained anyway.", unlocksAt: 14 },
  { id: 10, emoji: "🌟", template: "10-Week Milestone — {weight}{unit} lost, {preserve}% muscle preserved", unlocksAt: 70 },
  { id: 11, emoji: "🎉", template: "I reached my goal weight with my muscle intact!", unlocksAt: 70 },
  { id: 12, emoji: "🧬", template: "GLP-1 + MuscleLock = The protocol that works", unlocksAt: 42 },
];

const ease = [0.16, 1, 0.3, 1] as const;

const MilestoneCards = ({
  muscleScore, proteinTarget, medication, preservePct,
  currentWeight, weightUnit, dayNumber, isPro, onPaywall,
  unlockedIds, sharedIds, onUnlock, onShare,
}: MilestoneCardsProps) => {
  const scoreChange = Math.max(3, Math.round(muscleScore * 0.12));
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMilestone, setPreviewMilestone] = useState<Milestone | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    MILESTONES.forEach((m) => {
      if (m.unlocksAt <= dayNumber && !unlockedIds.has(m.id)) {
        onUnlock(m.id);
      }
    });
  }, [dayNumber, unlockedIds, onUnlock]);

  const fillTemplate = useCallback((tpl: string) =>
    tpl
      .replace("{drug}", medication || "GLP-1")
      .replace("{score}", String(muscleScore))
      .replace("{streak}", "7")
      .replace("{protein}", String(proteinTarget))
      .replace("{change}", String(scoreChange))
      .replace("{preserve}", String(preservePct))
      .replace("{weight}", String(Math.round(currentWeight * 0.08)))
      .replace("{unit}", weightUnit === "kg" ? "kg" : "lbs"),
    [medication, muscleScore, proteinTarget, scoreChange, preservePct, currentWeight, weightUnit]
  );

  const getCardData = useCallback((milestone: Milestone) => ({
    emoji: milestone.emoji,
    text: fillTemplate(milestone.template),
    hashtags: "#MuscleLock  #GLP1Muscle",
  }), [fillTemplate]);

  const openPreview = async (milestone: Milestone) => {
    if (!isPro && milestone.id > 2) {
      onPaywall();
      return;
    }
    setPreviewMilestone(milestone);
    setPreviewLoading(true);
    try {
      const url = await generateMilestoneCard(getCardData(milestone));
      setPreviewUrl(url);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewMilestone(null);
  };

  const handleShareFromPreview = async () => {
    if (!previewMilestone) return;
    setGeneratingId(previewMilestone.id);
    try {
      const cardData = getCardData(previewMilestone);
      const shareText = `${previewMilestone.emoji} ${cardData.text}\n\n#MuscleLock #GLP1Muscle`;
      onShare(previewMilestone.id);
      await shareMilestoneCard(cardData, shareText);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownloadFromPreview = async () => {
    if (!previewMilestone) return;
    setGeneratingId(previewMilestone.id);
    try {
      const cardData = getCardData(previewMilestone);
      await downloadMilestoneCard(cardData, `musclelock-milestone-${previewMilestone.id}.png`);
    } finally {
      setGeneratingId(null);
    }
  };

  const unlockedCount = MILESTONES.filter((m) => m.unlocksAt <= dayNumber || unlockedIds.has(m.id)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-headline font-bold text-lg text-on-surface">🏆 Your Achievements</h2>
        <span className="text-[10px] font-mono text-on-surface-variant">
          {unlockedCount}/{MILESTONES.length} unlocked
        </span>
      </div>
      <p className="text-xs text-on-surface-variant mb-4">Share your wins. Inspire others on GLP-1s.</p>

      <div className="grid grid-cols-2 gap-3">
        {MILESTONES.map((m, i) => {
          const unlocked = m.unlocksAt <= dayNumber || unlockedIds.has(m.id);
          const proLocked = !isPro && m.id > 2;
          const shared = sharedIds.has(m.id);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease }}
              className={`relative rounded-lg border p-4 transition-all duration-200 ${
                unlocked && !proLocked
                  ? "bg-surface-container-lowest border-primary/15"
                  : "bg-surface-container-low/40 border-border opacity-50"
              }`}
            >
              {proLocked && (
                <div className="absolute top-2.5 right-2.5">
                  <Lock className="w-3 h-3 text-on-surface-variant" />
                </div>
              )}

              {shared && !proLocked && (
                <div className="absolute top-2.5 right-2.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
              )}

              <span className="text-2xl block mb-2">{m.emoji}</span>
              <p className="text-xs text-on-surface leading-relaxed line-clamp-3">
                {fillTemplate(m.template)}
              </p>

              {unlocked && !proLocked && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openPreview(m)}
                    className="flex items-center gap-1 text-[10px] font-mono text-primary active:scale-[0.96] transition-transform"
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                  {shared && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-primary/50">
                      <Check className="w-3 h-3" /> Shared
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {(previewMilestone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closePreview}
                className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-[0.95] transition-transform z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image preview */}
              <div className="rounded-xl overflow-hidden border border-border bg-surface-container-lowest">
                {previewLoading ? (
                  <div className="aspect-square flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Milestone card preview"
                    className="w-full aspect-square object-cover"
                  />
                ) : null}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleShareFromPreview}
                  disabled={generatingId === previewMilestone?.id || previewLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg gradient-hero text-primary-foreground text-sm font-medium active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
                >
                  {generatingId === previewMilestone?.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  Share
                </button>
                <button
                  onClick={handleDownloadFromPreview}
                  disabled={generatingId === previewMilestone?.id || previewLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-border active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Share targets hint */}
              <p className="text-center text-[10px] font-mono text-on-surface-variant mt-3">
                1080 × 1080px · Instagram, Twitter/X, Facebook
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilestoneCards;
