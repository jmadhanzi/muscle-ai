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

  // Map priority to vibration patterns
  const vibrationPatterns = {
    critical: [300, 100, 300, 100, 300],
    high: [200, 100, 200],
    celebration: [100, 50, 100, 50, 100, 50, 300],
    medium: [200, 100, 200],
    "re-engagement": [200],
  };

  const priority = payload.priority || "medium";
  const vibrate = vibrationPatterns[priority] || [200, 100, 200];

  // Add action buttons based on tag
  const actions = [];
  if (payload.tag === "injection-day" || payload.tag === "injection-tomorrow") {
    actions.push({ action: "view-protocol", title: "📋 View Protocol" });
    actions.push({ action: "open-meals", title: "🥩 Meal Plan" });
  } else if (payload.tag === "streak-risk") {
    actions.push({ action: "quick-workout", title: "⚡ Quick Workout" });
    actions.push({ action: "log-item", title: "✅ Log Item" });
  } else if (payload.tag === "streak-milestone") {
    actions.push({ action: "share", title: "🏆 Share Win" });
  } else if (payload.tag?.includes("protein")) {
    actions.push({ action: "open-meals", title: "🥩 Quick Recipe" });
    actions.push({ action: "log-protein", title: "📝 Log Protein" });
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: payload.data,
      vibrate,
      tag: payload.tag || "musclelock-notification",
      renotify: true,
      actions,
      requireInteraction: priority === "critical",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Map actions to URLs
  const actionUrls = {
    "view-protocol": "/dashboard",
    "open-meals": "/nutrition",
    "quick-workout": "/workouts",
    "log-item": "/dashboard",
    "log-protein": "/nutrition",
    share: "/progress",
  };

  const url = event.action
    ? actionUrls[event.action] || "/dashboard"
    : event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Try to focus existing window and navigate
        for (const client of clients) {
          if ("focus" in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
