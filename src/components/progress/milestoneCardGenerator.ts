/**
 * Renders milestone share cards using html2canvas.
 * Captures hidden HTML templates at 1080×1080 (square) or 1080×1920 (story).
 */
import html2canvas from "html2canvas";

export interface CardData {
  emoji: string;
  text: string;
  hashtags: string;
  userName?: string;
  stat?: string;
  week?: number;
  muscleScore?: number;
  glp1Drug?: string;
}

export type CardFormat = "square" | "story";

export async function captureCardElement(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#080B0F",
    scale: 1,
    useCORS: true,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("canvas.toBlob returned null")); return; }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export async function downloadFromElement(element: HTMLElement, filename: string) {
  const url = await captureCardElement(element);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // FIX: always revoke to prevent memory leak
  URL.revokeObjectURL(url);
}

export async function shareFromElement(element: HTMLElement, text: string) {
  let url: string | null = null;
  try {
    url = await captureCardElement(element);
    const response = await fetch(url);
    const blob = await response.blob();
    // FIX: revoke the object URL before the share dialog opens
    URL.revokeObjectURL(url);
    url = null;

    const file = new File([blob], "musclelock-milestone.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text });
    } else {
      // Fallback: open in new tab
      const fallbackUrl = URL.createObjectURL(blob);
      window.open(fallbackUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(fallbackUrl), 60_000);
    }
  } catch (err) {
    // FIX: ensure the object URL is revoked even on failure
    if (url) URL.revokeObjectURL(url);
    throw err;
  }
}
