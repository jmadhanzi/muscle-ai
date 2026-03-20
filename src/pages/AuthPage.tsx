import { useState } from "react";
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

  // Referral code from sessionStorage (set by /ref/:code route)
  const referralCode = sessionStorage.getItem("referral_code");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/personal-identity");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        // If there's a referral code, store it so it can be processed after email confirmation
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
      {/* Ambient glow */}
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="material-symbols-outlined material-filled text-primary text-4xl">lock</span>
          <span className="text-primary font-black italic tracking-tighter font-headline text-3xl uppercase">
            MuscleLock AI
          </span>
        </div>

        {referralCode && !isLogin && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-4 text-center">
            <p className="text-xs font-medium text-primary">🎁 You've been referred! Sign up to get <span className="font-bold">7 free days</span> of Pro</p>
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
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-surface-variant transition-all outline-none"
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
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-surface-variant transition-all outline-none"
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
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
            {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Dev bypass — only visible in development */}
        {import.meta.env.DEV && (
          <button
            onClick={async () => {
              setLoading(true);
              const { error } = await signIn("dev@musclelock.app", "devdev123");
              if (error) {
                const { error: upErr } = await supabase.auth.signUp({
                  email: "dev@musclelock.app",
                  password: "devdev123",
                  options: { data: { dev_bypass: true } },
                });
                if (upErr) {
                  toast.error("Dev bypass failed: " + upErr.message);
                } else {
                  const { error: retryErr } = await signIn("dev@musclelock.app", "devdev123");
                  if (retryErr) toast.error("Dev bypass failed: " + retryErr.message);
                  else navigate("/personal-identity");
                }
              } else {
                navigate("/personal-identity");
              }
              setLoading(false);
            }}
            className="mt-4 w-full py-3 rounded-lg border border-dashed border-primary/30 text-primary/60 text-xs font-mono hover:bg-primary/5 transition-colors"
          >
            🔧 Dev Bypass (skip auth)
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
