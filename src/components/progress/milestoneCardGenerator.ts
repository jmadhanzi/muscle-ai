/**
 * Renders milestone share cards using html2canvas.
 * Captures hidden HTML templates at 1080×1080 (square) or 1080×1920 (story).
 */
import html2canvas from "html2canvas";
import { shareFile, openBrowser } from "@/lib/capacitor";

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
  URL.revokeObjectURL(url);
}

export async function shareFromElement(element: HTMLElement, text: string) {
  let blobUrl: string | null = null;
  try {
    blobUrl = await captureCardElement(element);
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // Revoke the intermediate object URL before sharing
    URL.revokeObjectURL(blobUrl);
    blobUrl = null;

    const file = new File([blob], "musclelock-milestone.png", { type: "image/png" });

    // shareFile handles Capacitor native share sheet + web fallbacks
    await shareFile(file, text);
  } catch (err) {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    throw err;
  }
}
