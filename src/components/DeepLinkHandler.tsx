import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useDeepLink } from '@/hooks/useDeepLink';

/**
 * DeepLinkHandler component
 * Handles deep links from both web view and native app
 * - Web: stores referral codes and attempts to open native app
 * - Native: listens for deep link events and navigates to referral route
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
        // Clear the code after navigation to prevent repeated handling
        setTimeout(() => clearReferralCode(), 100);
      }
      return;
    }

    // Listen for deep link events from native app
    const handleDeepLinkEvent = (event: CustomEvent) => {
      if (hasHandledRef.current) return;

      const { referralCode } = event.detail;
      console.log('DeepLinkHandler: Received deep link event, navigating to:', referralCode);

      if (Capacitor.isNativePlatform()) {
        hasHandledRef.current = true;
        navigate(`/ref/${referralCode}`, { replace: true });
        // Clear the code after navigation
        setTimeout(() => clearReferralCode(), 100);
      }
    };

    window.addEventListener('deepLinkReceived', handleDeepLinkEvent as EventListener);

    return () => {
      window.removeEventListener('deepLinkReceived', handleDeepLinkEvent as EventListener);
    };
  }, [getStoredReferralCode, clearReferralCode, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
}

export default DeepLinkHandler;
