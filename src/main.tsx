import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isNative, platform } from "@/lib/capacitor";

/**
 * Capacitor native initialization.
 * This runs once at app start, before React mounts.
 * Web builds hit none of these branches.
 */
async function initializeNative() {
  if (!isNative) return;

  // ── Status bar ──────────────────────────────────────────────────────────
  // Style.Light = white icons/text — correct for our dark (#080C12) background
  const { StatusBar, Style } = await import("@capacitor/status-bar");
  await StatusBar.setStyle({ style: Style.Light });
  await StatusBar.setBackgroundColor({ color: "#080C12" });

  // ── Splash screen ───────────────────────────────────────────────────────
  const { SplashScreen } = await import("@capacitor/splash-screen");
  // Hide after React has hydrated (called below after render)
  await SplashScreen.show({ autoHide: false });

  // ── Deep link handler ───────────────────────────────────────────────────
  // Handles musclelock:// URLs for:
  //   • Supabase email confirmation  (musclelock://login-callback?...)
  //   • Password reset               (musclelock://reset-password?...)
  //   • Referral landing             (musclelock://ref/:code)
  const { App: CapApp } = await import("@capacitor/app");
  CapApp.addListener("appUrlOpen", (event) => {
    const url = event.url;
    // Parse the URL and extract the path + query string for React Router
    try {
      const parsed = new URL(url);
      // musclelock://login-callback → /login-callback
      // musclelock://ref/MYCODE    → /ref/MYCODE
      const path = parsed.pathname + parsed.search + parsed.hash;

      // Supabase PKCE auth tokens come as query params on the callback URL.
      // Push the path into browser history so React Router picks it up.
      window.history.pushState({}, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch {
      // Malformed URL — ignore
    }
  });

  // ── Back button (Android) ────────────────────────────────────────────────
  const { App: CapApp2 } = await import("@capacitor/app");
  CapApp2.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      // Exit the app if there's no history
      CapApp2.exitApp();
    }
  });

  return SplashScreen;
}

// Boot sequence
initializeNative().then(async (splashScreen) => {
  const root = document.getElementById("root")!;

  createRoot(root).render(<App />);

  // Hide splash screen after first render (250ms grace period)
  if (splashScreen && isNative) {
    setTimeout(() => {
      splashScreen.hide({ fadeOutDuration: 300 });
    }, 250);
  }
});
