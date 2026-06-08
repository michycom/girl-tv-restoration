const CACHE_NAME = "girltv-shell-v2";
const scopeUrl = new URL(self.location.href);
const ASSETS = [
  new URL("./", scopeUrl).toString(),
  new URL("./index.html", scopeUrl).toString(),
  new URL("./app.js", scopeUrl).toString(),
  new URL("./sw.js", scopeUrl).toString(),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch((err) => {
      console.warn("Cache install failed", err);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const dest = request.destination;
  const isShell =
    request.mode === "navigate" ||
    dest === "script" ||
    dest === "style" ||
    dest === "worker" ||
    dest === "document";

  if (!isShell) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request);
    })
  );
});

self.addEventListener("message", (event) => {
  const type = event.data?.type;
  if (type === "REFRESH_ASSETS") {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
  }
  if (type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
