import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const VAPID_PUBLIC_KEY = "BA_Pubh8_F-yuICJUrx2nawf8Pd688rshUIEPf2zg2B1xhpCCyEfpnK7cl-Et9ls--ZCHziLYu-dnzqPcrrgm0w";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(userId: string | undefined) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);
    if (supported) setPermissionState(Notification.permission);
  }, []);

  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    });
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // SW registration failure is non-critical — app still works without push
    });
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!userId || !isSupported) return;
    try {
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

      // FIX: push_subscriptions IS in the generated types — remove "as any"
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
    } catch {
      toast({ title: "Subscription failed", description: "Something went wrong. Try again.", variant: "destructive" });
    }
  }, [userId, isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!userId || !isSupported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        // FIX: push_subscriptions IS in the generated types — remove "as any"
        await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", endpoint);
      }
      setIsSubscribed(false);
      toast({ title: "Notifications disabled", description: "You won't receive push reminders." });
    } catch {
      // Unsubscribe failure is non-critical
    }
  }, [userId, isSupported]);

  return { isSupported, isSubscribed, permissionState, subscribe, unsubscribe };
}
