import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.musclelock.app",
  appName: "MuscleLock AI",
  webDir: "dist",

  // Server config: use live-reload URL in dev, empty in prod
  // To enable live reload during development, set the url to your
  // local dev server, e.g.: "http://192.168.1.x:8080"
  // Leave empty or omit for production builds.
  server: {
    androidScheme: "https",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#080C12",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "dark", // dark content (light bg) | "light" for light content on dark bg
      backgroundColor: "#080C12",
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    // Capacitor Browser plugin — used for Stripe checkout
    Browser: {
      presentationStyle: "fullscreen",
    },
  },

  // iOS-specific
  ios: {
    contentInset: "always",
    // Deep link scheme for Stripe and email confirmation callbacks
    scheme: "musclelock",
  },

  // Android-specific
  android: {
    // Deep link scheme
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true only during dev
  },
};

export default config;
