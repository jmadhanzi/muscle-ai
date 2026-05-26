import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// The production web URL — used for email confirmation redirects.
// On native (Capacitor), window.location.origin returns 'capacitor://localhost'
// which Supabase rejects. We use the real production URL here.
export const APP_WEB_URL = import.meta.env.VITE_APP_URL ?? "https://musclelock.app";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    // Deep link URL scheme for native — Supabase redirects here after email confirmation
    // which Capacitor intercepts and routes internally
    flowType: "pkce",
  },
});
