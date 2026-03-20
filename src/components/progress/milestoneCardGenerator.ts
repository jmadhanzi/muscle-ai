/**
 * Renders a 1080×1080 milestone share card on a canvas and returns a blob URL.
 * Dark background, mint gradient accents, MuscleLock branding.
 */

interface CardData {
  emoji: string;
  text: string;
  hashtags: string;
}

const CARD_SIZE = 1080;
const MINT = "#00E5A0";
const MINT_DIM = "rgba(0, 229, 160, 0.15)";
const BLUE = "#0EA5E9";
const BG_PRIMARY = "#080B0F";
const BG_SECONDARY = "#0D1117";
const TEXT_PRIMARY = "#F0F6FC";
const TEXT_MUTED = "rgba(240, 246, 252, 0.5)";

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export async function generateMilestoneCard(data: CardData): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext("2d")!;

  // ── Background ──
  ctx.fillStyle = BG_PRIMARY;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // Subtle radial gradient top-left (mint)
  const grad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 600);
  grad1.addColorStop(0, "rgba(0, 229, 160, 0.08)");
  grad1.addColorStop(1, "transparent");
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // Subtle radial gradient bottom-right (blue)
  const grad2 = ctx.createRadialGradient(CARD_SIZE, CARD_SIZE, 0, CARD_SIZE, CARD_SIZE, 600);
  grad2.addColorStop(0, "rgba(14, 165, 233, 0.06)");
  grad2.addColorStop(1, "transparent");
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // ── Decorative grid pattern ──
  ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
  ctx.lineWidth = 1;
  for (let i = 0; i < CARD_SIZE; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CARD_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CARD_SIZE, i);
    ctx.stroke();
  }

  // ── Mint accent line at top ──
  const topGrad = ctx.createLinearGradient(100, 0, CARD_SIZE - 100, 0);
  topGrad.addColorStop(0, "transparent");
  topGrad.addColorStop(0.3, MINT);
  topGrad.addColorStop(0.7, BLUE);
  topGrad.addColorStop(1, "transparent");
  ctx.fillStyle = topGrad;
  ctx.fillRect(100, 60, CARD_SIZE - 200, 3);

  // ── "MUSCLELOCK" header ──
  ctx.font = "600 18px 'Space Grotesk', 'Inter', sans-serif";
  ctx.fillStyle = TEXT_MUTED;
  ctx.letterSpacing = "8px";
  ctx.textAlign = "center";
  ctx.fillText("MUSCLELOCK", CARD_SIZE / 2, 110);
  ctx.letterSpacing = "0px";

  // ── Emoji (large, centered) ──
  ctx.font = "120px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.emoji, CARD_SIZE / 2, 300);

  // ── Card container for text ──
  const cardX = 80;
  const cardY = 400;
  const cardW = CARD_SIZE - 160;
  const cardH = 320;

  drawRoundRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fillStyle = BG_SECONDARY;
  ctx.fill();

  // Left mint accent border on card
  const accentGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  accentGrad.addColorStop(0, MINT);
  accentGrad.addColorStop(1, BLUE);
  drawRoundRect(ctx, cardX, cardY, 4, cardH, 2);
  ctx.fillStyle = accentGrad;
  ctx.fill();

  // ── Milestone text ──
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "700 38px 'Space Grotesk', 'Inter', sans-serif";
  ctx.fillStyle = TEXT_PRIMARY;
  wrapText(ctx, data.text, cardX + 40, cardY + 50, cardW - 80, 52);

  // ── Mint glow dot ──
  const glowGrad = ctx.createRadialGradient(cardX + 40, cardY + cardH - 40, 0, cardX + 40, cardY + cardH - 40, 20);
  glowGrad.addColorStop(0, MINT);
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cardX + 40, cardY + cardH - 40, 6, 0, Math.PI * 2);
  ctx.fill();

  // ── Hashtags ──
  ctx.font = "500 22px 'Inter', sans-serif";
  ctx.fillStyle = MINT;
  ctx.textAlign = "center";
  ctx.fillText(data.hashtags, CARD_SIZE / 2, 780);

  // ── Bottom accent line ──
  const bottomGrad = ctx.createLinearGradient(100, 0, CARD_SIZE - 100, 0);
  bottomGrad.addColorStop(0, "transparent");
  bottomGrad.addColorStop(0.3, MINT);
  bottomGrad.addColorStop(0.7, BLUE);
  bottomGrad.addColorStop(1, "transparent");
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(100, CARD_SIZE - 60, CARD_SIZE - 200, 3);

  // ── Branding watermark bottom-right ──
  ctx.font = "600 16px 'Space Grotesk', 'Inter', sans-serif";
  ctx.fillStyle = TEXT_MUTED;
  ctx.textAlign = "right";
  ctx.fillText("musclelock.app", CARD_SIZE - 80, CARD_SIZE - 90);

  // ── GLP-1 + Muscle badge ──
  ctx.font = "500 14px 'JetBrains Mono', 'Courier New', monospace";
  ctx.fillStyle = MINT_DIM;
  drawRoundRect(ctx, 80, CARD_SIZE - 110, 180, 32, 16);
  ctx.fill();
  ctx.fillStyle = MINT;
  ctx.textAlign = "center";
  ctx.fillText("#GLP1Muscle", 170, CARD_SIZE - 88);

  // Convert to blob URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob!));
    }, "image/png");
  });
}

export async function downloadMilestoneCard(data: CardData, filename: string) {
  const url = await generateMilestoneCard(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareMilestoneCard(data: CardData, text: string) {
  const url = await generateMilestoneCard(data);
  const response = await fetch(url);
  const blob = await response.blob();
  URL.revokeObjectURL(url);

  const file = new File([blob], "musclelock-milestone.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      text,
      files: [file],
    });
  } else if (navigator.share) {
    await navigator.share({ text });
  } else {
    // Fallback: download
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = "musclelock-milestone.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dlUrl);
  }
}
