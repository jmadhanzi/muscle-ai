import { Capacitor } from '@capacitor/core';

// RevenueCat API Keys from environment variables
export const REVENUECAT_API_KEYS = {
  apple: import.meta.env.VITE_REVENUECAT_APPLE_API_KEY || "appl_AapAjeBBsCshMslHWUOXQKVuLWA",
  google: import.meta.env.VITE_REVENUECAT_GOOGLE_API_KEY,
};

// Get the appropriate API key based on platform
export const getRevenueCatApiKey = () => {
  if (Capacitor.getPlatform() === 'ios') {
    return REVENUECAT_API_KEYS.apple;
  } else if (Capacitor.getPlatform() === 'android') {
    return REVENUECAT_API_KEYS.google;
  }
  return null; // Web
};