interface NotificationOptions {
  title?: string;
  body?: string;
  icon?: string;
  timeout?: number; // ms (desktop only)
  onClick?: () => void; // desktop only
}

export async function sendNotification({
  title = "Notification",
  body = "",
  icon = "",
  timeout = 5000,
  onClick,
}: NotificationOptions) {
  if (typeof window === "undefined") {
    console.warn("Notifications not supported in SSR");
    return;
  }

  try {
    // Ask for permission if needed
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission !== "granted") {
      console.warn("Notifications blocked by user");
      return;
    }

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );

    // ✅ Mobile → delegate to service worker
    if (isMobile && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        registration.showNotification(title, {
          body,
          icon,
          data: { url: window.location.href }, // optional: pass current page
        });
      }
      return;
    }

    // ✅ Desktop → use Notification API directly
    const notification = new Notification(title, { body, icon });

    if (timeout > 0) setTimeout(() => notification.close(), timeout);

    notification.onclick = () => {
      window.focus();
      if (onClick) onClick();
    };
  } catch (err) {
    console.error("Notification failed:", err);
  }
}
