import { forwardRef } from "react";

export interface MilestoneCardData {
  emoji: string;
  text: string;
  hashtags: string;
  userName?: string;
  stat?: string;
  week?: number;
  muscleScore?: number;
  glp1Drug?: string;
}

interface Props {
  data: MilestoneCardData;
  format: "square" | "story";
}

const CARD_W = 1080;
const SQUARE_H = 1080;
const STORY_H = 1920;

/**
 * Hidden off-screen HTML template rendered by html2canvas.
 * All sizing in px at 1080 width — html2canvas captures at native resolution.
 */
const MilestoneCardTemplate = forwardRef<HTMLDivElement, Props>(
  ({ data, format }, ref) => {
    const h = format === "story" ? STORY_H : SQUARE_H;
    const isStory = format === "story";

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: CARD_W,
          height: h,
          fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
          overflow: "hidden",
          background: "#080B0F",
        }}
      >
        {/* Mesh gradient overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 10%, rgba(0,229,160,0.08) 0%, transparent 60%), " +
              "radial-gradient(circle at 90% 90%, rgba(14,165,233,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 100,
            right: 100,
            height: 3,
            background: "linear-gradient(90deg, transparent, #00E5A0 30%, #0EA5E9 70%, transparent)",
            borderRadius: 2,
          }}
        />

        {/* MUSCLELOCK header */}
        <div
          style={{
            position: "absolute",
            top: isStory ? 180 : 90,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(240,246,252,0.5)",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 8,
            textTransform: "uppercase" as const,
          }}
        >
          MUSCLELOCK
        </div>

        {/* Emoji */}
        <div
          style={{
            position: "absolute",
            top: isStory ? 380 : 220,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 120,
            lineHeight: "140px",
          }}
        >
          {data.emoji}
        </div>

        {/* Text card container */}
        <div
          style={{
            position: "absolute",
            top: isStory ? 600 : 400,
            left: 80,
            right: 80,
            background: "#0D1117",
            borderRadius: 24,
            padding: "50px 40px 50px 44px",
            borderLeft: "4px solid transparent",
            backgroundImage:
              "linear-gradient(#0D1117, #0D1117), linear-gradient(180deg, #00E5A0, #0EA5E9)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            minHeight: isStory ? 380 : 280,
          }}
        >
          <p
            style={{
              color: "#F0F6FC",
              fontSize: 38,
              fontWeight: 700,
              lineHeight: "52px",
              margin: 0,
              overflowWrap: "break-word",
            }}
          >
            {data.text}
          </p>

          {/* Stat line (if provided) */}
          {data.stat && (
            <p
              style={{
                color: "rgba(240,246,252,0.6)",
                fontSize: 22,
                fontWeight: 500,
                marginTop: 24,
                lineHeight: "30px",
              }}
            >
              {data.stat}
            </p>
          )}

          {/* Muscle Score badge */}
          {data.muscleScore != null && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 24,
                padding: "8px 16px",
                background: "rgba(0,229,160,0.12)",
                borderRadius: 20,
                color: "#00E5A0",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              }}
            >
              Muscle Score: {data.muscleScore}/100
            </div>
          )}

          {/* Glow dot */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 40,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#00E5A0",
              boxShadow: "0 0 20px rgba(0,229,160,0.4)",
            }}
          />
        </div>

        {/* Hashtags */}
        <div
          style={{
            position: "absolute",
            bottom: isStory ? 320 : 160,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#00E5A0",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          {data.hashtags}
        </div>

        {/* Drug-specific hashtag badge */}
        {data.glp1Drug && (
          <div
            style={{
              position: "absolute",
              bottom: isStory ? 260 : 110,
              left: 80,
              display: "inline-flex",
              padding: "6px 18px",
              background: "rgba(0,229,160,0.15)",
              borderRadius: 16,
              color: "#00E5A0",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            }}
          >
            #{data.glp1Drug.replace(/[\s-]/g, "")}Journey
          </div>
        )}

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 100,
            right: 100,
            height: 3,
            background: "linear-gradient(90deg, transparent, #00E5A0 30%, #0EA5E9 70%, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: isStory ? 80 : 76,
            right: 80,
            color: "rgba(240,246,252,0.35)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          musclelock.app
        </div>

        {/* Week badge (if provided) */}
        {data.week != null && (
          <div
            style={{
              position: "absolute",
              bottom: isStory ? 80 : 76,
              left: 80,
              color: "rgba(240,246,252,0.35)",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            }}
          >
            Week {data.week}
          </div>
        )}
      </div>
    );
  }
);

MilestoneCardTemplate.displayName = "MilestoneCardTemplate";

export default MilestoneCardTemplate;
