import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Share2, Download, Check, Loader2, X, Eye, Instagram, Copy } from "lucide-react";
import { captureCardElement, shareFromElement, downloadFromElement } from "./milestoneCardGenerator";
import MilestoneCardTemplate, { type MilestoneCardData } from "./MilestoneCardTemplate";
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

type CardFormat = "square" | "story";

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
  const [previewFormat, setPreviewFormat] = useState<CardFormat>("square");

  const cardRef = useRef<HTMLDivElement>(null);

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

  const getCardData = useCallback((milestone: Milestone): MilestoneCardData => ({
    emoji: milestone.emoji,
    text: fillTemplate(milestone.template),
    hashtags: `#MuscleLock  #GLP1Muscle  #${(medication || "GLP1").replace(/[\s-]/g, "")}Journey`,
    muscleScore,
    glp1Drug: medication,
    week: Math.ceil(dayNumber / 7),
  }), [fillTemplate, muscleScore, medication, dayNumber]);

  // Capture after template renders
  const capturePreview = useCallback(async () => {
    // Small delay to let the template render
    await new Promise((r) => setTimeout(r, 100));
    if (cardRef.current) {
      const url = await captureCardElement(cardRef.current);
      setPreviewUrl(url);
    }
    setPreviewLoading(false);
  }, []);

  useEffect(() => {
    if (previewMilestone && previewLoading) {
      capturePreview();
    }
  }, [previewMilestone, previewLoading, previewFormat, capturePreview]);

  const openPreview = (milestone: Milestone, format: CardFormat = "square") => {
    if (!isPro && milestone.id > 2) {
      onPaywall();
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFormat(format);
    setPreviewMilestone(milestone);
    setPreviewLoading(true);
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewMilestone(null);
  };

  const switchFormat = (format: CardFormat) => {
    if (format === previewFormat) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFormat(format);
    setPreviewLoading(true);
  };

  const handleShareFromPreview = async () => {
    if (!previewMilestone || !cardRef.current) return;
    setGeneratingId(previewMilestone.id);
    try {
      const cardData = getCardData(previewMilestone);
      const shareText = `${previewMilestone.emoji} ${cardData.text}\n\n${cardData.hashtags}`;
      onShare(previewMilestone.id);
      await shareFromElement(cardRef.current, shareText);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownloadFromPreview = async () => {
    if (!previewMilestone || !cardRef.current) return;
    setGeneratingId(previewMilestone.id);
    try {
      const suffix = previewFormat === "story" ? "story" : "square";
      await downloadFromElement(cardRef.current, `musclelock-milestone-${previewMilestone.id}-${suffix}.png`);
    } finally {
      setGeneratingId(null);
    }
  };

  const unlockedCount = MILESTONES.filter((m) => m.unlocksAt <= dayNumber || unlockedIds.has(m.id)).length;

  const currentCardData = previewMilestone ? getCardData(previewMilestone) : null;

  return (
    <div>
      {/* Hidden card template for html2canvas capture */}
      {previewMilestone && currentCardData && (
        <MilestoneCardTemplate
          ref={cardRef}
          data={currentCardData}
          format={previewFormat}
        />
      )}

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
        {previewMilestone && (
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

              {/* Format toggle */}
              <div className="flex gap-1 mb-3 bg-surface-container-high rounded-lg p-1">
                <button
                  onClick={() => switchFormat("square")}
                  className={`flex-1 text-[11px] font-mono py-1.5 rounded-md transition-colors ${
                    previewFormat === "square"
                      ? "bg-primary text-primary-foreground"
                      : "text-on-surface-variant"
                  }`}
                >
                  1080×1080
                </button>
                <button
                  onClick={() => switchFormat("story")}
                  className={`flex-1 text-[11px] font-mono py-1.5 rounded-md transition-colors ${
                    previewFormat === "story"
                      ? "bg-primary text-primary-foreground"
                      : "text-on-surface-variant"
                  }`}
                >
                  1080×1920 Story
                </button>
              </div>

              {/* Image preview */}
              <div className="rounded-xl overflow-hidden border border-border bg-surface-container-lowest">
                {previewLoading ? (
                  <div className={`${previewFormat === "story" ? "aspect-[9/16]" : "aspect-square"} flex items-center justify-center`}>
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Milestone card preview"
                    className={`w-full ${previewFormat === "story" ? "aspect-[9/16]" : "aspect-square"} object-cover`}
                  />
                ) : null}
              </div>

              {/* Platform share buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {/* Instagram Story */}
                <button
                  onClick={async () => {
                    if (!previewMilestone) return;
                    onShare(previewMilestone.id);
                    // Switch to story format for Instagram
                    if (previewFormat !== "story") switchFormat("story");
                    await handleDownloadFromPreview();
                    const cardData = getCardData(previewMilestone);
                    const text = `${previewMilestone.emoji} ${cardData.text}\n\n${cardData.hashtags}`;
                    await navigator.clipboard.writeText(text);
                    toast.success("Image downloaded & caption copied — paste into Instagram Stories");
                  }}
                  disabled={generatingId === previewMilestone?.id || previewLoading}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-medium active:scale-[0.97] transition-all duration-200 disabled:opacity-50 border border-border bg-surface-container-high text-on-surface"
                >
                  <Instagram className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
                  Instagram
                </button>

                {/* Twitter/X */}
                <button
                  onClick={async () => {
                    if (!previewMilestone) return;
                    onShare(previewMilestone.id);
                    const cardData = getCardData(previewMilestone);
                    const tweetText = encodeURIComponent(
                      `${previewMilestone.emoji} ${cardData.text}\n\n${cardData.hashtags}`
                    );
                    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
                    await handleDownloadFromPreview();
                    toast.success("Image downloaded — attach it to your post on X");
                  }}
                  disabled={generatingId === previewMilestone?.id || previewLoading}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-medium active:scale-[0.97] transition-all duration-200 disabled:opacity-50 border border-border bg-surface-container-high text-on-surface"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X / Twitter
                </button>

                {/* Facebook */}
                <button
                  onClick={async () => {
                    if (!previewMilestone) return;
                    onShare(previewMilestone.id);
                    const shareUrl = encodeURIComponent("https://musclelock.app");
                    const quote = encodeURIComponent(
                      `${previewMilestone.emoji} ${getCardData(previewMilestone).text}\n\n${getCardData(previewMilestone).hashtags}`
                    );
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`, "_blank");
                    await handleDownloadFromPreview();
                    toast.success("Image downloaded — attach it to your Facebook post");
                  }}
                  disabled={generatingId === previewMilestone?.id || previewLoading}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-medium active:scale-[0.97] transition-all duration-200 disabled:opacity-50 border border-border bg-surface-container-high text-on-surface"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              {/* General share + download */}
              <div className="flex gap-2 mt-2">
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

              {/* Copy caption */}
              <button
                onClick={async () => {
                  if (!previewMilestone) return;
                  const cardData = getCardData(previewMilestone);
                  const text = `${previewMilestone.emoji} ${cardData.text}\n\n${cardData.hashtags}`;
                  await navigator.clipboard.writeText(text);
                  toast.success("Caption copied to clipboard");
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 text-[11px] font-mono text-on-surface-variant active:scale-[0.97] transition-transform"
              >
                <Copy className="w-3 h-3" /> Copy caption
              </button>

              <p className="text-center text-[10px] font-mono text-on-surface-variant mt-1">
                {previewFormat === "story" ? "1080 × 1920px · Instagram Story" : "1080 × 1080px · Feed post"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilestoneCards;
