import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

interface LeaderboardEntry {
  display_name: string;
  medication: string;
  referral_count: number;
}

const rankColors: Record<number, string> = {
  1: "text-accent-gold",
  2: "text-on-surface-variant",
  3: "text-accent-danger",
};

interface ReferralLeaderboardProps {
  userReferrals: number;
  userName?: string;
}

const ReferralLeaderboard = ({ userReferrals, userName }: ReferralLeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc("get_referral_leaderboard");
      if (!error && data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-surface-container-lowest p-5 animate-pulse h-48" />
    );
  }

  if (entries.length === 0 && userReferrals === 0) return null;

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

      {entries.length > 0 ? (
        <div className="space-y-1.5">
          {entries.map((entry, i) => {
            const rank = i + 1;
            return (
              <div
                key={i}
                className="flex items-center gap-3 bg-surface-container rounded-md px-3 py-2.5"
              >
                <span className={`font-headline font-bold text-sm w-5 text-center ${rankColors[rank] || "text-on-surface-variant"}`}>
                  {rank <= 3 ? (
                    <Medal className={`w-4 h-4 inline ${rankColors[rank]}`} />
                  ) : (
                    rank
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-on-surface truncate">{entry.display_name}</p>
                  <p className="text-[9px] font-mono text-on-surface-variant">{entry.medication}</p>
                </div>
                <span className="text-xs font-headline font-bold text-primary">{entry.referral_count}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant text-center py-4">No referrals yet — be the first!</p>
      )}

      {/* User's position */}
      {userName && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-3 bg-primary/5 rounded-md px-3 py-2.5 border border-primary/20">
            <span className="font-headline font-bold text-sm w-5 text-center text-primary">—</span>
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
