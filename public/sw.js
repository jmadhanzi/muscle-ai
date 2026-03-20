// MuscleLock Push Notification Service Worker
self.addEventListener("push", (event) => {
  const defaultData = {
    title: "MuscleLock",
    body: "Check your daily protocol",
    icon: "/placeholder.svg",
    badge: "/placeholder.svg",
    data: { url: "/dashboard" },
  };

  let payload = defaultData;
  try {
    if (event.data) {
      payload = { ...defaultData, ...event.data.json() };
    }
  } catch {
    // use defaults
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: payload.data,
      vibrate: [200, 100, 200],
      tag: payload.tag || "musclelock-notification",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
