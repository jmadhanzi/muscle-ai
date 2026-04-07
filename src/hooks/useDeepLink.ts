import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * App Store URLs
 * Replace with actual App Store IDs from your app
 */
const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/app/muscle-ai/id6470000000', // Replace with actual App Store URL
  android: 'https://play.google.com/store/apps/details?id=com.jmadhanzi.musclelockai',
};

/**
 * Deep Link configuration
 */
const DEEP_LINK_CONFIG = {
  scheme: 'musclelock',
  host: 'musclelock.app',
  webFallbackPath: '/ref',
};

/**
 * Custom hook to handle deep links on the web
 * Detects if native app is installed and redirects accordingly
 */
export function useDeepLink() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const handleDeepLink = async () => {
      if (handledRef.current) return;
      handledRef.current = true;

      // Get the current URL
      const url = new URL(window.location.href);
      const path = url.pathname;
      const searchParams = url.searchParams;

      // Check if this is a referral link
      if (path.startsWith('/ref/') || searchParams.has('ref_code')) {
        const referralCode = path.split('/ref/')[1] || searchParams.get('ref_code');

        if (referralCode) {
          // Store the referral code
          sessionStorage.setItem('referral_code', referralCode);
          sessionStorage.setItem('referral_timestamp', Date.now().toString());

          // Try to open native app
          await tryOpenNativeApp(referralCode);
        }
      }
    };

    const tryOpenNativeApp = async (referralCode: string): Promise<void> => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Try to open the native app using custom scheme
      const deepLinkUrl = `${DEEP_LINK_CONFIG.scheme}://ref/${referralCode}`;
      
      // Set fallback timeout
      const FALLBACK_TIMEOUT = 1500;
      
      const startTime = Date.now();
      
      // Try to open the app
      try {
        // Method 1: Try using window.location with custom scheme
        window.location.href = deepLinkUrl;
        
        // Method 2: Try opening universal link if custom scheme fails
        const universalLinkUrl = `https://musclelock.app/ref/${referralCode}`;
        
        // Wait a bit and then try universal link as fallback
        setTimeout(() => {
          if (Date.now() - startTime < FALLBACK_TIMEOUT + 500) {
            // App might not be installed, redirect to store
            redirectToStore(isIOS);
          }
        }, FALLBACK_TIMEOUT);
      } catch (error) {
        console.log('Deep link error:', error);
        // Fallback to store
        redirectToStore(isIOS);
      }
    };

    const redirectToStore = (isIOS: boolean): void => {
      // Only redirect if we're still on the original page
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath.startsWith('/ref')) {
        const storeUrl = isIOS ? APP_STORE_URLS.ios : APP_STORE_URLS.android;
        
        // If the app is definitely not installed, redirect to store
        // For now, we'll redirect after showing the page briefly
        // In production, you'd check app installation status more reliably
        setTimeout(() => {
          // Store referral code before redirect
          const referralCode = sessionStorage.getItem('referral_code');
          if (referralCode) {
            localStorage.setItem('pending_referral_code', referralCode);
          }
          // Optionally redirect to store:
          // window.location.href = storeUrl;
          // For now, keep user on web and they'll be handled by the app
        }, 2000);
      }
    };

    handleDeepLink();
  }, [navigate]);

  // Return the referral code if available
  const getStoredReferralCode = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('referral_code');
  };

  // Clear referral code
  const clearReferralCode = (): void => {
    sessionStorage.removeItem('referral_code');
    sessionStorage.removeItem('referral_timestamp');
  };

  return {
    getStoredReferralCode,
    clearReferralCode,
    APP_STORE_URLS,
  };
}

export default useDeepLink;
