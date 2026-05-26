import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, APP_WEB_URL } from "@/integrations/supabase/client";
import { PRO_PRODUCT_IDS } from "@/config/stripe";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isPro: boolean;
  subscriptionLoading: boolean;
  subscriptionEnd: string | null;
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
  const [isPro, setIsPro] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      setSubscriptionLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error || !data) return;
      const isActive = data.subscribed && PRO_PRODUCT_IDS.includes(data.product_id);
      setIsPro(isActive);
      setSubscriptionEnd(data.subscription_end || null);
    } catch {
      // Subscription check failure is non-critical — user stays on free tier
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  const processReferral = useCallback(async (userId: string) => {
    const code = localStorage.getItem("pending_referral_code");
    if (!code) return;
    localStorage.removeItem("pending_referral_code");
    try {
      await supabase.functions.invoke("process-referral", {
        body: { referralCode: code, referredUserId: userId },
      });
    } catch {
      // Referral processing failure is non-critical
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
      if (newSession?.user) {
        // Defer to avoid Supabase deadlock in auth state change handler
        setTimeout(() => checkSubscription(), 0);
        processReferral(newSession.user.id);
      } else {
        setIsPro(false);
        setSubscriptionEnd(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
      if (initialSession?.user) checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription, processReferral]);

  // Auto-refresh subscription status every 60 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: APP_WEB_URL },
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
