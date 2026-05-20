// MYDAY2 PROGRESSIVE WEB APP SERVICE WORKER
// Manages background caching, offline asset loading, and push notification handlers.

const CACHE_NAME = "myday2-cache-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/supabase-client.js",
    "/ai-client.js",
    "/notification-service.js",
    "/ics-generator.js",
    "https://cdn.tailwindcss.com?plugins=forms,container-queries",
    "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
];

// Installation event: cache core assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Caching critical assets...");
            // Use return to ensure install wait succeeds even if some optional external fonts fail
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn("Service Worker: Some non-critical assets failed to cache during install.", err);
            });
        })
    );
    self.skipWaiting();
});

// Activation event: clear old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Service Worker: Removing old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: network fallback to cache with request pass-through
self.addEventListener("fetch", (event) => {
    // Only cache GET requests
    if (event.request.method !== "GET") return;

    // Ignore Supabase and Gemini requests
    const url = event.request.url;
    if (url.includes("supabase.co") || url.includes("googleapis.com")) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If valid network response, clone it into the cache
                if (response && response.status === 200 && response.type === "basic") {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed, lookup in cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    
                    // Fallback to offline index page if html request
                    if (event.request.headers.get("accept").includes("text/html")) {
                        return caches.match("/index.html");
                    }
                });
            })
    );
});

// Background Push Notification handler
self.addEventListener("push", (event) => {
    let payload = { title: "MYDAY2 Notification", body: "Check in on your daily agenda." };
    
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            vibrate: [200, 100, 200]
        })
    );
});

// Click event for push notifications
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow("/");
        })
    );
});
