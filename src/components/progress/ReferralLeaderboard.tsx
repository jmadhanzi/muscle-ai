import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

// Simulated leaderboard data — in production this would come from a db view
const LEADERBOARD = [
  { rank: 1, name: "Maria C.", referrals: 14, drug: "Mounjaro" },
  { rank: 2, name: "Jake T.", referrals: 11, drug: "Wegovy" },
  { rank: 3, name: "Priya S.", referrals: 9, drug: "Ozempic" },
  { rank: 4, name: "Carlos R.", referrals: 7, drug: "Zepbound" },
  { rank: 5, name: "Lindsay M.", referrals: 6, drug: "Mounjaro" },
];

const rankColors: Record<number, string> = {
  1: "text-accent-gold",
  2: "text-on-surface-variant",
  3: "text-accent-danger",
};

interface ReferralLeaderboardProps {
  userRank?: number;
  userReferrals: number;
  userName?: string;
}

const ReferralLeaderboard = ({ userRank, userReferrals, userName }: ReferralLeaderboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease }}
      className="rounded-lg border border-border bg-surface-container-lowest p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-accent-gold" />
        </div>
        <div>
          <h3 className="font-headline font-bold text-base text-on-surface">Referral Leaderboard</h3>
          <p className="text-[10px] font-mono text-on-surface-variant">Top muscle protectors this month</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-3 bg-surface-container rounded-md px-3 py-2.5"
          >
            <span className={`font-headline font-bold text-sm w-5 text-center ${rankColors[entry.rank] || "text-on-surface-variant"}`}>
              {entry.rank <= 3 ? (
                <Medal className={`w-4 h-4 inline ${rankColors[entry.rank]}`} />
              ) : (
                entry.rank
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-on-surface truncate">{entry.name}</p>
              <p className="text-[9px] font-mono text-on-surface-variant">{entry.drug}</p>
            </div>
            <span className="text-xs font-headline font-bold text-primary">{entry.referrals}</span>
          </div>
        ))}
      </div>

      {/* User's position */}
      {userName && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-3 bg-primary/5 rounded-md px-3 py-2.5 border border-primary/20">
            <span className="font-headline font-bold text-sm w-5 text-center text-primary">
              {userRank || "—"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-on-surface truncate">
                {userName} <span className="text-[9px] text-on-surface-variant">(You)</span>
              </p>
            </div>
            <span className="text-xs font-headline font-bold text-primary">{userReferrals}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReferralLeaderboard;
