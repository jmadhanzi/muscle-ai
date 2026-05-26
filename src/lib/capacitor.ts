/**
 * Capacitor platform utilities — single import point for all native APIs.
 * All functions have correct web fallbacks, so calling code is identical
 * on every platform.
 */
import { Capacitor } from "@capacitor/core";
import { APP_WEB_URL } from "@/integrations/supabase/client";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Return the correct base URL for deep links and share URLs.
 * window.location.origin returns 'capacitor://localhost' on native —
 * use APP_WEB_URL instead so links always resolve correctly.
 */
export function appBaseUrl(): string {
  return isNative ? APP_WEB_URL : window.location.origin;
}

/**
 * Open a URL in the system browser.
 * Use this for: Stripe checkout, OAuth, any external URL.
 * Falls back to window.open on web.
 */
export async function openBrowser(url: string): Promise<void> {
  if (isNative) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url, presentationStyle: "fullscreen" });
  } else {
    window.open(url, "_blank");
  }
}

/** Close the Capacitor in-app browser (e.g. after OAuth redirect). */
export async function closeBrowser(): Promise<void> {
  if (isNative) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.close();
  }
}

/**
 * Native share sheet.
 * Falls back: navigator.share → clipboard copy on web.
 */
export async function shareContent(options: {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}): Promise<void> {
  if (isNative) {
    const { Share } = await import("@capacitor/share");
    await Share.share({
      title: options.title,
      text: options.text,
      url: options.url,
      dialogTitle: options.title,
    });
    return;
  }
  if (navigator.share) {
    await navigator.share({ title: options.title, text: options.text, url: options.url });
    return;
  }
  if (options.url) {
    await navigator.clipboard.writeText(options.url);
  }
}

/**
 * Share a file (image) via the native share sheet.
 * On web, falls back to navigator.share with files if supported,
 * then opens the blob in a new tab.
 */
export async function shareFile(file: File, text?: string): Promise<void> {
  if (isNative) {
    // Convert File to base64 for Capacitor Share
    const { Share } = await import("@capacitor/share");
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    await Share.share({
      title: "MuscleLock Milestone",
      text: text ?? "",
      // Capacitor Share on iOS/Android handles base64 URIs
      url: `data:image/png;base64,${base64}`,
    });
    return;
  }
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], text });
    return;
  }
  // Last resort: open blob in new tab
  const blobUrl = URL.createObjectURL(file);
  window.open(blobUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

/**
 * Copy text to clipboard.
 * Uses @capacitor/clipboard on native, navigator.clipboard on web.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (isNative) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
    return;
  }
  await navigator.clipboard.writeText(text);
}

/**
 * Trigger haptic feedback (no-op on web).
 */
export async function haptic(style: "light" | "medium" | "heavy" = "light"): Promise<void> {
  if (!isNative) return;
  const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
  const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
  await Haptics.impact({ style: map[style] });
}
