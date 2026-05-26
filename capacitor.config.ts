import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.musclelock.app",
  appName: "MuscleLock AI",
  webDir: "dist",

  server: {
    // Use HTTPS scheme on Android WebView (required for cookies / Supabase auth)
    androidScheme: "https",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,        // We control hide manually in main.tsx
      launchAutoHide: false,
      backgroundColor: "#080C12",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    // FIX: Style.Light = white icons/text on dark background.
    // "dark" in Capacitor StatusBar means BLACK content (for light-bg apps).
    // Our app bg is #080C12, so we need LIGHT (white) status bar content.
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#080C12",
      overlaysWebView: false,
    },

    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },

    Browser: {
      presentationStyle: "fullscreen",
    },
  },

  ios: {
    // Extends content under the status bar — our safe-area CSS handles the inset
    contentInset: "always",
    // Custom URL scheme for deep links (email confirm, OAuth callbacks)
    // Users must also add this to their Xcode Info.plist URL Types
    scheme: "musclelock",
    // Prevent text size adjustment when rotating
    allowsLinkPreview: false,
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    // Set to true only during development for Chrome DevTools debugging
    webContentsDebuggingEnabled: false,
  },
};

export default config;
