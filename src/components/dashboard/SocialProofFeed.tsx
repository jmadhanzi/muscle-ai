import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const TESTIMONIALS = [
  { name: "Rachel M.", drug: "Wegovy", action: "preserved 96% of her muscle mass", stat: "Week 8 milestone", emoji: "💪" },
  { name: "Tom K.", drug: "Mounjaro", action: "hit protein target 14 days straight", stat: "148g avg/day", emoji: "🔥" },
  { name: "Linda S.", drug: "Ozempic", action: "completed her nausea-day workout", stat: "Modified routine", emoji: "🏋️" },
  { name: "Marcus D.", drug: "Wegovy", action: "shared his 12-week transformation", stat: "1.2k reactions", emoji: "🏆" },
  { name: "Priya R.", drug: "Mounjaro", action: "unlocked the Consistency Champion badge", stat: "21-day streak", emoji: "⚡" },
  { name: "Jake W.", drug: "Ozempic", action: "logged every meal for a month", stat: "Protein master", emoji: "🥩" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const SocialProofFeed = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch approximate subscriber count from profiles table
    const fetchCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (count !== null) setSubscriberCount(count);
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const item = TESTIMONIALS[currentIdx];

  return (
    <div className="space-y-2">
      {/* Live subscriber count */}
      {subscriberCount !== null && subscriberCount > 0 && (
        <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>
            <span className="font-mono font-bold text-primary">{subscriberCount.toLocaleString()}</span> members protecting their muscle
          </span>
        </div>
      )}

      {/* Star rating */}
      <div className="flex items-center justify-center gap-1 text-xs">
        {"★★★★★".split("").map((star, i) => (
          <span key={i} className="text-accent-gold">{star}</span>
        ))}
        <span className="text-on-surface-variant ml-1 font-mono">4.9</span>
      </div>

      {/* Testimonial rotation */}
      <div className="bg-surface-container-low rounded-lg px-4 py-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
            className="flex items-start gap-2 text-xs"
          >
            <span className="mt-0.5">{item.emoji}</span>
            <span className="text-on-surface-variant leading-relaxed">
              <span className="font-medium text-on-surface">{item.name}</span>
              {" "}<span className="text-primary/70 font-mono text-[10px]">({item.drug})</span>
              {" "}{item.action} — <span className="text-primary font-mono font-bold">{item.stat}</span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialProofFeed;
