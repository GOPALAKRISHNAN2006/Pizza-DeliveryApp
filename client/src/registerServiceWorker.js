/**
 * Register Service Worker for client-side caching & offline support
 */
export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("⚡ Oasis Pizza Service Worker registered with scope:", registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("🔄 New content is available; please refresh.");
                  } else {
                    console.log("⚡ Content cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
    });
  }
}
