self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Notification", body: "Click to open the app.", icon: "./logo.png" };
  }

  const options = {
    body: data.body,
    icon: data.icon || "./logo.png",
    data: { url: data.url || "/admin/dashboard" } // pass link inside data
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // Focus any existing tab from this origin
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }

      // Open a new tab with absolute URL
      if (self.clients.openWindow) {
        return self.clients.openWindow(self.location.origin + targetUrl);
      }
    })
  );
});
