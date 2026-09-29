// Oasis Pizza Service Worker - Browser Caching & Performance Optimization
const CACHE_VERSION = "oasis-pizza-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;

// Assets to precache immediately on SW install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/icons.svg"
];

// Install Event - Precache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale legacy caches
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log("[ServiceWorker] Purging stale cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic caching strategies based on resource type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and WebSocket / socket.io polling requests
  if (request.method !== "GET" || url.pathname.includes("/socket.io/")) {
    return;
  }

  // 1. Google Fonts Cache (Cache-First)
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. Images Cache (Cache-First with fallback to network)
  if (
    url.pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i) ||
    url.pathname.startsWith("/images/") ||
    url.hostname.includes("images.unsplash.com")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);
        });
      })
    );
    return;
  }

  // 3. Static scripts & stylesheets with Vite hashed names (Cache-First)
  if (url.pathname.startsWith("/assets/") && url.pathname.match(/\.[a-f0-9]{8,}\.(js|css)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 4. Stale-While-Revalidate for app navigation and remaining static files
  if (request.mode === "navigate" || url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Offline fallback to cached index.html for navigation
              if (request.mode === "navigate") {
                return cache.match("/index.html");
              }
            });
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
