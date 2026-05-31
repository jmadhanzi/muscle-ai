import { useState, useEffect, useCallback } from 'react';
import { Purchases, PurchaserInfo, PurchasesOffering } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { getRevenueCatApiKey } from '@/config/revenuecat';
import { toast } from 'sonner';

export interface Offering {
  identifier: string;
  serverDescription: string;
  metadata: { [key: string]: any };
  availablePackages: Package[];
}

export interface Package {
  identifier: string;
  packageType: string;
  product: Product;
  offeringIdentifier: string;
}

export interface Product {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
  currencyCode: string;
}

export function useRevenueCat() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize RevenueCat
  useEffect(() => {
    const initialize = async () => {
      if (!Capacitor.isNativePlatform()) return;

      const apiKey = getRevenueCatApiKey();
      if (!apiKey) {
        console.error('RevenueCat API key not found for platform');
        return;
      }

      try {
        console.log('Initializing RevenueCat with API key for platform:', Capacitor.getPlatform());
        await Purchases.configure({ apiKey });
        console.log('RevenueCat initialized successfully');
        setIsInitialized(true);

        // Get current purchaser info
        await checkSubscriptionStatus();

        // Get offerings
        await fetchOfferings();

        // Log purchaser info for debugging
        const purchaserInfo = await Purchases.getPurchaserInfo();
        console.log('Current purchaser info:', purchaserInfo);
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
      }
    };

    initialize();
  }, []);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      const hasActiveSubscription = purchaserInfo.activeSubscriptions?.length > 0;

      if (hasActiveSubscription) {
        setIsPro(true);
        return;
      }

      // Fallback: check profiles table for referral rewards or other non-RevenueCat grants
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status, subscription_end_date")
          .eq("user_id", user.id)
          .single();

        if (
          profile &&
          profile.subscription_status === "pro" &&
          profile.subscription_end_date &&
          new Date(profile.subscription_end_date) > new Date()
        ) {
          setIsPro(true);
          return;
        }
      }

      setIsPro(false);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  }, [isInitialized]);

  const fetchOfferings = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const offeringsResult = await Purchases.getOfferings();
      console.log('RevenueCat offerings result:', offeringsResult);
      if (offeringsResult.current) {
        console.log('Setting offerings:', [offeringsResult.current]);
        setOfferings([offeringsResult.current]);
      } else {
        console.warn('No current offering available from RevenueCat');
      }
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
    }
  }, [isInitialized]);

  const purchasePackage = useCallback(async (pkg: Package): Promise<boolean> => {
    if (!isInitialized) return false;

    setLoading(true);
    try {
      const { purchaserInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      const hasActiveSubscription = purchaserInfo.activeSubscriptions?.length > 0;
      setIsPro(hasActiveSubscription);

      if (hasActiveSubscription) {
        toast.success('Purchase successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Purchase failed:', error);
      if (error.userCancelled) {
        toast.info('Purchase cancelled');
      } else {
        toast.error('Purchase failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  const restorePurchases = useCallback(async () => {
    if (!isInitialized) return;

    setLoading(true);
    try {
      const purchaserInfo = await Purchases.restorePurchases();
      const hasActiveSubscription = purchaserInfo.activeSubscriptions?.length > 0;

      if (hasActiveSubscription) {
        setIsPro(true);
        toast.success('Purchases restored!');
      } else {
        // Fallback: check profiles table for referral rewards
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_status, subscription_end_date")
            .eq("user_id", user.id)
            .single();

          if (
            profile &&
            profile.subscription_status === "pro" &&
            profile.subscription_end_date &&
            new Date(profile.subscription_end_date) > new Date()
          ) {
            setIsPro(true);
            toast.success('Active subscription found!');
            return;
          }
        }
        setIsPro(false);
        toast.info('No active subscriptions found');
      }
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isPro,
    offerings,
    loading,
    purchasePackage,
    restorePurchases,
    checkSubscriptionStatus,
    fetchOfferings,
  };
}