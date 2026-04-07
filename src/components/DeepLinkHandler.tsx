import { useEffect } from 'react';
import { useDeepLink } from '@/hooks/useDeepLink';

/**
 * DeepLinkHandler component
 * Handles deep links from web view - stores referral codes and attempts to open native app
 * This component renders nothing but performs side effects
 */
export function DeepLinkHandler() {
  const { getStoredReferralCode } = useDeepLink();

  useEffect(() => {
    // Check if there's a stored referral code from deep link handling
    const referralCode = getStoredReferralCode();
    
    if (referralCode) {
      console.log('DeepLinkHandler: Found referral code from deep link:', referralCode);
    }
  }, [getStoredReferralCode]);

  // This component doesn't render anything
  return null;
}

export default DeepLinkHandler;
