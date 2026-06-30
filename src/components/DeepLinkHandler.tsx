import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { type PluginListenerHandle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { useDeepLink } from '@/hooks/useDeepLink';

/**
 * Extract a referral code from a deep link URL.
 * Supports formats:
 *   musclelock://ref/{code}
 *   https://musclelock.app/ref/{code}
 */
function extractReferralCode(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/ref\/(.+)$/);
    if (match) return match[1];

    // Also check query param fallback
    const refCode = parsed.searchParams.get('ref_code');
    if (refCode) return refCode;
  } catch {
    console.warn('DeepLinkHandler: failed to parse URL', url);
  }
  return null;
}

/**
 * DeepLinkHandler component
 * Handles deep links from both web view and native app
 * - Web: stores referral codes and attempts to open native app
 * - Native: listens for Capacitor appUrlOpen events and navigates to referral route
 * This component renders nothing but performs side effects
 */
export function DeepLinkHandler() {
  const { getStoredReferralCode, clearReferralCode } = useDeepLink();
  const navigate = useNavigate();
  const location = useLocation();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    // Prevent handling if already processed in this session
    if (hasHandledRef.current) return;

    console.log('DeepLinkHandler: Checking for referral code');

    // Check if there's already a stored referral code on mount (for app restart scenarios)
    const referralCode = getStoredReferralCode();

    if (referralCode && Capacitor.isNativePlatform()) {
      // Check if we're not already on a referral-related route
      const currentPath = location.pathname;
      if (!currentPath.startsWith('/ref/') && !currentPath.startsWith('/auth')) {
        console.log('DeepLinkHandler: Navigating to referral route for stored code:', referralCode);
        hasHandledRef.current = true;
        navigate(`/ref/${referralCode}`, { replace: true });
      }
      return;
    }

    // Subscribe to Capacitor native appUrlOpen events (iOS / Android)
    let appUrlOpenHandle: PluginListenerHandle | undefined;

    const setupNativeListener = async () => {
      if (!Capacitor.isNativePlatform()) return;

      appUrlOpenHandle = await App.addListener('appUrlOpen', (data) => {
        if (hasHandledRef.current) return;

        const code = extractReferralCode(data.url);
        if (!code) return;

        console.log('DeepLinkHandler: Received native deep link, navigating to:', code);
        hasHandledRef.current = true;

        // Store the referral code and navigate
        sessionStorage.setItem('referral_code', code);
        sessionStorage.setItem('referral_timestamp', Date.now().toString());
        navigate(`/ref/${code}`, { replace: true });
      });
    };

    setupNativeListener();

    return () => {
      appUrlOpenHandle?.remove();
    };
  }, [getStoredReferralCode, clearReferralCode, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
}

export default DeepLinkHandler;
