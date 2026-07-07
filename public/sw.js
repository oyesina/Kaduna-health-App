self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || "/icon.png",
    badge: "/badge.png",
    data: data.data,
    actions: [
      { action: "explore", title: "View Details" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  if (event.action === "explore") {
    event.waitUntil(
      clients.openWindow("/")
    );
  }
});
