/**
 * Push notifications hook — platform-aware:
 *  • Native iOS/Android → @capacitor/push-notifications
 *  • Web               → Web Push API (service worker + VAPID)
 */
import { useState, useEffect, useCallback } from "react";
import { isNative } from "@/lib/capacitor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const VAPID_PUBLIC_KEY = "BA_Pubh8_F-yuICJUrx2nawf8Pd688rshUIEPf2zg2B1xhpCCyEfpnK7cl-Et9ls--ZCHziLYu-dnzqPcrrgm0w";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from([...window.atob(base64)].map((c) => c.charCodeAt(0)));
}

async function saveTokenToDb(userId: string, token: string) {
  await supabase.from("push_subscriptions").upsert(
    { user_id: userId, endpoint: token, p256dh: "", auth: "" },
    { onConflict: "user_id,endpoint" }
  );
}

export function usePushNotifications(userId: string | undefined) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

  // ── Detect support ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isNative) {
      // Native always supports push (pending user permission)
      setIsSupported(true);
      setPermissionState("default");
    } else {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      setIsSupported(supported);
      if (supported) setPermissionState(Notification.permission);
    }
  }, []);

  // ── Check existing native subscription ─────────────────────────────────
  useEffect(() => {
    if (!isNative || !isSupported) return;
    import("@capacitor/push-notifications").then(({ PushNotifications }) => {
      PushNotifications.checkPermissions().then(({ receive }) => {
        setIsSubscribed(receive === "granted");
        setPermissionState(receive === "granted" ? "granted" : "default");
      });
    });
  }, [isSupported]);

  // ── Check existing web subscription ────────────────────────────────────
  useEffect(() => {
    if (isNative || !isSupported) return;
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    });
  }, [isSupported]);

  // ── Register web service worker ─────────────────────────────────────────
  useEffect(() => {
    if (isNative || !isSupported) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Non-critical — app works without push
    });
  }, [isSupported]);

  // ── Subscribe ───────────────────────────────────────────────────────────
  const subscribe = useCallback(async () => {
    if (!userId || !isSupported) return;

    if (isNative) {
      // Native push via Capacitor
      const { PushNotifications } = await import("@capacitor/push-notifications");

      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== "granted") {
        toast({ title: "Notifications blocked", description: "Enable in your device Settings.", variant: "destructive" });
        return;
      }
      setPermissionState("granted");

      await PushNotifications.register();

      // Listen for the FCM/APNs token once
      const tokenListener = await PushNotifications.addListener("registration", async (token) => {
        await saveTokenToDb(userId, token.value);
        setIsSubscribed(true);
        toast({ title: "🔔 Notifications enabled", description: "You'll get injection day and streak reminders." });
        await tokenListener.remove();
      });

      const errorListener = await PushNotifications.addListener("registrationError", async () => {
        toast({ title: "Subscription failed", description: "Something went wrong. Try again.", variant: "destructive" });
        await errorListener.remove();
      });

    } else {
      // Web push
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission !== "granted") {
        toast({ title: "Notifications blocked", description: "Enable notifications in your browser settings.", variant: "destructive" });
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = sub.toJSON();
      const { error } = await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        endpoint: subJson.endpoint!,
        p256dh: subJson.keys?.p256dh ?? "",
        auth: subJson.keys?.auth ?? "",
      }, { onConflict: "user_id,endpoint" });

      if (error) {
        toast({ title: "Subscription failed", description: "Could not save notification preference.", variant: "destructive" });
        return;
      }

      setIsSubscribed(true);
      toast({ title: "🔔 Notifications enabled", description: "You'll get injection day and streak reminders." });
    }
  }, [userId, isSupported]);

  // ── Unsubscribe ─────────────────────────────────────────────────────────
  const unsubscribe = useCallback(async () => {
    if (!userId || !isSupported) return;

    if (isNative) {
      // Can't programmatically unsubscribe from APNs/FCM — direct to settings
      toast({ title: "To disable", description: "Go to device Settings → MuscleLock → Notifications." });
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", endpoint);
    }
    setIsSubscribed(false);
    toast({ title: "Notifications disabled", description: "You won't receive push reminders." });
  }, [userId, isSupported]);

  return { isSupported, isSubscribed, permissionState, subscribe, unsubscribe };
}
