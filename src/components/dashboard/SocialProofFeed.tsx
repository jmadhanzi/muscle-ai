import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_ITEMS = [
  { name: "Sarah M.", action: "just completed Week 3", stat: "preserved 94% of muscle", emoji: "🟢" },
  { name: "James T.", action: "hit his protein goal", stat: "7 days in a row", emoji: "🟢" },
  { name: "Maria K.", action: "shared her 4-week milestone", stat: "847 reactions", emoji: "🟢" },
  { name: "David R.", action: "finished Day 1 workout", stat: "3 exercises completed", emoji: "🟢" },
  { name: "Emily C.", action: "reached protein target", stat: "142g today", emoji: "🟢" },
];

const SocialProofFeed = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SOCIAL_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const item = SOCIAL_ITEMS[currentIdx];

  return (
    <div className="bg-surface-container-low rounded-lg px-4 py-3 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 text-xs"
        >
          <span>{item.emoji}</span>
          <span className="text-on-surface-variant">
            <span className="font-medium text-on-surface">{item.name}</span>
            {" "}{item.action} — <span className="text-primary font-mono font-bold">{item.stat}</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SocialProofFeed;
