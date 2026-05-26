/**
 * Capacitor platform utilities.
 * Centralises all Capacitor plugin imports so the rest of the app
 * imports from here — makes it easy to mock in tests.
 */
import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Open a URL in the system browser (for OAuth flows, Stripe checkout, etc.)
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

/**
 * Close the in-app browser (called after OAuth redirects back to the app).
 */
export async function closeBrowser(): Promise<void> {
  if (isNative) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.close();
  }
}

/**
 * Native share sheet — falls back to navigator.share → clipboard on web.
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
  } else if (navigator.share) {
    await navigator.share({
      title: options.title,
      text: options.text,
      url: options.url,
    });
  } else if (options.url) {
    await navigator.clipboard.writeText(options.url);
  }
}

/**
 * Copy text to clipboard — uses Capacitor Clipboard on native.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (isNative) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}

/**
 * Trigger haptic feedback.
 */
export async function haptic(style: "light" | "medium" | "heavy" = "light"): Promise<void> {
  if (!isNative) return;
  const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
  const styleMap = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };
  await Haptics.impact({ style: styleMap[style] });
}
