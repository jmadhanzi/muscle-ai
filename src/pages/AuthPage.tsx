import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const hasRef = searchParams.get("ref") === "1";
  const [isLogin, setIsLogin] = useState(!hasRef);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Scroll to top 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /** After sign-in, route to dashboard if onboarding complete, else start onboarding. */
  const redirectAfterLogin = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", userId)
      .maybeSingle();
    navigate(profile?.onboarding_completed ? "/dashboard" : "/personal-identity", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Read referral code fresh each time (avoids stale reads after navigation)
    const referralCode = sessionStorage.getItem("referral_code");
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await redirectAfterLogin(user.id);
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        if (referralCode) {
          localStorage.setItem("pending_referral_code", referralCode);
          sessionStorage.removeItem("referral_code");
        }
        toast.success("Check your email to confirm your account!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6">
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="material-symbols-outlined material-filled text-primary text-4xl">lock</span>
          <span className="text-primary font-black italic tracking-tighter font-headline text-3xl uppercase">
            MuscleLock AI
          </span>
        </div>

        {/* Show referral banner only when there's a stored code and user is on signup */}
        {!isLogin && sessionStorage.getItem("referral_code") && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-4 text-center">
            <p className="text-xs font-medium text-primary">
              🎁 You've been referred! Sign up to get <span className="font-bold">7 free days</span> of Pro
            </p>
          </div>
        )}

        <div className="bg-surface-container-low rounded-lg p-8">
          <h1 className="font-headline font-bold text-2xl text-on-surface text-center mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-on-surface-variant text-sm text-center mb-8">
            {isLogin ? "Sign in to continue your protocol" : "Start protecting your muscle today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/40 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/40 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_hsla(155,100%,71%,0.25)] active:scale-95 transition-transform duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;