import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PRO_PRODUCT_IDS } from "@/config/stripe";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { Capacitor } from "@capacitor/core";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isPro: boolean;
  subscriptionLoading: boolean;
  subscriptionEnd: string | null;
  checkOnboardingStatus: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseIsPro, setSupabaseIsPro] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const { isPro: revenueCatIsPro } = useRevenueCat();

  // Determine isPro based on platform
  const isPro = Capacitor.isNativePlatform() ? revenueCatIsPro : supabaseIsPro;

  const checkSubscription = useCallback(async () => {
    try {
      setSubscriptionLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("Subscription check error:", error);
        return;
      }
      if (data) {
        const isActive = data.subscribed && PRO_PRODUCT_IDS.includes(data.product_id);
        setSupabaseIsPro(isActive);
        setSubscriptionEnd(data.subscription_end || null);
      }
    } catch (e) {
      console.error("Subscription check failed:", e);
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  const processReferral = useCallback(async (userId: string) => {
    const code = localStorage.getItem("pending_referral_code");
    if (!code) return;
    localStorage.removeItem("pending_referral_code");
    try {
      const { data, error } = await supabase.functions.invoke("process-referral", {
        body: { referralCode: code, referredUserId: userId },
      });
      if (!error && data?.success) {
        console.log("[REFERRAL] Processed successfully:", data);
      }
    } catch (e) {
      console.error("[REFERRAL] Processing failed:", e);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => checkSubscription(), 0);
        processReferral(session.user.id);
      } else {
        setSupabaseIsPro(false);
        setSubscriptionEnd(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription, processReferral]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      session, user, loading, isPro, subscriptionLoading, subscriptionEnd,
      checkSubscription, signUp, signIn, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
