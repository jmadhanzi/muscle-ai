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

export async function captureCardElement(
  element: HTMLElement,
): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#080B0F",
    scale: 1, // element is already at 1080px native
    useCORS: true,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob!));
    }, "image/png");
  });
}

export async function downloadFromElement(
  element: HTMLElement,
  filename: string,
) {
  const url = await captureCardElement(element);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareFromElement(
  element: HTMLElement,
  text: string,
) {
  const url = await captureCardElement(element);
  const response = await fetch(url);
  const blob = await response.blob();
  URL.revokeObjectURL(url);

  const file = new File([blob], "musclelock-milestone.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ text, files: [file] });
  } else if (navigator.share) {
    await navigator.share({ text });
  } else {
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
